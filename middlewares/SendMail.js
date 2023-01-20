const nodemailer= require("nodemailer");
require("dotenv").config();

const sendMail=(email)=>{
    const transporter= nodemailer.createTransport({
        host:"smtp.gmail.com",
        port: 465,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASS
        },
    });
    let otp=Math.floor(100000 + Math.random() * 900000);
    transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject:"Verification Mail",
        html:`your one time password for verification is <b>${otp}</b>`
    }).then((res)=>{
        console.log(`Mail sent successfully`);
    }).catch((err)=>{
        console.log(`Something went wrong`);
    });
    return otp;
}

module.exports={sendMail}