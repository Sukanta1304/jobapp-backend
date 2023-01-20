const jwt= require("jsonwebtoken");
require("dotenv").config();

const createToken=(id)=>{
    const token=jwt.sign({user:id},process.env.SECRET,{ expiresIn: '10h' });
    return token;
}

const verifyToken=(token)=>{
    const decode= jwt.verify(token,process.env.SECRET);
    return decode;
}

module.exports={createToken , verifyToken}