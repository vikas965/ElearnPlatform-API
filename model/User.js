import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name:String,
    email:String,
    password: String,
    imagurl:String
})

const Userdetails = mongoose.model("Users",UserSchema);

export default Userdetails;