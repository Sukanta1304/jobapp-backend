const mongoose=require("mongoose");

const jobSchema= new mongoose.Schema({
    company:String,
    locate:String,
    position:String,
    companyDetails:String,
    salary:String,
    skillrequire:String,
    catagory:String,
    postby:String,
})

const applyJobSchema= new mongoose.Schema({
    jobid:String,
    company:String,
    position:String,
    salary:String,
    locate:String,
    user:String
});

const JobModel= mongoose.model("jobs",jobSchema);
const ApplyJobModel= mongoose.model("applyJobs",applyJobSchema);

module.exports={JobModel,ApplyJobModel}