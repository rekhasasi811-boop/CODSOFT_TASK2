const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const menu = [
 {id:1,name:"Classic Veg Burger",category:"Burgers",price:129,description:"Crispy vegetable patty, lettuce and house sauce.",emoji:"🍔"},
 {id:2,name:"Paneer Tikka Wrap",category:"Wraps",price:159,description:"Spiced paneer, crunchy vegetables and mint dressing.",emoji:"🌯"},
 {id:3,name:"Margherita Pizza",category:"Pizza",price:249,description:"Mozzarella, basil and rich tomato sauce.",emoji:"🍕"},
 {id:4,name:"Masala Dosa",category:"South Indian",price:99,description:"Golden dosa with potato masala and chutneys.",emoji:"🥞"},
 {id:5,name:"Veg Fried Rice",category:"Rice",price:149,description:"Wok-tossed rice with fresh vegetables.",emoji:"🍚"},
 {id:6,name:"Chocolate Brownie",category:"Desserts",price:89,description:"Warm chocolate brownie with a soft centre.",emoji:"🍫"},
 {id:7,name:"Fresh Lime Soda",category:"Drinks",price:59,description:"Refreshing lime soda, sweet or salted.",emoji:"🥤"},
 {id:8,name:"Cold Coffee",category:"Drinks",price:109,description:"Chilled coffee blended until smooth.",emoji:"🧋"}
];
function loadStore(){
 if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR,{recursive:true});
 if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE,JSON.stringify({orders:[],reservations:[],nextOrderId:1,nextReservationId:1},null,2));
 return JSON.parse(fs.readFileSync(DATA_FILE,"utf8"));
}
function saveStore(s){fs.writeFileSync(DATA_FILE,JSON.stringify(s,null,2));}
function valid(v,max=100){return typeof v==="string" && v.trim().length>0 && v.trim().length<=max;}

app.get("/api/health",(req,res)=>res.json({success:true,message:"DineDesk API is running"}));
app.get("/api/menu",(req,res)=>res.json({success:true,data:menu}));
app.get("/api/orders",(req,res)=>res.json({success:true,data:loadStore().orders}));
app.post("/api/orders",(req,res)=>{
 const {customerName,phone,items,orderType,address,notes}=req.body;
 if(!valid(customerName,60)||!valid(phone,20)||!Array.isArray(items)||!items.length)
  return res.status(400).json({success:false,message:"Enter your name, phone and at least one menu item."});
 if(!["Pickup","Delivery","Dine-in"].includes(orderType))
  return res.status(400).json({success:false,message:"Choose a valid order type."});
 if(orderType==="Delivery"&&!valid(address,200))
  return res.status(400).json({success:false,message:"Delivery address is required."});
 const clean=[];
 for(const item of items){
  const product=menu.find(m=>m.id===Number(item.menuId)), qty=Number(item.quantity);
  if(!product||!Number.isInteger(qty)||qty<1||qty>20)
   return res.status(400).json({success:false,message:"One or more order items are invalid."});
  clean.push({menuId:product.id,name:product.name,price:product.price,quantity:qty});
 }
 const store=loadStore(), total=clean.reduce((sum,i)=>sum+i.price*i.quantity,0);
 const order={id:store.nextOrderId++,customerName:customerName.trim(),phone:phone.trim(),items:clean,orderType,
  address:orderType==="Delivery"?address.trim():"",notes:valid(notes||"",250)?notes.trim():"",
  total,status:"Received",paymentMethod:"Pay at restaurant / Cash on delivery",createdAt:new Date().toISOString()};
 store.orders.unshift(order);saveStore(store);
 res.status(201).json({success:true,message:"Order placed successfully.",data:order});
});
app.patch("/api/orders/:id/status",(req,res)=>{
 const allowed=["Received","Preparing","Ready","Completed","Cancelled"];
 if(!allowed.includes(req.body.status)) return res.status(400).json({success:false,message:"Invalid order status."});
 const store=loadStore(), order=store.orders.find(o=>o.id===Number(req.params.id));
 if(!order)return res.status(404).json({success:false,message:"Order not found."});
 order.status=req.body.status;saveStore(store);res.json({success:true,data:order});
});
app.get("/api/reservations",(req,res)=>res.json({success:true,data:loadStore().reservations}));
app.post("/api/reservations",(req,res)=>{
 const {customerName,phone,date,time,guests}=req.body, count=Number(guests);
 if(!valid(customerName,60)||!valid(phone,20)||!valid(date,20)||!valid(time,20)||!Number.isInteger(count)||count<1||count>12)
  return res.status(400).json({success:false,message:"Complete all fields. Guests must be between 1 and 12."});
 const store=loadStore(), reservation={id:store.nextReservationId++,customerName:customerName.trim(),phone:phone.trim(),date,time,guests:count,status:"Requested",createdAt:new Date().toISOString()};
 store.reservations.unshift(reservation);saveStore(store);
 res.status(201).json({success:true,message:"Table reservation request received.",data:reservation});
});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`DineDesk running on http://localhost:${PORT}`));