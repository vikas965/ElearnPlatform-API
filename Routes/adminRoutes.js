import express from "express";
import Courses from "../model/Course.js";
import authRoute from "./authRoute.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admindetails from "../model/Admin.js";
import Userdetails from "../model/User.js";

dotenv.config();
const router = express.Router();


// Admin Register
router.post("/addadmin", async (req, res) => {
    const { name = "", password = "", email = "" } = req.body;
    const existingUser = await Admindetails.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
    }
  
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await Admindetails.create({
            name,
            email,
            password: hashedPassword
        });

        res.json(user);
    } catch (err) {
        console.log("error", err);
        res.status(500).json({ error: "Error creating user data" });
    }
});

// Admin Login
router.post("/adminlogin",async (req,res)=>{
    try{
        const {email,password} = req.body;
        console.log(password);
    const registeredemail = await Admindetails.findOne({email}); 
    if(!registeredemail){
        return res.json({"error" : "email doesnot exists"});
    }
    else{
        const exist = await bcrypt.compare(password,registeredemail.password);   
    if(!exist){
        return res.json({"message":"password incorrect"});
    }
    else{
        const token = jwt.sign({registeredemail},process.env.SECRET_KEY , {expiresIn : "1hr"}); 
        console.log('token',token);
        return res.json({token})
    }
    }
    } catch(err){
        console.log("error",err);
    }
})

// get course by id
router.get("/course/:id",authRoute, async (req, res) => {
    try {
        const id = req.params.id;
        const course = await Courses.findById(id);
         res.json(course);
    } catch (error) {
        console.log(error.message);
    }
})

// delete course
router.delete("/deletecourse/:id",authRoute, async (req, res) => {
    try {
        const id = req.params.id;
        const course = await Courses.findByIdAndDelete(id);
         res.json(course);
    } catch (error) {
        console.log(error.message);
    }
})


// add course
router.post("/addcourse",authRoute, async (req, res) => {
    const { coursename = "", domain = "", enrollcount = "", duration = "" } = req.body;

    
   

    try {
        const Course = await Courses.create({
            coursename,
            domain,
            enrollcount,
            duration
        })
        res.json(Course);
    } catch (err) {
        console.log("error", err);
        res.json({ "error": "error creating data" });
    }
})

// update course by id 
router.put("/updatecourse/:id",authRoute, async (req, res) => {
    const { coursename = "", domain = "", enrollcount = "", duration = "" } = req.body;

    
   

    try {
        const id = req.params.id;
  
        const Course = await Courses.findByIdAndUpdate(id,{$set:{
            coursename:coursename,
            domain:domain,
            enrollcount:enrollcount,
            duration:duration
    }},{ new: true })
        res.json(Course);
    } catch (err) {
        console.log("error", err);
        res.json({ "error": "error creating data" });
    }
})

// get all courses
router.get("/courses", authRoute,async (req, res) => {
    try {
        const courses = await Courses.find();
        res.json(courses);
    } catch (err) {
        res.json({ "message": "error getting data" });
    }
})


// get users

router.get("/users",authRoute, async (req, res) => {
    try {
        const users = await Userdetails.find();
        res.json(users);
    } catch (err) {
        res.json({ "message": "error getting data" });
    }
})

export default router;