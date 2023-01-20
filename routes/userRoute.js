
const {Router}= require("express");
const { Authentication } = require("../middlewares/Authentication");
const { createToken, verifyToken } = require("../middlewares/CreateToken");
const { hashPassword, comparePassword } = require("../middlewares/Password");
const { sendMail } = require("../middlewares/SendMail");
const { UserModel } = require("../model/userModel");

const userRouter= Router();

userRouter.get("/", async(req,res)=>{
    const users= await UserModel.find();
    res.send(users)
})
userRouter.get("/singleuser", Authentication,async(req,res)=>{
    const {id}= req.body;
    const user= await UserModel.find({_id:id});
    if(user){
        res.status(200).send(user)
    }else{
        res.status(404).send("No user present ")
    }
})

userRouter.post("/register", async(req,res)=>{
    const {firstname,lastname,email,password}= req.body;
    let ExistUser= await UserModel.findOne({email});
    if(ExistUser){
        res.status(409).send(`User Already Exist`)
    }else{
        let hashed= hashPassword(password);
        const newUser= new UserModel({firstname,lastname,email,password:hashed,
                                       pic:"",contact:"",address:"",otp:"",
                                       attempt:0,blocked:0});
        await newUser.save();
        res.status(201).send(`Successfully Registered`)
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}= req.body;
    let ExistUser= await UserModel.findOne({email});
    if(ExistUser){
        let pass= ExistUser.password;
        let attempt =ExistUser.attempt;
        let blocked= ExistUser.blocked;
        let id= ExistUser._id;
        let currentDate= new Date();
        let decrypt= comparePassword(password,pass);
        if(decrypt && blocked<=currentDate){
            await UserModel.findByIdAndUpdate({_id:id},{$set:{attempt:0,blocked:0}});
            const token= createToken(id)
            res.status(200).send({msg:`Successfully Loggedin`,token:token})
        }
        else if(decrypt && blocked>currentDate){
            res.status(401).send(`Your account is blocked for 24 hrs.`)
        }
        else{
            attempt++;
            await UserModel.findByIdAndUpdate({_id:id},{$set:{attempt:attempt}});
            if(attempt>=3){
                let currentDate= new Date();
                const lastAttemp= new Date(currentDate);
                const blockFor=lastAttemp.setHours(lastAttemp.getHours()+24);
                await UserModel.findByIdAndUpdate({_id:id},{$set:{blocked:blockFor}});
                res.status(401).send(`Your account is blocked for 24 hrs.`)
            }else{
                res.status(401).send(`You made ${attempt} unseccsuccful attempt.
                                      Be careful. 3 Unseccessfull attempt may
                                      block your account for 24hrs. If You think
                                      you forgot password reset it.`)
            }
        }
    }else{
        res.status(404).send(`No user found`)
    }
})

userRouter.put("/edituser",Authentication,async(req,res)=>{
    const {id}= req.body;
    const update=await UserModel.findByIdAndUpdate({_id:id},{...req.body});
    if(update){
        res.status(201).send(`Profile successfully updated`)
    }
    else{
        res.status(400).send(`Something went wrong`)
    }
})
userRouter.patch("/auth/forgotpassword",async(req,res)=>{
    const {email}= req.body;
    let ExistUser= await UserModel.findOne({email});
    if(!ExistUser){
        res.status(404).send(`You are not a registered user. Please Register`)
    }else{
        let id= ExistUser._id;
        let ans= sendMail(email);
        if(ans){
            await UserModel.findByIdAndUpdate({_id:id},{$set:{otp:ans}});
            res.status(200).send(`We just sent you an OTP — check it out!`)
        }else{
            res.status(500).send(`Internal Server error. Try after some time`)
        }
        
    }
})

userRouter.put("/auth/resetpassword",async(req,res)=>{
    const {email,otp,password}= req.body;
    let ExistUser= await UserModel.findOne({email});
    if(ExistUser){
        let ExistOtp= ExistUser.otp ;
        let id= ExistUser._id;
        let hashed= hashPassword(password);
        if(otp==ExistOtp){
            const update=await UserModel.findByIdAndUpdate({_id:id},{$set:{otp:"",password:hashed}});
            res.status(200).send(`Password reset Successfully. Now 
                                  try Logging in with new Passsword`)
        }else{
            res.status(400).send(`Enter correct OTP`)
        }
    }else{
        res.status(404).send(`Mail id not found!!!`)
    }
})

module.exports={userRouter}