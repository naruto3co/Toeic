(function(root){
 'use strict';
 let current=null,watchdog=null;
 function cancel(){clearTimeout(watchdog);watchdog=null;if('speechSynthesis' in root)root.speechSynthesis.cancel();current=null;}
 function play(text,{rate=.8,onStart=()=>{},onEnd=()=>{},onError=()=>{}}={}){
  cancel();if(!('speechSynthesis' in root)||!root.SpeechSynthesisUtterance){onError('Trình duyệt này chưa hỗ trợ giọng đọc. Hãy thử Chrome, Edge hoặc Safari có giọng tiếng Anh.');return false;}
  const utterance=new root.SpeechSynthesisUtterance(text);utterance.lang='en-US';utterance.rate=rate;
  const voices=root.speechSynthesis.getVoices(),voice=voices.find(v=>v.lang==='en-US')||voices.find(v=>v.lang.startsWith('en'));if(voice)utterance.voice=voice;
  current=utterance;utterance.onstart=()=>{if(current===utterance){clearTimeout(watchdog);watchdog=null;onStart();}};utterance.onend=()=>{if(current===utterance){clearTimeout(watchdog);watchdog=null;current=null;onEnd();}};utterance.onerror=e=>{if(current===utterance){clearTimeout(watchdog);watchdog=null;current=null;if(!['canceled','interrupted'].includes(e.error))onError('Chưa phát được âm thanh. Kiểm tra âm lượng và giọng đọc tiếng Anh rồi bấm Nghe từ để thử lại.');}};
  watchdog=setTimeout(()=>{if(current===utterance){cancel();onError('Giọng đọc chưa sẵn sàng. Kiểm tra giọng tiếng Anh trên thiết bị rồi bấm Nghe từ để thử lại.');}},12000);
  try{root.speechSynthesis.speak(utterance);return true;}catch{cancel();onError('Chưa phát được âm thanh. Hãy bấm Nghe từ để thử lại.');return false;}
 }
 root.LearningAudio={play,cancel};
})(typeof window!=='undefined'?window:globalThis);
