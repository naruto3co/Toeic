/* A persistent fifty-topic journey; vocabulary mastery is the gate, not replay. */
(function(root){
 'use strict';
 const REWARDS=[
  {at:10,id:'verdant',name:'Áo Rừng Ngọc',icon:'✦',color:'#a6ecc2'},
  {at:20,id:'ember',name:'Áo Hỏa Tinh',icon:'☄',color:'#ffc09c'},
  {at:30,id:'frost',name:'Áo Băng Lam',icon:'❄',color:'#a8e5ff'},
  {at:40,id:'aurora',name:'Áo Cực Quang',icon:'✧',color:'#dcc3ff'},
  {at:50,id:'eclipse',name:'Áo Nhật Thực',icon:'☾',color:'#ffe29e'}
 ];
 const REGIONS=[
  {name:'Rừng Khởi Nguyên',tag:'KHẾ ƯỚC CỦA KÝ ỨC',color:'#abe6c9',boss:'Vệ Binh Rừng Ngọc',art:0},
  {name:'Thành Phố Hỏa Tinh',tag:'ÁNH LỬA CỦA TRI THỨC',color:'#ffc2a1',boss:'Lãnh Chúa Tro Tàn',art:1},
  {name:'Quần Đảo Băng Lam',tag:'VƯỢT BIỂN LÃNG QUÊN',color:'#a9dfff',boss:'Hộ Vệ Băng Lam',art:0},
  {name:'Đỉnh Cực Quang',tag:'ĐÁNH THỨC CÁC VÌ SAO',color:'#d6bcff',boss:'Pháp Sư Cực Quang',art:1},
  {name:'Vương Quốc Nhật Thực',tag:'CHẶNG CUỐI CỦA HÀNH TRÌNH',color:'#ffdc97',boss:'Long Vương Nhật Thực',art:2}
 ];
 function init(s,lessons){
  const old=s.campaign||{};s.campaign={version:1,cleared:[...new Set((old.cleared||[]).filter(id=>Number.isInteger(id)&&id>=1&&id<=50))],skin:old.skin||'classic',selected:Number.isInteger(old.selected)&&old.selected>=1&&old.selected<=50?old.selected:1,draft:old.draft||null};
  reconcile(s,lessons);sync(s,lessons);if(!skins(s).some(r=>r.id===s.campaign.skin))s.campaign.skin='classic';return s.campaign;
 }
 function progress(s,lesson){const done=new Set(s.journey.mastered),learned=lesson.words.filter(w=>done.has(w.id)).length;return {learned,total:lesson.words.length,left:lesson.words.length-learned,complete:learned===lesson.words.length};}
 const unlocked=(s,id)=>id===1||s.campaign.cleared.includes(id-1);
 function reconcile(s,lessons){for(const lesson of lessons){if(unlocked(s,lesson.id)&&progress(s,lesson).complete&&!s.campaign.cleared.includes(lesson.id))s.campaign.cleared.push(lesson.id);}s.campaign.cleared.sort((a,b)=>a-b);return s.campaign;}
 function sync(s,lessons){const d=s.campaign.draft;if(!d)return null;const l=lessons.find(l=>l.id===d.lesson);if(!l||!Array.isArray(d.queue)||!['quiz','feedback','won','lost'].includes(d.phase)){s.campaign.draft=null;return null;}if(['won','lost'].includes(d.phase))return d;const valid=new Set(l.words.map(w=>w.id)),done=new Set(s.journey.mastered);d.queue=[...new Set(d.queue.filter(id=>valid.has(id)&&!done.has(id)))];for(const w of l.words)if(!done.has(w.id)&&!d.queue.includes(w.id))d.queue.push(w.id);if(!d.queue.length)d.phase='won';return d;}
 const skins=s=>[{id:'classic',name:'Nguyên bản',at:0,icon:'◇',color:'#ded9ec'},...REWARDS.filter(r=>s.campaign.cleared.length>=r.at)];
 function equip(s,id){if(!skins(s).some(r=>r.id===id))return false;s.campaign.skin=id;return true;}
 function create(s,lesson,{difficulty='normal',seed=Date.now()}={}){
  if(!unlocked(s,lesson.id)||progress(s,lesson).complete)return null;
  const queue=WordJourney.pool(s,lesson.words.map(w=>w.id),seed),run={id:'quest-'+seed.toString(36)+'-'+lesson.id,lesson:lesson.id,difficulty:['normal','hard','nightmare'].includes(difficulty)?difficulty:'normal',seed,hp:100,queue,phase:'quiz',feedback:null,results:{},wrong:0,elapsedMs:0};s.campaign.draft=run;return run;
 }
 function answer(s,lessons,value,at=Date.now()){
  const run=s.campaign.draft;if(!run||run.phase!=='quiz')return null;const lesson=lessons.find(l=>l.id===run.lesson),id=run.queue[0],w=lesson?.words.find(w=>w.id===id);if(!w)return null;
  const q=WordQuestions.make(w,lessons.flatMap(l=>l.words),run.seed+id.length,run.difficulty),correct=WordQuestions.grade(q,value),old=run.results[id]||{wrong:0,success:false};
  WordJourney.answer(s,id,correct,at);run.results[id]={wrong:old.wrong+(correct?0:1),success:old.success||correct};run.queue.shift();if(!WordJourney.status(s,id).mastered)run.queue.push(id);
  if(!correct){run.wrong++;run.hp=Math.max(0,run.hp-({normal:20,hard:25,nightmare:34}[run.difficulty]));}
  run.feedback={wordId:id,correct,chosen:String(value).slice(0,100)};reconcile(s,lessons);
  run.phase=progress(s,lesson).complete?'won':run.hp===0?'lost':'feedback';return {id,correct,phase:run.phase};
 }
 function advance(s){const run=s.campaign.draft;if(run?.phase==='feedback'){run.phase='quiz';run.feedback=null;}return run;}
 root.WordCampaign={init,progress,unlocked,reconcile,sync,skins,equip,create,answer,advance,REWARDS,REGIONS};
})(typeof window!=='undefined'?window:globalThis);
