const { verifyToken } = require("./CreateToken");

const Authentication=(req,res,next)=>{
    const token = req.headers.token;
    if(!token){
        res.status(401).send(`You are unauthorized . Please Login first`)
    }else{
        let ans= verifyToken(token);
        req.body.id= ans.user;
        next()
    }
}

module.exports={Authentication}