const Posts = require("../Blogs/post");

const createPost = async (req, res) => {
    try {
        const { content, title, desc } = req.body;

        if (!content || !title) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const newPost = await Posts.create({
            userId: req.userId,
            email: req.email,
            content,
            title,
            desc,
        });

        return res.status(201).json({ success: true, message: "Post created successfully", post: newPost });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = { createPost };