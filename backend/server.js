const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* -------------------- MongoDB Connection -------------------- */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* -------------------- Multer Image Upload -------------------- */

const storage = multer.diskStorage({

 destination:(req,file,cb)=>{
  cb(null,"uploads/");
 },

 filename:(req,file,cb)=>{
  cb(null,Date.now()+path.extname(file.originalname));
 }

});

const upload = multer({storage});

app.use("/uploads",express.static("uploads"));

/* -------------------- Models -------------------- */

const User = mongoose.model("User",{
 name:String,
 phone:String
});

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

/* -------------------- Routes -------------------- */

/* Login / Register */

app.post("/login",async(req,res)=>{
 try{
  const user=new User(req.body);
  await user.save();
  res.json(user);
 }catch(err){
  res.status(500).json(err);
 }
});

/* Get Users */

app.get("/users",async(req,res)=>{
 const data=await User.find();
 res.json(data);
});

/* Add Vehicle */

app.post("/vehicles",upload.single("image"),async(req,res)=>{

 try{

 const vehicle=new Vehicle({
  type:req.body.type,
  name:req.body.name,
  ownerName:req.body.ownerName,
  company:req.body.company,
  number:req.body.number,
  location:req.body.location,
  contact:req.body.contact,
  image:req.file ? req.file.filename : ""
 });

 await vehicle.save();

 res.json(vehicle);

 }catch(err){
  res.status(500).json(err);
 }

});

/* Get All Vehicles */

app.get("/vehicles",async(req,res)=>{
 try{
  const data = await Vehicle.find();
  res.json(data);
 }catch(err){
  res.status(500).json(err);
 }
});

/* Get Vehicles By Type (IMPORTANT - Fix for 404) */

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

/* -------------------- Server -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log("Server Running on "+PORT));
