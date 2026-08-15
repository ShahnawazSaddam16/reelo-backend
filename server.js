const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnection = require("./src/config/dbConnection");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
dotenv.config();
const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

//Routes
app.use("/api/auth", authRoutes);

//dbConnection
dbConnection();


//Server Listining
app.listen(PORT, (err)=>{
    try{
        console.log(`Server Running Successfully at ${PORT}`);
    } catch(err){
        console.error(err);
    }
})