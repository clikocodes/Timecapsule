import mongoose from "mongoose";
const schema=new mongoose.Schema({
  capsuleId:{type:String,unique:true,index:true,required:true},
  title:{type:String,required:true,trim:true,maxlength:120},
  senderName:{type:String,required:true,trim:true,maxlength:80},
  recipientName:{type:String,required:true,trim:true,maxlength:80},
  messageMode:{type:String,enum:["voice","text"],required:true},
  message:{type:String,default:"",maxlength:5000},
  originalAudioUrl:{type:String,default:""},
  finalAudioUrl:{type:String,default:""},
  audioSource:{type:String,enum:["original","murf-voice-changer","murf-tts","none"],default:"none"},
  voiceId:{type:String,default:""},
  pitch:{type:Number,default:0},
  rate:{type:Number,default:0},
  unlockDate:{type:Date,required:true},
  status:{type:String,enum:["locked","unlocked"],default:"locked"}
},{timestamps:true});
export default mongoose.model("Capsule",schema);
