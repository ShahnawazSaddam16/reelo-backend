const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const dbConnection = require("./src/config/dbConnection");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const blogRoutes = require("./src/routes/BlogRoutes");
const settingRoutes = require("./src/routes/settingRoutes");
const storyRoutes = require("./src/routes/StoryRoutes");
const { initSocket } = require("./src/config/socket");

const app = express();
const PORT = process.env.PORT || 5015;

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/story", storyRoutes);

dbConnection();

const server = http.createServer(app);
initSocket(server);

server.on("error", (err) => {
    console.error("Server failed to start:", err);
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Running Successfully at ${PORT}`);
});