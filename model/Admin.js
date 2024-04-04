import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    name:String,
    email:String,
    password: String,
    
})

const Admindetails = mongoose.model("Admins",adminSchema);

export default Admindetails;