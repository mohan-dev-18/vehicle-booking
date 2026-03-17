const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config(); // ✅ Load .env variables

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION =================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log("MongoDB Error ❌:", err));

// ================= FILE UPLOAD =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// ================= MODELS =================
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  phone: String
}));

const Vehicle = mongoose.model("Vehicle", new mongoose.Schema({
  type: String,
  name: String,
  ownerName: String,
  company: String,
  number: String,
  location: String,
  contact: String,
  image: String
}));

// ================= ROUTES =================

// Add/Login User
app.post("/login", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Users
app.get("/users", async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Vehicle
app.post("/vehicle", upload.single("image"), async (req, res) => {
  try {
    const vehicle = new Vehicle({
      type: req.body.type,
      name: req.body.name,
      ownerName: req.body.ownerName,
      company: req.body.company,
      number: req.body.number,
      location: req.body.location,
      contact: req.body.contact,
      image: req.file ? req.file.filename : ""
    });

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Vehicles by Type
app.get("/vehicle/:type", async (req, res) => {
  try {
    const data = await Vehicle.find({ type: req.params.type });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});