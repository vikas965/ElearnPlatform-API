import mongoose from "mongoose";

const UserCourses= mongoose.Schema({
    coursename:String,
    domain:String,
    enrollcount:Number,
    duration:Number


       
})

const Courses = mongoose.model("Courses",UserCourses);

export default Courses;