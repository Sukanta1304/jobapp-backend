const express= require("express");
const cors= require("cors");
const { connection } = require("./db/db");
const { userRouter } = require("./routes/userRoute");
const { jobRouter } = require("./routes/jobRoute");
require("dotenv").config();

const app= express();
app.use(express.json());
app.use(cors());

const PORT= process.env.PORT || 8080
app.get("/",(req,res)=>{
    res.send("Welcome to job app url")
})

app.use("/user",userRouter);
app.use("/jobs",jobRouter)

app.listen(PORT,async()=>{
    try {
        await connection;
        console.log("DB connected")
    } catch {
        console.log("DB connection failed")
    }
    console.log("app started")
})