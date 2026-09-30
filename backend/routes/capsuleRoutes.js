import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";
import Capsule from "../models/Capsule.js";
import {textToSpeech,voiceChange} from "../services/murf.js";

const router=express.Router();
const dir=path.resolve("uploads");
fs.mkdirSync(dir,{recursive:true});
const storage=multer.diskStorage({
 destination:(req,file,cb)=>cb(null,dir),
 filename:(req,file,cb)=>cb(null,`${Date.now()}-${crypto.randomBytes(4).toString("hex")}.webm`)
});
const upload=multer({storage,limits:{fileSize:15*1024*1024}});
const id=()=>`TC-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
const future=v=>{const d=new Date(v);return !Number.isNaN(d.getTime())&&d>new Date();};
const base=()=>process.env.PUBLIC_API_URL||"http://localhost:5000";

router.post("/text",async(req,res)=>{
 try{
  const {title,senderName,recipientName,message,unlockDate,voiceId,pitch,rate}=req.body;
  if(!title||!senderName||!recipientName||!message||!future(unlockDate)) return res.status(400).json({message:"Complete the form and choose a future unlock date."});
  const audio=await textToSpeech({text:message,voiceId,pitch,rate});
  const c=await Capsule.create({capsuleId:id(),title,senderName,recipientName,messageMode:"text",message,finalAudioUrl:audio,audioSource:"murf-tts",voiceId,pitch:Number(pitch)||0,rate:Number(rate)||0,unlockDate,status:"locked"});
  res.status(201).json(c);
 }catch(e){res.status(500).json({message:e.message});}
});

router.post("/voice",upload.single("audio"),async(req,res)=>{
 try{
  if(!req.file) return res.status(400).json({message:"No recording uploaded."});
  const {title,senderName,recipientName,unlockDate,voiceId,pitch,rate,useMurf}=req.body;
  if(!title||!senderName||!recipientName||!future(unlockDate)) return res.status(400).json({message:"Complete the form and choose a future unlock date."});
  const original=`${base()}/uploads/${req.file.filename}`;
  let final=original, source="original";
  if(String(useMurf)==="true"){
   try{final=await voiceChange({filePath:req.file.path,voiceId,pitch,rate});source="murf-voice-changer";}
   catch(e){console.warn("Murf Voice Changer failed; keeping original:",e.message);}
  }
  const c=await Capsule.create({capsuleId:id(),title,senderName,recipientName,messageMode:"voice",originalAudioUrl:original,finalAudioUrl:final,audioSource:source,voiceId:voiceId||"",pitch:Number(pitch)||0,rate:Number(rate)||0,unlockDate,status:"locked"});
  res.status(201).json(c);
 }catch(e){res.status(500).json({message:e.message});}
});

router.get("/",async(req,res)=>{
 try{
  const cs=await Capsule.find().sort({createdAt:-1});
  res.json(cs.map(c=>({...c.toObject(),status:new Date()>=c.unlockDate?"unlocked":"locked"})));
 }catch(e){res.status(500).json({message:"Could not load capsules."});}
});

router.get("/:capsuleId",async(req,res)=>{
 try{
  const c=await Capsule.findOne({capsuleId:req.params.capsuleId});
  if(!c)return res.status(404).json({message:"Capsule not found."});
  const unlocked=new Date()>=c.unlockDate;
  if(!unlocked)return res.json({capsuleId:c.capsuleId,title:c.title,recipientName:c.recipientName,unlockDate:c.unlockDate,status:"locked"});
  res.json({...c.toObject(),status:"unlocked"});
 }catch(e){res.status(500).json({message:"Could not load capsule."});}
});
export default router;
