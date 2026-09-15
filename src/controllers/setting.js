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

const addAllowedViewer = async(req,res)=>{
    try{
        const {viewerId} = req.body;
        const userId = req.userId;

        const setting = await Setting.findOne({userId});
        if(!setting){
            return res.status(404).json({message:"setting not found"});
        }

        if(setting.accountType !== "private"){
            return res.status(400).json({message:"account is not private"});
        }

        const viewer = await Users.findById(viewerId);
        if(!viewer){
            return res.status(404).json({message:"viewer not found"});
        }

        if(!setting.allowedViewers.includes(viewerId)){
            setting.allowedViewers.push(viewerId);
            await setting.save();
        }

        res.status(200).json(setting);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const removeAllowedViewer = async(req,res)=>{
    try{
        const {viewerId} = req.body;
        const userId = req.userId;

        const setting = await Setting.findOne({userId});
        if(!setting){
            return res.status(404).json({message:"setting not found"});
        }

        setting.allowedViewers = setting.allowedViewers.filter(
            (id) => id.toString() !== viewerId
        );
        await setting.save();

        res.status(200).json(setting);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const getAllowedViewers = async(req,res)=>{
    try{
        const userId = req.userId;

        const setting = await Setting.findOne({userId}).populate("allowedViewers", "email");
        if(!setting){
            return res.status(404).json({message:"setting not found"});
        }

        res.status(200).json({allowedViewers: setting.allowedViewers});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

module.exports = {createNotificationControl, getNotificationControl, updateAccountType, addAllowedViewer, removeAllowedViewer, getAllowedViewers};