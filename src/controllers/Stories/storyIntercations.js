const Stories = require("../../models/Stories/story");
const Users = require("../../models/auth");
const Profile = require("../../models/profile");
const Notification = require("../../models/Blogs/notification");
const { getIO } = require("../../config/socket");

const toggleLikeStory = async(req,res)=>{
    try{
        const { id } = req.params;

        if(!req.userId){
            return res.status(401).json({success: false, message: "Unauthorized"});
        }

        const story = await Stories.findById(id);
        if(!story){
            return res.status(404).json({success: false, message: "Story not found"});
        }

        if(!story.likedBy){
            story.likedBy = [];
        }

        const alreadyLiked = story.likedBy.some(
            (userId) => userId.toString() === req.userId
        );

        if(alreadyLiked){
            story.likedBy = story.likedBy.filter(
                (userId) => userId.toString() !== req.userId
            );
            story.likes = story.likedBy.length;
            await story.save();

            getIO().to(story.userId.toString()).emit("storyLikeUpdate", {
                storyId: story._id,
                likes: story.likes,
                liked: false,
                userId: req.userId
            });

            return res.status(200).json({
                success: true,
                message: "Story unliked",
                liked: false,
                likes: story.likes
            });
        }

        story.likedBy.push(req.userId);
        story.likes = story.likedBy.length;
        await story.save();

        getIO().to(story.userId.toString()).emit("storyLikeUpdate", {
            storyId: story._id,
            likes: story.likes,
            liked: true,
            userId: req.userId
        });

        if(story.userId.toString() !== req.userId){
            const profile = await Profile.findOne({ userId: req.userId });
            if(profile){
                const existingNotification = await Notification.findOne({
                    recipientId: story.userId,
                    senderId: req.userId,
                    postId: story._id,
                    type: "like"
                });

                if(!existingNotification){
                    const notification = await Notification.create({
                        recipientId: story.userId,
                        senderId: req.userId,
                        profileId: profile._id,
                        username: profile.username,
                        avator: profile.avator,
                        postcontent: story.content,
                        postId: story._id,
                        type: "like"
                    });

                    getIO().to(story.userId.toString()).emit("newNotification", notification);
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "Story liked",
            liked: true,
            likes: story.likes
        });
    } catch(error){
        return res.status(500).json({success: false, message: "Server error", error: error.message});
    }
}

const markStorySeen = async(req,res)=>{
    try{
        const { id } = req.params;

        if(!req.userId){
            return res.status(401).json({success: false, message: "Unauthorized"});
        }

        const story = await Stories.findById(id);
        if(!story){
            return res.status(404).json({success: false, message: "Story not found"});
        }

        if(!story.viewedBy){
            story.viewedBy = [];
        }

        const alreadySeen = story.viewedBy.some(
            (userId) => userId.toString() === req.userId
        );

        if(!alreadySeen){
            story.viewedBy.push(req.userId);
            await story.save();

            getIO().to(story.userId.toString()).emit("storySeenUpdate", {
                storyId: story._id,
                viewedBy: story.viewedBy,
                userId: req.userId
            });
        }

        return res.status(200).json({success: true, message: "Story marked as seen", viewedBy: story.viewedBy});
    } catch(error){
        return res.status(500).json({success: false, message: "Server error", error: error.message});
    }
}

module.exports = {toggleLikeStory, markStorySeen}