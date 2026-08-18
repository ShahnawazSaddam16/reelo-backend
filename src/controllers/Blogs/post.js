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
      likes: 0,
      comments: [],
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

const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content: bodyContent, title, desc } = req.body;

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const post = await Posts.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    let content = bodyContent || post.content;
    let contentType = post.contentType;

    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      content =
        file.path ||
        file.secure_url ||
        file.url ||
        file.location ||
        file.filename ||
        content;
      contentType = file.mimetype || contentType;
    } else if (bodyContent) {
      contentType = "text";
    }

    post.content = content;
    post.contentType = contentType;
    post.title = title || post.title;
    post.desc = desc || post.desc;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const post = await Posts.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await Posts.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getAllPosts = async(req,res)=>{
  try{
    const allposts = await Posts.find().sort({createdAt: -1});

    return res.status(200).json({success: true, allposts});
  } catch(err){
    console.error(err);
    return res.status(500).json({success: false, message: err});
  }
}

module.exports = { createPost, userPosts, editPost, deletePost, getAllPosts };