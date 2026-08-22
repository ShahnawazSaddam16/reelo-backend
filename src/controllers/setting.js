const Setting = require("../models/setting");
const Users = require("../models/auth");

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

module.exports = {createNotificationControl, getNotificationControl};