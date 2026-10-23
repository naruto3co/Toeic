import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const ctx=vm.createContext({console});
for(const f of ['games-engine','word-journey','battle-engine','question-engine','campaign-engine'])vm.runInContext(fs.readFileSync(new URL('../dist/'+f+'.js',import.meta.url),'utf8'),ctx);
vm.runInContext(fs.readFileSync(new URL('../dist/data.js',import.meta.url),'utf8')+'\nglobalThis.words=WORDS;globalThis.lessons=LESSONS;',ctx);
const {WordQuestions:Q,WordJourney:J,WordCampaign:C,WordBattles:B,words,lessons}=ctx;
const copy=x=>JSON.parse(JSON.stringify(x));
function state(){const s={known:[],saved:[],games:{history:{}},battleDrafts:{boss:null,robot:null}};J.init(s,words.map(w=>w.id));C.init(s,lessons);return s;}
function correct(s){const d=s.campaign.draft,w=words.find(w=>w.id===d.queue[0]),q=Q.make(w,words,d.seed+w.id.length,d.difficulty);return C.answer(s,lessons,q.answer);}
test('three formats ask for meaning, English recall, and a genuinely masked sentence',()=>{
 for(const w of words){const normal=Q.make(w,words,31,'normal'),reverse=Q.make(w,words,31,'hard'),cloze=Q.make(w,words,31,'nightmare');assert.equal(normal.kind,'meaning');assert.equal(normal.title,w.word);assert.ok(normal.options.some(o=>o.id===w.id&&o.label===w.meaning));assert.equal(reverse.kind,'reverse');assert.equal(reverse.title,w.meaning);assert.ok(reverse.options.every(o=>words.some(w=>w.word===o.label)));assert.ok(reverse.options.some(o=>o.id===w.id&&o.label===w.word));assert.equal(cloze.kind,'cloze');assert.ok(cloze.sentence.includes('________'));assert.notEqual(cloze.sentence,w.example);assert.equal(Q.grade(cloze,w.word),true);assert.equal(Q.grade(reverse,w.id),true);assert.equal(Q.grade(normal,'not-an-option'),false);}
});
test('typed grading tolerates case, surrounding spaces and equivalent hyphens, but not missing words',()=>{
 const w=words.find(w=>w.word==='over-the-counter'),q=Q.make(w,words,5,'nightmare');assert.equal(Q.grade(q,'  OVER THE COUNTER  '),true);assert.equal(Q.grade(q,'over–the–counter'),true);assert.equal(Q.grade(q,'counter'),false);assert.equal(Q.grade(q,''),false);
 const multi=Q.make(words.find(w=>w.word==='expiration date'),words,5,'nightmare');assert.equal(Q.grade(multi,'expiration'),false);assert.equal(Q.grade(multi,'expiration   date'),true);
});
test('locked nodes cannot start; learning twelve words clears a topic and unlocks exactly the next',()=>{
 const s=state();assert.equal(C.unlocked(s,1),true);assert.equal(C.unlocked(s,2),false);assert.equal(C.create(s,lessons[1]),null);C.create(s,lessons[0],{seed:40});const seen=new Set();for(let n=0;n<12;n++){const id=s.campaign.draft.queue[0];assert.equal(seen.has(id),false);seen.add(id);assert.equal(correct(s).correct,true);if(n<11){assert.equal(C.unlocked(s,2),false);C.advance(s);}}
 assert.equal(s.campaign.draft.phase,'won');assert.equal(C.progress(s,lessons[0]).learned,12);assert.equal(C.unlocked(s,2),true);assert.equal(C.unlocked(s,3),false);assert.equal(C.create(s,lessons[0]),null);
});
test('a single mistake is retried after the other queued words; solved words never repeat',()=>{
 const s=state();C.create(s,lessons[0],{seed:73});const missed=s.campaign.draft.queue[0];C.answer(s,lessons,'wrong');C.advance(s);const seen=[];while(s.campaign.draft.phase!=='won'){seen.push(s.campaign.draft.queue[0]);correct(s);C.advance(s);}assert.equal(seen.at(-1),missed);assert.equal(seen.filter(id=>id===missed).length,1);assert.equal(new Set(seen).size,12);
});
test('personal hard words retain their three-recall requirement inside a topic',()=>{
 const s=state(),id=lessons[0].words[0].id;J.answer(s,id,false);J.answer(s,id,false);C.create(s,lessons[0],{seed:22});let count=0;for(let n=0;n<20&&s.campaign.draft.phase!=='won';n++){if(s.campaign.draft.queue[0]===id)count++;correct(s);C.advance(s);}assert.equal(count,3);assert.equal(J.status(s,id).mastered,true);assert.equal(s.campaign.draft.phase,'won');
});
test('a lost attempt preserves learned words and only remaining words enter a retry',()=>{
 for(const [difficulty,misses] of [['normal',5],['hard',4],['nightmare',3]]){const s=state();C.create(s,lessons[0],{seed:77,difficulty});const solved=s.campaign.draft.queue[0];correct(s);C.advance(s);for(let n=0;n<misses;n++){C.answer(s,lessons,'wrong');C.advance(s);}assert.equal(s.campaign.draft.phase,'lost');assert.equal(s.campaign.draft.hp,0);assert.equal(C.unlocked(s,2),false);C.create(s,lessons[0],{seed:81,difficulty});assert.equal(s.campaign.draft.queue.includes(solved),false);assert.equal(s.campaign.draft.hp,100);}
});
test('saved mid-question and feedback states resume without double-counting answers',()=>{
 let s=state();C.create(s,lessons[0],{seed:123,difficulty:'nightmare'});const first=s.campaign.draft.queue[0];correct(s);s=copy(s);J.init(s,words.map(w=>w.id));C.init(s,lessons);assert.equal(s.campaign.draft.phase,'feedback');assert.equal(J.status(s,first).attempts,1);C.advance(s);assert.notEqual(s.campaign.draft.queue[0],first);assert.equal(s.campaign.draft.difficulty,'nightmare');assert.equal(J.status(s,first).attempts,1);
});
test('existing vocabulary progress migrates into contiguous unlocked topics without deleting game saves',()=>{
 const s=state();s.battleDrafts.boss={sentinel:true};for(const w of [...lessons[0].words,...lessons[2].words])J.answer(s,w.id,true);C.init(s,lessons);assert.equal(s.campaign.cleared.includes(1),true);assert.equal(s.campaign.cleared.includes(3),false);assert.equal(C.unlocked(s,2),true);assert.equal(C.unlocked(s,4),false);for(const w of lessons[1].words)J.answer(s,w.id,true);C.reconcile(s,lessons);assert.equal(s.campaign.cleared.includes(3),true);assert.equal(C.unlocked(s,4),true);assert.equal(s.battleDrafts.boss.sentinel,true);assert.equal(s.journey.mastered.length,36);
});
test('every ten-topic milestone unlocks an equipable persisted skin; all fifty topics are finishable',()=>{
 let s=state();assert.equal(C.equip(s,'eclipse'),false);for(const l of lessons){C.create(s,l,{seed:l.id*73,difficulty:l.id%2?'hard':'nightmare'});while(s.campaign.draft.phase!=='won'){correct(s);C.advance(s);}if(l.id%10===0){const reward=C.REWARDS.find(r=>r.at===l.id);assert.equal(C.equip(s,reward.id),true);s=copy(s);C.init(s,lessons);assert.equal(s.campaign.skin,reward.id);}else assert.equal(C.skins(s).length,1+Math.floor(l.id/10));}assert.equal(s.campaign.cleared.length,50);assert.equal(s.journey.mastered.length,600);assert.equal(C.skins(s).length,6);assert.equal(s.campaign.skin,'eclipse');
});
test('new question grading feeds actual boss and robot answers without changing mastery rules',()=>{
 for(const mode of ['boss','robot'])for(const difficulty of ['normal','hard','nightmare']){let run=B.create(mode,words.map(w=>w.id),{seed:51,difficulty});run=mode==='boss'?B.select(run,run.hand.find(i=>B.spell(run,i).cost<=run.mana)):B.charge(run);const w=words.find(w=>w.id===B.question(run)),q=Q.make(w,words,run.rng,difficulty),id=Q.grade(q,q.answer)?w.id:'wrong';run=mode==='boss'?B.bossAnswer(run,id):B.robotAnswer(run,id);assert.equal(run.feedback.correct,true);assert.equal(B.validDraft(run),true);}
});
test('resuming a topic skips words learned in a tactical game while the expedition was parked',()=>{
 const s=state();C.create(s,lessons[0],{seed:417});const externallyLearned=s.campaign.draft.queue[0];J.answer(s,externallyLearned,true);C.sync(s,lessons);assert.equal(s.campaign.draft.queue.includes(externallyLearned),false);assert.equal(s.campaign.draft.queue.length,11);assert.equal(C.progress(s,lessons[0]).learned,1);
});
