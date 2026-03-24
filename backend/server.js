const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB connection */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* Upload storage */

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

/* Models */

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

/* Get vehicles */

app.get("/vehicles",async(req,res)=>{

const data = await Vehicle.find();
res.json(data);

});

/* Get vehicle by type */

app.get("/vehicle/:type",async(req,res)=>{

const vehicles = await Vehicle.find({
type:req.params.type
});

res.json(vehicles);

});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log("Server Running"));
