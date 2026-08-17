const Posts = require("../../models/Blogs/post");
const Users = require("../../models/auth");

const createPost = async (req, res) => {
  try {
    const { content: bodyContent, title, desc } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await Users.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let content = bodyContent || null;
    let contentType = bodyContent ? "text" : null;

    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      content =
        file.path ||
        file.secure_url ||
        file.url ||
        file.location ||
        file.filename ||
        null;
      contentType = file.mimetype || null;
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Please provide content or upload a media file",
      });
    }

    const newPost = await Posts.create({
      userId: req.userId,
      email: user.email,
      content,
      contentType,
      title,
      desc,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const userPosts = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const userPosts = await Posts.find({ userId: req.userId });

    if (!userPosts) {
      return res
        .status(404)
        .json({ success: false, message: "User Posts not found" });
    }

    return res.status(200).json({ success: true, userPosts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
};

module.exports = { createPost, userPosts };
