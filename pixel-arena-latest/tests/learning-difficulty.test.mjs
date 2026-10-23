import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const c=vm.createContext({console});
for(const f of ['games-engine','word-journey','battle-engine'])vm.runInContext(fs.readFileSync(new URL('../dist/'+f+'.js',import.meta.url),'utf8'),c);
vm.runInContext(fs.readFileSync(new URL('../dist/data.js',import.meta.url),'utf8')+'\nglobalThis.actualWords=WORDS;globalThis.actualLessons=LESSONS;',c);
const B=c.WordBattles,J=c.WordJourney,E=c.VocabularyGames,words=c.actualWords,ids=words.map(w=>w.id),copy=x=>JSON.parse(JSON.stringify(x));
const state=()=>{const s={};J.init(s,ids);return s;};
test('word inventory is 600 unique entries in fifty 12-word topics',()=>{
 assert.equal(words.length,600);assert.equal(new Set(words.map(w=>w.word.toLowerCase())).size,600);assert.equal(c.actualLessons.length,50);assert.ok(c.actualLessons.every(l=>l.words.length===12));
});
test('two mistakes mark a personal hard word; three consecutive recalls retire it',()=>{
 const s=state(),id=ids[0];J.answer(s,id,false);assert.equal(J.status(s,id).hard,false);J.answer(s,id,false);assert.equal(J.status(s,id).hard,true);assert.equal(J.hardWords(s)[0].wrong,2);
 for(let n=1;n<=2;n++){J.answer(s,id,true);assert.equal(J.status(s,id).streak,n);assert.equal(J.status(s,id).mastered,false);assert.ok(J.pool(s,ids,10).includes(id));}
 const loaded=copy(s);J.init(loaded,ids);assert.equal(J.status(loaded,id).streak,2);J.answer(loaded,id,false);assert.equal(J.status(loaded,id).streak,0);
 for(let n=0;n<3;n++)J.answer(loaded,id,true);assert.equal(J.status(loaded,id).mastered,true);assert.equal(J.status(loaded,id).wrong,3);assert.equal(J.hardWords(loaded).length,0);assert.equal(J.pool(loaded,ids,11).includes(id),false);
});
test('an ordinary first-try success and a once-missed word still retire immediately',()=>{
 const s=state();J.answer(s,ids[0],true);J.answer(s,ids[1],false);J.answer(s,ids[1],true);assert.ok(s.journey.mastered.includes(ids[0]));assert.ok(s.journey.mastered.includes(ids[1]));assert.equal(J.hardWords(s).length,0);
});
test('legacy learning data identifies difficult words without double-counting migration',()=>{
 const s={journey:{version:1,mastered:[ids[0],ids[1]],missed:[],introduced:[ids[0],ids[1]]},reviews:{[ids[0]]:{lapses:4,streak:1,reviewedAt:1234567890000}},games:{history:{old:{words:[{id:ids[0],wrong:4,success:true}]}}}};
 J.init(s,ids);assert.equal(s.journey.version,2);assert.equal(J.status(s,ids[0]).wrong,4);assert.equal(J.status(s,ids[0]).hard,true);assert.equal(J.status(s,ids[0]).streak,1);assert.ok(s.journey.mastered.includes(ids[1]));const loaded=copy(s);J.init(loaded,ids);assert.equal(J.status(loaded,ids[0]).wrong,4);assert.equal(J.status(loaded,ids[0]).lastAt,1234567890000);
});
test('more frequently missed words have priority and are spaced among new words',()=>{
 const s=state();for(let n=0;n<2;n++)J.answer(s,ids[0],false);for(let n=0;n<5;n++)J.answer(s,ids[1],false);const pool=J.pool(s,ids,914);
 assert.equal(J.hardWords(s)[0].id,ids[1]);assert.equal(pool[4],ids[1]);assert.equal(pool[9],ids[0]);assert.equal(new Set(pool).size,pool.length);assert.ok(pool.slice(0,4).every(id=>id!==ids[0]&&id!==ids[1]));
});
test('boss and robot strength, wrong penalties and saves follow the chosen tier',()=>{
 for(const [id,hp,hit,penalty] of [['normal',76,11,4],['hard',95,13,6],['nightmare',114,15,8]]){
  let s=B.create('boss',ids,{id:'difficulty-boss-test',seed:25,difficulty:id});assert.equal(B.bossStats(s).hp,hp);assert.equal(s.bossHp,hp);assert.equal(B.intent(s).value,hit);assert.equal(B.validDraft(copy(s)),true);
  s=B.select(s,s.hand.find(i=>B.spell(s,i).cost<=s.mana));const before=s.heroHp;s=B.bossAnswer(s,'wrong');assert.equal(before-s.heroHp,penalty);assert.equal(B.validDraft(copy(s)),true);
  s.phase='camp';s=B.relic(s,'ember');assert.equal(s.bossHp,Math.round(108*B.difficulty(id).hp));assert.equal(B.validDraft(copy(s)),true);
  const r=B.create('robot',ids,{id:'difficulty-robot-test',difficulty:id}),enemy=B.board(r).find(f=>f.side==='enemy');assert.equal(enemy.hp,Math.round(83*B.difficulty(id).hp));assert.equal(enemy.atk,Math.round(11*B.difficulty(id).attack));assert.equal(B.validDraft(copy(r)),true);
 }
 const old=B.create('boss',ids,{id:'legacy-difficulty-test'});delete old.difficulty;assert.equal(B.validDraft(old),true);assert.equal(B.upgrade(old,ids).difficulty,'normal');assert.equal(B.validDraft({...old,difficulty:'impossible'}),false);
});
test('higher tiers draw contextual distractors with unique meanings and one correct choice',()=>{
 const w=words.find(w=>w.word==='agreement');
 for(let seed=1;seed<=10;seed++){
  for(const tier of [1,2,3]){const options=E.choices(w,words,seed,{difficulty:tier});assert.equal(options.length,4);assert.equal(options.filter(o=>o.id===w.id).length,1);assert.equal(new Set(options.map(o=>o.meaning)).size,4);if(tier===2)assert.ok(options.every(o=>o.lesson===w.lesson));if(tier===3)assert.ok(options.every(o=>o.lesson===w.lesson&&o.pos===w.pos));}
 }
});
test('a hard word remains in the battle retry queue until actual mastery',()=>{
 const st=state();let s=B.create('boss',ids,{id:'hard-word-battle-test',seed:517,character:'knight'});const hardId=s.wordIds[s.hand[0]];J.answer(st,hardId,false);J.answer(st,hardId,false);let recalls=0;const solved=new Set();
 for(let n=0;n<220&&recalls<3;n++){
  assert.equal(B.validDraft(copy(s)),true);
  const index=s.hand.find(i=>s.wordIds[i]===hardId&&B.spell(s,i).cost<=s.mana)??s.hand.find(i=>B.spell(s,i).cost<=s.mana);
  if(index===undefined){s=B.endTurn(s);s.heroHp=s.heroMaxHp;s=B.advance(s);continue;}
  s=B.select(s,index);const id=B.question(s);if(id!==hardId){assert.equal(solved.has(id),false);solved.add(id);}else recalls++;
  J.answer(st,id,true);s=B.bossAnswer(s,id,{mastered:J.status(st,id).mastered});s.bossHp=B.bossStats(s).hp;s=B.advance(s);
 }
 assert.equal(recalls,3);assert.equal(J.status(st,hardId).mastered,true);assert.ok(s.retired.includes(hardId));assert.equal(s.retry.some(r=>r.id===hardId),false);
});
