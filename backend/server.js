const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ================= MongoDB Connection ================= */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* ================= Image Upload Setup ================= */

const storage = multer.diskStorage({

destination:(req,file,cb)=>{
cb(null,"uploads/");
},

filename:(req,file,cb)=>{
cb(null,Date.now()+path.extname(file.originalname));
}

});

const upload = multer({storage});

/* Serve uploaded images */

app.use("/uploads",express.static("uploads"));

/* ================= Models ================= */

/* User Model */

const User = mongoose.model("User",{

name:String,
phone:String

});

/* Vehicle Model */

const Vehicle = mongoose.model("Vehicle",{

type:String,
name:String,
ownerName:String,
company:String,
number:String,
location:String,
contact:String,
image:String

});

/* ================= User Routes ================= */

/* Add User (Login/Register) */

app.post("/login",async(req,res)=>{

try{

const user = new User({
name:req.body.name,
phone:req.body.phone
});

await user.save();

res.json(user);

}catch(err){

console.log(err);
res.status(500).json({error:"User save failed"});

}

});

/* Get All Users */

app.get("/users",async(req,res)=>{

try{

const users = await User.find();
res.json(users);

}catch(err){

res.status(500).json(err);

}

});

/* ================= Vehicle Routes ================= */

/* Add Vehicle */

app.post("/vehicles",upload.single("image"),async(req,res)=>{

try{

const vehicle = new Vehicle({

type:req.body.type,
name:req.body.name,
ownerName:req.body.ownerName,
company:req.body.company,
number:req.body.number,
location:req.body.location,
contact:req.body.contact,
image:req.file ? req.file.filename : null

});

await vehicle.save();

res.status(200).json(vehicle);

}catch(err){

console.log(err);
res.status(500).json({error:"Vehicle upload failed"});

}

});

/* Get All Vehicles */

app.get("/vehicles",async(req,res)=>{

try{

const vehicles = await Vehicle.find();
res.json(vehicles);

}catch(err){

res.status(500).json(err);

}

});

/* Get Vehicles By Type */

app.get("/vehicle/:type",async(req,res)=>{

try{

const vehicles = await Vehicle.find({
type:req.params.type
});

res.json(vehicles);

}catch(err){

res.status(500).json(err);

}

});

/* ================= Server ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log("Server Running on "+PORT));
