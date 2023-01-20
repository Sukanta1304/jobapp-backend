const bcrypt= require("bcrypt");
require("dotenv").config();

const hashPassword=(password)=>{
    const hash = bcrypt.hashSync(password, 6);
    return hash;
};
const comparePassword=(password,hashP)=>{
    const result= bcrypt.compareSync(password,hashP);
    return result;
}
module.exports={hashPassword , comparePassword}