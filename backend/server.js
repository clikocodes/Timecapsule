import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/capsuleRoutes.js";

dotenv.config();
const app=express();
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
app.use(cors({origin:process.env.CLIENT_URL||"http://localhost:5173"}));
app.use(express.json({limit:"1mb"}));
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.get("/api/health",(req,res)=>res.json({ok:true}));
app.use("/api/capsules",routes);

const PORT=process.env.PORT||5000;
async function start(){
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(PORT,()=>console.log(`Backend: http://localhost:${PORT}`));
  }catch(e){console.error(e.message);process.exit(1);}
}
start();
