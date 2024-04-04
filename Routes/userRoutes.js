
import express from "express";
import Userdetails from "../model/User.js";
import bcrypt from 'bcrypt';
import authRoute from "./authRoute.js";
import cloudinary from "cloudinary";
import fs from "fs";
import multer from "multer";
import Enrolldetails from "../model/Enrollments.js";
import Courses from "../model/Course.js";
// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dffrcy9y7',
  api_key: '733245193592217',
  api_secret: 'qL5clSKapy3dgThOSCy__Iy-JdY'
});
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
router.put('/user/image',authRoute,  upload.single('file'),async (req, res) => {
    // const userIdToUpdate = req.params.id;
    const userIdToUpdate  = req.user._id;
    try {
      // Find user by ID
      const user = await Userdetails.findById(userIdToUpdate);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
  
      // Update user's image URL
      user.imagurl = cloudinaryResponse.url;
  
      
      await user.save();
  
      
      fs.unlinkSync(req.file.path);
  
      res.status(200).json({ message: 'User image URL updated successfully', user });
    } catch (error) {
      console.error("Error updating user image URL:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
});



// get user details
router.get("/user",authRoute, async (req, res) => {
    try {
        const id = req.user._id;

        const user = await Userdetails.findById(id);
        res.json(user);
    } catch (error) {
        console.log(error.message);
    }
})



// Edit Profile



router.put("/userupdate",authRoute, async (req, res) => {
    try {
        const id = req.user._id;
        const name = req.body.name;
        const email = req.body.email;
        const user = await Userdetails.findByIdAndUpdate(id, { $set: { name: name, email: email } }, { new: true });
        res.json(user);

    } catch (error) {
        console.log(error.message);
    }
})



// Enroll To a Course 
router.post("/enroll/:id", authRoute, async (req, res) => {
    try {
        // Extracting user id from authenticated user
        const userId = req.user._id;
        
        // Extracting course id from parameters
        const courseId = req.params.id;
        
        // Check if the user is already enrolled in the course
        const existingEnrollment = await Enrolldetails.findOne({ userid: userId, courseid: courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "User is already enrolled in this course" });
        }

        // Creating a new enrollment
        const newEnrollment = new Enrolldetails({
            userid: userId,
            courseid: courseId,
            timestamp: Date.now() // Storing the current date and time
        });

        // Saving the enrollment
        await newEnrollment.save();

         // Update enroll count on courses table
         await Courses.findByIdAndUpdate(courseId, { $inc: { enrollcount: 1 } });
        res.status(201).json({ message: "Course enrollment successful" });
    } catch (err) {
        console.error("Error enrolling course:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});




router.get("/enrolled-courses", authRoute, async (req, res) => {
    try {
        // Extracting user id from authenticated user
        const userId = req.user._id;

        // Find all enrollments for the current user
        const userEnrollments = await Enrolldetails.find({ userid: userId });

        // Extract course ids from user enrollments
        const courseIds = userEnrollments.map(enrollment => enrollment.courseid);

        // Fetch course details for the enrolled courses
        const enrolledCourses = await Courses.find({ _id: { $in: courseIds } });

        res.status(200).json({ enrolledCourses });
    } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;