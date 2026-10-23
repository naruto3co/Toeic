import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context=vm.createContext({console});
for(const file of ['games-engine','word-journey','battle-engine'])vm.runInContext(fs.readFileSync(new URL('../dist/'+file+'.js',import.meta.url),'utf8'),context);
const B=context.WordBattles,J=context.WordJourney;
const ids=Array.from({length:600},(_,i)=>`${Math.floor(i/12)+1}-${i%12}`);
const json=x=>JSON.parse(JSON.stringify(x));
function create(character='mage',pool=ids){return B.create('boss',pool,{id:'test-battle-001',seed:517,at:100000,character});}
function check(s){assert.equal(B.validDraft(json(s)),true,`invalid ${s.mode} ${s.phase}`);return s;}
test('successful words stay excluded after reload and across both modes',()=>{
 const state={reviews:{'1-0':{streak:2},'1-1':{streak:0}},games:{history:{old:{words:[{id:'1-2',success:true,wrong:1},{id:'1-3',success:false,wrong:1}]}}}};
 J.init(state,ids);J.answer(state,'2-0',true);J.answer(state,'2-1',false);
 const saved=json(state),pool=J.pool(saved,ids,10);
 for(const id of ['1-0','1-2','2-0'])assert.equal(pool.includes(id),false);
 for(const id of ['1-1','1-3','2-1'])assert.equal(pool.includes(id),true);
 assert.equal(new Set(pool).size,pool.length);assert.equal(B.create('robot',pool,{id:'test-robot-001'}).wordIds.some(id=>saved.journey.mastered.includes(id)),false);
 J.answer(saved,'2-1',true);assert.equal(J.pool(saved,ids,11).includes('2-1'),false);
});
test('draws replace even unplayed cards: no cycling the same twelve words',()=>{
 let s=check(create());const seen=new Set();
 for(let turn=0;turn<6;turn++){
  for(const index of s.hand){const id=s.wordIds[index];assert.equal(seen.has(id),false,`repeated displayed word ${id}`);seen.add(id);}
  s=check(B.endTurn(s));s.heroHp=s.heroMaxHp;s=check(B.advance(s));
 }
 assert.equal(seen.size,30);
});
test('correct prompts never repeat through reshuffles and boss transitions',()=>{
 let s=create('knight');s.heroHp=105;const solved=new Set();let answered=0;
 for(let step=0;step<200&&!B.complete(s);step++){
  check(s);
  if(s.phase==='camp'){s=check(B.relic(s,'battery'));continue;}
  if(s.phase==='hand'){
   for(const i of s.hand)assert.equal(solved.has(s.wordIds[i]),false);
   const index=s.hand.find(i=>B.spell(s,i).cost<=s.mana);
   if(index===undefined){s=B.endTurn(s);s.heroHp=s.heroMaxHp;s=B.advance(s);continue;}
   s=B.select(s,index);const id=B.question(s);assert.equal(solved.has(id),false);solved.add(id);answered++;
   s=check(B.bossAnswer(s,id));s=check(B.advance(s));
  }
 }
 assert.ok(answered>12);assert.equal(s.phase,'won');
});
test('only a wrong prompt may repeat, with fresh questions in between',()=>{
 let s=create('knight');let mistaken=null,seenRetry=false;const successes=new Set();
 for(let k=0;k<100&&!seenRetry;k++){
  if(s.phase==='camp'){s=B.relic(s,'battery');continue;}
  if(s.phase==='hand'){
   const index=s.hand.find(i=>s.wordIds[i]===mistaken&&B.spell(s,i).cost<=s.mana)??s.hand.find(i=>B.spell(s,i).cost<=s.mana);
   if(index===undefined){s=B.endTurn(s);s.heroHp=s.heroMaxHp;s=B.advance(s);continue;}
   s=B.select(s,index);const id=B.question(s);assert.equal(successes.has(id),false);
   if(!mistaken){mistaken=id;s=B.bossAnswer(s,'wrong');}
   else{if(id===mistaken){assert.ok(s.questionCount>=4);seenRetry=true;}successes.add(id);s=B.bossAnswer(s,id);}
   s=B.advance(s);
  }else break;
 }
 assert.ok(seenRetry,'wrong word should return after fresh questions');
});
test('three character skills have real effects and cannot be used twice',()=>{
 for(const id of ['knight','mage','ranger']){
  let s=create(id);s.heroHp-=30;const hp=s.heroHp,mana=s.mana;
  s=check(B.skill(s));assert.equal(s.skillReady,false);assert.equal(B.skill(s),s);
  if(id==='knight'){assert.equal(s.block,24);assert.equal(s.bossHp,66);assert.equal(s.heroMaxHp,105);}
  if(id==='mage')assert.equal(s.bossHp,48);
  if(id==='ranger'){assert.equal(s.heroHp,hp+22);assert.equal(s.mana,mana+1);}
  s.phase='camp';s=check(B.relic(s,'bloom'));assert.equal(s.skillReady,true);assert.ok(s.heroHp<=s.heroMaxHp);
  let r=B.create('robot',ids,{id:'test-robot-001',character:id});r.baseHp=10;const coins=r.coins;r=check(B.skill(r));assert.equal(B.skill(r),r);
  if(id==='knight')assert.equal(r.baseHp,15);if(id==='mage')assert.equal(r.energy,2);if(id==='ranger')assert.equal(r.coins,coins+4);
  r.phase='report';r.fight={fighters:[],events:[],cursor:0,won:true};r=B.nextWave(r);assert.equal(r.skillReady,true);
 }
});
test('legacy active saves migrate without bringing solved words back',()=>{
 const old=create();delete old.schema;for(const k of ['reserve','shown','retired','retry','questionCount','character','skillReady','skillNotice','heroMaxHp'])delete old[k];old.heroHp=70;
 const retired=old.wordIds[old.hand[0]],eligible=ids.filter(id=>id!==retired);old.results[retired]={success:true,wrong:0};
 const upgraded=check(B.upgrade(old,eligible));assert.equal(upgraded.heroHp,70);assert.equal(upgraded.heroMaxHp,85);assert.ok(!upgraded.hand.some(i=>upgraded.wordIds[i]===retired));assert.ok(upgraded.reserve.length>500);
});
test('small remaining pools end cleanly without recycling solved words',()=>{
 let s=create('mage',ids.slice(0,2));const seen=new Set();
 for(let k=0;k<10&&!B.complete(s);k++){
  const index=s.hand.find(i=>B.spell(s,i).cost<=s.mana);
  if(index===undefined){s=B.advance(B.endTurn(s));continue;}
  s=B.select(s,index);const id=B.question(s);assert.equal(seen.has(id),false);seen.add(id);s=B.advance(B.bossAnswer(s,id));
 }
 assert.equal(s.phase,'learned');check(s);
 let r=B.create('robot',ids.slice(0,1),{id:'test-robot-001'});r=B.charge(r);r=B.robotAnswer(r,B.question(r));r=B.advance(r);r=B.charge(r);assert.equal(r.phase,'learned');check(r);
});
test('robot campaign keeps skills, saves and unique questions through all waves',()=>{
 let r=B.create('robot',ids,{id:'test-robot-002',seed:32,character:'mage'}),seen=new Set();
 for(let wave=1;wave<=5;wave++){
  r=B.skill(r);r.coins=100;
  for(let n=0;n<9;n++)r=B.buy(r,'aegis');
  r=check(r);
  for(let n=0;n<2;n++){r=check(B.charge(r));const id=B.question(r);assert.ok(!seen.has(id));seen.add(id);r=check(B.robotAnswer(r,id));r=check(B.advance(r));}
  r=check(B.fight(r));while(r.phase==='fight')r=check(B.frame(r));
  if(wave<5)r=check(B.nextWave(r));
 }
 assert.equal(seen.size,10);assert.equal(r.phase,'won');
});
test('audio waits for a gesture, uses distinct cues, and remembers mute/volume',()=>{
 const handlers={},notes=[],saved={};let instances=0,resumed=0;
 class Audio{constructor(){instances++;this.state='suspended';this.currentTime=0;this.destination={};}resume(){this.state='running';resumed++;return Promise.resolve();}createOscillator(){return{frequency:{setValueAtTime:v=>notes.push(v)},connect(){},start(){},stop(){}};}createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}}
 const browser={window:{AudioContext:Audio},document:{hidden:false,addEventListener:(name,fn)=>handlers[name]=fn},localStorage:{getItem:k=>saved[k],setItem:(k,v)=>saved[k]=v}};
 vm.runInNewContext(fs.readFileSync(new URL('../dist/action-audio.js',import.meta.url),'utf8'),browser);const audio=browser.window.ActionAudio;
 audio.play('hit');assert.equal(instances,0);assert.equal(notes.length,0);handlers.pointerdown();assert.equal(instances,1);assert.equal(resumed,1);
 audio.play('correct');assert.deepEqual(notes,[523,659,784]);notes.length=0;audio.play('wrong');assert.deepEqual(notes,[180,110]);
 audio.toggle();notes.length=0;audio.play('win');assert.equal(notes.length,0);assert.equal(JSON.parse(saved['pixel-arena-sound-v1']).muted,true);
 audio.setVolume(.6);assert.equal(JSON.parse(saved['pixel-arena-sound-v1']).volume,.6);
 browser.document.hidden=true;audio.toggle();audio.play('win');assert.equal(notes.length,0);
});
