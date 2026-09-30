import fs from "fs";

export async function textToSpeech({text,voiceId="Natalie",pitch=0,rate=0}){
  const r=await fetch("https://api.murf.ai/v1/speech/generate",{
    method:"POST",
    headers:{"Content-Type":"application/json","api-key":process.env.MURF_API_KEY},
    body:JSON.stringify({text,voiceId,locale:"en-US",format:"MP3",modelVersion:"GEN2",channelType:"STEREO",pitch:Number(pitch)||0,rate:Number(rate)||0})
  });
  const d=await r.json();
  if(!r.ok) throw new Error(d?.message||d?.error||`Murf TTS error ${r.status}`);
  if(!d.audioFile) throw new Error("Murf did not return audioFile");
  return d.audioFile;
}

export async function voiceChange({filePath,voiceId="Natalie",pitch=0,rate=0}){
  const form=new FormData();
  form.append("file",new Blob([fs.readFileSync(filePath)]),"recording.webm");
  form.append("voiceId",voiceId);
  form.append("pitch",String(pitch));
  form.append("rate",String(rate));
  const r=await fetch("https://api.murf.ai/v1/speech/voice-changer",{
    method:"POST",
    headers:{"api-key":process.env.MURF_API_KEY},
    body:form
  });
  const d=await r.json();
  if(!r.ok) throw new Error(d?.message||d?.error||`Murf Voice Changer error ${r.status}`);
  return d.audio_file||d.audioFile;
}
