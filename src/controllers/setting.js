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

        const followerProfile = await Profile.findOne({username}).select("username avator email userId");

        if(!followerProfile){
            return res.status(404).json({message:"profile not found"});
        }

        if(followerProfile.userId.toString() === userId.toString()){
            return res.status(400).json({message:"cannot follow yourself"});
        }

        const ownProfile = await Profile.findOne({userId});

        if(!ownProfile){
            return res.status(404).json({message:"profile not found"});
        }

        if(!Array.isArray(ownProfile.followers)){
            ownProfile.followers = [];
        }

        const alreadyFollowing = ownProfile.followers.some(f => f.userId && f.userId.toString() === followerProfile.userId.toString());

        if(alreadyFollowing){
            return res.status(400).json({message:"already following"});
        }

        ownProfile.followers.push({
            userId: followerProfile.userId,
            username: followerProfile.username,
            email: followerProfile.email,
            avator: followerProfile.avator
        });

        await ownProfile.save();

        res.status(200).json({
            profile: ownProfile,
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

        const followerProfile = await Profile.findOne({username}).select("username avator email userId");
        if(!followerProfile){
            return res.status(404).json({message:"profile not found"});
        }

        const ownProfile = await Profile.findOne({userId});
        if(!ownProfile){
            return res.status(404).json({message:"profile not found"});
        }

        if(!Array.isArray(ownProfile.followers)){
            ownProfile.followers = [];
        }

        const isFollowing = ownProfile.followers.some(f => f.userId && f.userId.toString() === followerProfile.userId.toString());

        if(!isFollowing){
            return res.status(400).json({message:"not following"});
        }

        ownProfile.followers = ownProfile.followers.filter(f => !f.userId || f.userId.toString() !== followerProfile.userId.toString());
        await ownProfile.save();

        res.status(200).json(ownProfile);
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

        res.status(200).json({ followers: profile.followers });
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

module.exports = {createNotificationControl, getNotificationControl, updateAccountType, addFollower, removeFollower, getFollowers}