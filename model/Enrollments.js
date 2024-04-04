import mongoose from "mongoose";

const EnrollSchema = mongoose.Schema({
    userid :String ,
    courseid :String,
    timestamp: { type: Date, default: Date.now }
})

const Enrolldetails = mongoose.model("Enrollments",EnrollSchema);

export default Enrolldetails;