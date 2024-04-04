import express from "express";
import Userdetails from "../model/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const router = express.Router();
dotenv.config();


router.post("/login",async (req,res)=>{
    try{
        const {email,password} = req.body;
        console.log(password);
    const registeredemail = await Userdetails.findOne({email}); 
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

export default router;