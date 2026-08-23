const Stories = require("../../models/Stories/story");
const Users = require("../../models/auth");
const Profile = require("../../models/profile");
const Notification = require("../../models/Blogs/notification");
const { getIO } = require("../../config/socket");

const createStory = async(req,res)=>{
    try{
        const userId = req.userId;

        if(!req.file){
            return res.status(401).json({success: false, message: "Please fill all fields"});
        }

        const user = await Users.findById(userId);

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        const profile = await Profile.findOne({userId: userId});

        if(!profile){
            return res.status(404).json({success: false, message: "Profile not found"});
        }

        const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

        const story = await Stories.create({
            userId: userId,
            profileId: profile._id,
            email: user.email,
            avator: profile.avator,
            username: profile.username,
            content: req.file.path,
            mediaType: mediaType
        });

        return res.status(201).json({success: true, message: "Story created successfully", story});

    }catch(error){
        return res.status(500).json({success: false, message: "Internal server error", error: error.message});
    }
}

const getStory = async(req,res)=>{
    try{
        const userId = req.userId;

        const user = await Users.findById(userId);

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        const stories = await Stories.find({userId: userId, expiresAt: {$gt: new Date()}}).sort({createdAt: -1});

        return res.status(200).json({success: true, stories});

    }catch(error){
        return res.status(500).json({success: false, message: "Internal server error", error: error.message});
    }
}

const getAllStories = async(req,res)=>{
    try{
        const allStories = await Stories.find()
          .populate("userId", "username avator")
          .sort({createdAt: -1});

        if(!allStories){
            return res.status(404).json({success: false, message: "Stories are not found"});
        }

        return res.status(200).json({success: true, allStories});
    } catch(err){
        return res.status(500).json({success: false, err});
    }
}


module.exports = {createStory, getStory, getAllStories};