const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new mongoose.Schema(
  {
    fName: { type: String, required: false },
    lName: { type: String, required: false },
    userName: { type: String, unique: true, default: null },
    email: { type: String, required: true, unique: true },
    userCode: { type: String, slug: ["userName"], unique: true, permanent: true },
    password: { type: String, required: true },
    dob: { type: Date, required: false },
    gender: { type: String, required: false },
    professionType: {
      type: String,
      enum: ["STUDENT", "WORKING PROFESSION", "CURRENTLY NOT WORKING"],
    },
    institute_name: { type: Schema.Types.ObjectId, ref: "institute", required: false },
    // url: { type: String, default: null },
    // photoUrl: { type: String, default: null },
    // phoneNo: { type: Number, default: null },
    otp: { type: Number, default: null },
    forgetPasswordOtp: { type: Number, default: null },
    token: { type: String, default: null },
    // signupType: { type: Number, required: true },
    expTime: { type: Date },
    categoryInterest: [{ type: String }], // [culinary-arts-crusine, ...]
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
