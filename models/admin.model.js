import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","superAdmin"],
        default:'admin'
    },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

export const Admin = mongoose.model("Admin", userSchema);



















// import mongoose from "mongoose"
// const userSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
//     role:{
//         type:String,
//         enum:["user","admin","superAdmin"],
//         default:'user'
//     },
//     isBlocked: {
//     type: Boolean,
//     default: false
//     }

// },{timestamps:true});

// export const User = mongoose.model("User", userSchema);