
import express from "express";
import mongoose from 'mongoose';
import { Resend } from 'resend';
import RegisterRoute from "./Routes/Register.js"
import dotenv from 'dotenv';
import cors from 'cors';
import UserRoute from "./Routes/userRoutes.js"
import loginRoute from './Routes/Login.js';
import adminRoute from './Routes/adminRoutes.js'
dotenv.config();


// const { DbUrl} = process.env;
const DbUrl = 'mongodb+srv://21341a0598:dtcKuKlQmZAJTXg6@cluster0.amrllyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
async function connectdb()
{
    try{

        await mongoose.connect(DbUrl);
        console.log('Connected To Database');
    }
    catch(err)
    {
        console.log(err.message);
    }
}

connectdb()





const app = express();
app.use(express.json());
app.use(cors());
app.use("/",RegisterRoute);
app.use("/",UserRoute);
app.use("/",loginRoute);
app.use("/",adminRoute);
app.listen(3001, () => {
    console.log("Server Connected");
});
