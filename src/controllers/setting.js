const Setting = require("../models/setting");
const Users = require("../models/auth");
const Profile = require("../models/profile");

const createNotificationControl = async(req,res)=>{
    try{
        const {notificationSwitch} = req.body;
        const userId = req.userId;

        const user = await Users.findById(userId);
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        let setting = await Setting.findOne({userId});

        if(!setting){
            setting = await Setting.create({
                userId,
                email: user.email,
                notificationSwitch
            });
        }else{
            setting.notificationSwitch = notificationSwitch;
            await setting.save();
        }

        res.status(200).json(setting);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const getNotificationControl = async(req,res)=>{
    try{
        const userId = req.userId;

        const setting = await Setting.findOne({userId});

        if(!setting){
            return res.status(404).json({message:"setting not found"});
        }

        res.status(200).json(setting);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const updateAccountType = async(req,res)=>{
    try{
        const {accountType} = req.body;
        const userId = req.userId;

        const user = await Users.findById(userId);
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        let setting = await Setting.findOne({userId});

        if(!setting){
            setting = await Setting.create({
                userId,
                email: user.email,
                accountType
            });
        }else{
            setting.accountType = accountType;
            await setting.save();
        }

        res.status(200).json(setting);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const addFollower = async(req,res)=>{
    try{
        const {username} = req.body;
        const userId = req.userId;

        if(!username){
            return res.status(400).json({message:"username is required"});
        }

        const targetProfile = await Profile.findOne({username});

        if(!targetProfile){
            return res.status(404).json({message:"profile not found"});
        }

        if(targetProfile.userId.toString() === userId.toString()){
            return res.status(400).json({message:"cannot follow yourself"});
        }

        if(!Array.isArray(targetProfile.followers)){
            targetProfile.followers = [];
        }

        if(targetProfile.followers.includes(userId)){
            return res.status(400).json({message:"already following"});
        }

        targetProfile.followers.push(userId);

        await targetProfile.save();

        const followerProfile = await Profile.findOne({userId}).select("username avator email");

        res.status(200).json({
            profile: targetProfile,
            follower: followerProfile
        });
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const removeFollower = async(req,res)=>{
    try{
        const {username} = req.body;
        const userId = req.userId;

        if(!username){
            return res.status(400).json({message:"username is required"});
        }

        const targetProfile = await Profile.findOne({username});
        if(!targetProfile){
            return res.status(404).json({message:"profile not found"});
        }

        if(!Array.isArray(targetProfile.followers)){
            targetProfile.followers = [];
        }

        if(!targetProfile.followers.includes(userId)){
            return res.status(400).json({message:"not following"});
        }

        targetProfile.followers = targetProfile.followers.filter(id => id.toString() !== userId.toString());
        await targetProfile.save();

        res.status(200).json(targetProfile);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const getFollowers = async(req,res)=>{
    try{
        const userId = req.userId;

        const profile = await Profile.findOne({userId});
        if(!profile){
            return res.status(404).json({message:"profile not found"});
        }

        if(!Array.isArray(profile.followers)){
            profile.followers = [];
        }

        const followers = await Profile.find({ userId: { $in: profile.followers } }).select("username avator email");

        res.status(200).json({ followers });
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

module.exports = {createNotificationControl, getNotificationControl, updateAccountType, addFollower, removeFollower, getFollowers}