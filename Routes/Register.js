import express from "express";
import bcrypt from 'bcrypt';
import Userdetails from "../model/User.js";
import { Resend } from 'resend';
const router = express.Router();



router.post("/register", async (req, res) => {
    const { name = "", password = "", email = "" } = req.body;
    // sendMail(email,name);
    // Check if email is already registered
    const existingUser = await Userdetails.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
    }

    // Check password strength (e.g., minimum length)
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await Userdetails.create({
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

export default router;
