const Posts = require("../../models/Blogs/post");
const Users = require("../../models/auth");
const Profile = require("../../models/profile");
const Notification = require("../../models/Blogs/notification");

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const post = await Posts.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (!post.likedBy) {
      post.likedBy = [];
    }

    const alreadyLiked = post.likedBy.some(
      (userId) => userId.toString() === req.userId
    );

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(
        (userId) => userId.toString() !== req.userId
      );
      post.likes = post.likedBy.length;
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post unliked",
        liked: false,
        likes: post.likes,
      });
    }

    post.likedBy.push(req.userId);
    post.likes = post.likedBy.length;
    await post.save();

    if (post.userId.toString() !== req.userId) {
      const profile = await Profile.findOne({ userId: req.userId });
      if (profile) {
        const existingNotification = await Notification.findOne({
          recipientId: post.userId,
          senderId: req.userId,
          postId: post._id,
          type: "like",
        });

        if (!existingNotification) {
          await Notification.create({
            recipientId: post.userId,
            senderId: req.userId,
            profileId: profile._id,
            username: profile.username,
            avator: profile.avator,
            postcontent: post.content,
            postId: post._id,
            type: "like",
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Post liked",
      liked: true,
      likes: post.likes,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!text) {
      return res
        .status(400)
        .json({ success: false, message: "Comment text is required" });
    }

    const user = await Users.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const post = await Posts.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const comment = {
      userId: req.userId,
      profileId: profile._id,
      username: profile.username,
      avator: profile.avator,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    if (post.userId.toString() !== req.userId) {
      await Notification.create({
        recipientId: post.userId,
        senderId: req.userId,
        profileId: profile._id,
        username: profile.username,
        avator: profile.avator,
        postcontent: post.content,
        postId: post._id,
        type: "comment",
        text,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const post = await Posts.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (
      comment.userId.toString() !== req.userId &&
      post.userId.toString() !== req.userId
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    comment.deleteOne();
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Posts.findById(id).select("comments");
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({ success: true, comments: post.comments });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { toggleLike, addComment, deleteComment, getComments };