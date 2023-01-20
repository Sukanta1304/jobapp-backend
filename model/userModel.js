
const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    pic:String,
    contact: String,
    address: String,
    otp:String,
    attempt: Number,
    blocked: Number
});

const UserModel= mongoose.model("user",userSchema);

module.exports={
    UserModel
}