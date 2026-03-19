import React,{useState,useEffect} from "react";
import axios from "axios";
import "./App.css";

// ✅ FIXED API URL
const API="http://vehicle-booking-backend-tu1y.onrender.com";

function App(){

const [page,setPage]=useState("login");
const [user,setUser]=useState(null);
const [selectedType,setSelectedType]=useState("");
const [vehicles,setVehicles]=useState([]);
const [selectedVehicle,setSelectedVehicle]=useState(null);

const vehicleTypes=[
"Goods Vehicles (4 wheel)",
"Goods Vehicle (3 wheel)",
"Auto",
"Cars",
"Bus",
"Van",
"Mini Van",
"Ambulance",
"Trucks",
"Tipper",
"Tractor",
"Water Tank Vehicle",
"funeral vehicle",
"Lifting crane",
"Backhoe Loader (JCB)",
"Septic Tank Cleaner",
"Borewell Vehicle"
];


// ================= LOGIN CHECK =================

useEffect(()=>{

const saved=localStorage.getItem("user");

if(saved){
setUser(JSON.parse(saved));
setPage("home");
}

},[]);


// ================= LOGIN =================

if(page==="login")

return(

<div className="loginform">

<h2 align="center">Login</h2>

<form onSubmit={async(e)=>{

e.preventDefault();

const data=Object.fromEntries(new FormData(e.target));

// ✅ uses correct API
const res=await axios.post(API+"/login",data);

localStorage.setItem("user",JSON.stringify(res.data));

setUser(res.data);

setPage("home");

}}>

<input
name="name"
placeholder="Name"
className="inputbox"
required
/>

<input
name="phone"
placeholder="Phone Number"
className="inputbox"
required
/>

<button className="formbutton">Login</button>

</form>

</div>

);


// ================= NAVBAR =================

const Navbar=()=>{

const [menuOpen,setMenuOpen]=useState(false);

return(

<div className="navbar">

<h3>Vaadaga Vandi</h3>

<div
className="toggle"
onClick={()=>setMenuOpen(!menuOpen)}
>
☰
</div>

<div className={`nav1 ${menuOpen?"open":""}`}>

<a onClick={()=>{setPage("home");setMenuOpen(false);}}>
Home
</a>

<a onClick={()=>{setPage("add");setMenuOpen(false);}}>
Join to us
</a>

<a onClick={()=>{setPage("contact");setMenuOpen(false);}}>
Contact
</a>

<a onClick={()=>{setPage("users");setMenuOpen(false);}}>
User Details
</a>

<a onClick={()=>{

localStorage.removeItem("user");

setUser(null);

setPage("login");

setMenuOpen(false);

}}>
Logout
</a>

</div>

</div>

);

};


// ================= HOME =================

const Home=()=>(

<div>

<h2 className="homename">
Welcome {user?.name}
</h2>

<div className="grid">

{vehicleTypes.map(type=>(

<div
key={type}
className="card"

onClick={()=>{

setSelectedType(type);

// ✅ FIXED ROUTE
axios.get(API+"/vehicles/"+type)
.then(res=>{

setVehicles(res.data);

setPage("list");

});

}}
>

<img
src={"/icons/"+type.replace(/[^a-zA-Z]/g,"").toLowerCase()+".jpg"}
className="cardicon"
alt={type}
/>

<h4>{type}</h4>

</div>

))}

</div>

</div>

);


// ================= VEHICLE LIST =================

const VehicleList=()=>(

<div>

<h2 className="homename">

{selectedType}

</h2>

<div className="vehidetails">

{vehicles.map(v=>(

<div
key={v._id}
className="list"

onClick={()=>{

setSelectedVehicle(v);

setPage("details");

}}
>

<img
src={`${API}/uploads/${v.image}`}
alt=""
/>

<div>

<h3>{v.name}</h3>

<h4>{v.company}</h4>

<h4>{v.location}</h4>

</div>

</div>

))}

</div>

</div>

);


// ================= DETAILS =================

const Details=()=>(

<div className="details">

<img
src={`${API}/uploads/${selectedVehicle.image}`}
alt=""
/>

<h2 className="fulldetails">

{selectedVehicle.name}

</h2>
<br></br>

<h4 className="fulldetails">

Vehicle Owner Name:&nbsp;{selectedVehicle.ownerName}

</h4>

<h4 className="fulldetails">

Vehicle Company Name:&nbsp;{selectedVehicle.company}

</h4>

<h4 className="fulldetails">

Vehicle No:&nbsp;{selectedVehicle.number}

</h4>

<h4 className="fulldetails">

Location:&nbsp;{selectedVehicle.location}

</h4>

<a
href={`tel:${selectedVehicle.contact}`}
className="call"
>

Call

</a>

</div>

);


// ================= ADD VEHICLE =================

const AddVehicle=()=>(

<div className="form">

<h2 className="homename1">
Join to us
</h2>

<form onSubmit={async(e)=>{

e.preventDefault();

const formData=new FormData(e.target);

// ✅ FIXED ROUTE
await axios.post(API+"/vehicles",formData);

alert("Vehicle Added");

}}>

<select
name="type"
required
className="inputbox"
>

<option value="">
Select Type
</option>

{vehicleTypes.map(t=>

<option key={t}>
{t}
</option>

)}

</select>

<input
name="name"
placeholder="Travel's Name"
className="inputbox"
required
/>

<input
name="ownerName"
placeholder="Owner Name"
className="inputbox"
required
/>

<input
name="company"
placeholder="Vehicle Company Name"
className="inputbox"
required
/>

<input
name="number"
placeholder="Vehicle Number"
className="inputbox"
required
/>

<input
name="location"
placeholder="Location"
className="inputbox"
required
/>

<input
name="contact"
placeholder="Contact Number"
className="inputbox"
required
/>

<input
type="file"
name="image"
className="inputbox"
required
/>

<button className="formbutton">

Submit

</button>

</form>

</div>

);


// ================= CONTACT =================

const Contact=()=>(

<div className="form">

<h2 className="homename1">Help & Support</h2>

<b>Address:</b>
<p >

121, North Street, Woraiyur, Trichy, Tamil Nadu - 620003
</p>
<hr/>
<b>Customer Care:</b>
<p>
9363023xxx
</p>
<hr/>
<b>Email:</b>
<p>

vaadagavandi@gmail.com
</p>

</div>

);


// ================= USER DETAILS =================

const Users=()=>{

const [users,setUsers]=useState([]);

useEffect(()=>{

axios.get(API+"/users")
.then(res=>setUsers(res.data));

},[]);

return(

<div className="form">

<h2 className="homename1">User Details</h2>

{users.map(u=>(

<div key={u._id}>

<p>{u.name}</p>

<p>{u.phone}</p>

</div>

))}

</div>

);

};


// ================= RETURN =================

return(

<div>

<Navbar/>

{page==="home" && <Home/>}
{page==="add" && <AddVehicle/>}
{page==="contact" && <Contact/>}
{page==="users" && <Users/>}
{page==="list" && <VehicleList/>}
{page==="details" && <Details/>}

</div>

);

}

export default App;
