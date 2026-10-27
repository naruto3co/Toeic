import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import '../public/battle-engine.js';
import '../public/profile-sync.js';
import {emptyProgress,validateProgress} from '../server/progress.ts';
const B=globalThis.WordBattles,S=globalThis.ProfileSync;
const ids=Array.from({length:12},(_,i)=>`1-${i}`);
const create=mode=>B.create(mode,ids.slice(0,mode==='robot'?10:12),{id:'battle-test-1234',seed:42,at:1700000000000});
const valid=s=>{assert.equal(B.validDraft(s),true,JSON.stringify(s));const state=emptyProgress();state.battleDrafts[s.mode]=s;assert.deepEqual(validateProgress(state).battleDrafts[s.mode],s);};
function charge(s,correct=true){s=B.charge(s);valid(s);s=B.robotAnswer(s,correct?B.question(s):'2-0');valid(s);return B.advance(s);}

test('robot economy, three-copy upgrades, board capacity, swapping and synergies are enforced',()=>{
 let s=create('robot');s={...s,coins:100};for(let i=0;i<9;i++)s=B.buy(s,'aegis');assert.equal(s.units.length,1);assert.equal(s.units[0].star,3);assert.equal(s.coins,73);valid(s);
 s=B.buy(s,'volt');const a=s.units[0],v=s.units[1];s=B.move(s,a.uid,v.pos);assert.equal(s.units.find(u=>u.uid===v.uid).pos,a.pos);valid(s);s=B.sell(s,a.uid);assert.equal(s.coins,90);
 let full={...create('robot'),coins:100,shop:['aegis','volt','mender']};for(const type of ['aegis','aegis','volt','volt','mender','mender'])full=B.buy(full,type);assert.equal(full.units.length,6);assert.equal(B.synergies(full).tank,2);full=B.buy(full,'aegis');assert.equal(full.units.length,5);assert.equal(full.units.find(u=>u.type==='aegis').star,2);valid(full);
 const poor=create('robot');poor.coins=2;assert.equal(B.buy(poor,'volt'),poor);assert.equal(B.move({...poor,phase:'fight'},'unit-1',1).phase,'fight');
});

test('robot charging locks answers, grants limited funds, and requires two words before deterministic combat',()=>{
 let s=create('robot');s=B.buy(s,'volt');assert.equal(B.fight(s),s);s=B.charge(s);const wrong=B.robotAnswer(s,'2-0');assert.equal(wrong.coins,s.coins+1);assert.equal(wrong.energy,0);assert.equal(B.robotAnswer(wrong,ids[0]),wrong);assert.equal(B.buy(wrong,'volt'),wrong);s=charge(B.advance(wrong));assert.equal(s.charged,2);assert.equal(s.energy,1);assert.equal(B.charge(s),s);
 const first=B.fight(s),second=B.fight(s);assert.deepEqual(first,second);valid(first);const restored=JSON.parse(JSON.stringify(B.frame(first)));assert.deepEqual(B.board(restored),B.board(B.frame(first)));let final=restored;while(final.phase==='fight'){valid(final);final=B.frame(final);}valid(final);assert.ok(B.board(final).every(u=>u.hp>=0&&u.hp<=u.maxHp));
});

test('robot campaign reaches five waves with a real roster and ends once',()=>{
 let s=create('robot');for(let wave=1;wave<=5;wave++){
  s=charge(charge(s));
  while(s.coins>=3){const type=wave%2?'volt':'aegis',next=B.buy(s,type);if(next===s)break;s=next;}
  if(!s.units.length)s=B.buy(s,'volt');s=B.fight(s);while(s.phase==='fight')s=B.frame(s);valid(s);if(B.complete(s))break;s=B.nextWave(s);
 }
 assert.ok(B.complete(s));assert.equal(s.wave,5);assert.equal(s.phase,'won');assert.equal(Object.keys(s.results).length,10);assert.equal(B.nextWave(s),s);assert.equal(B.buy(s,'volt'),s);
});

test('boss cards spend energy, fizzle on mistakes, keep deck unique, and telegraph attacks',()=>{
 let s=create('boss');valid(s);const index=s.hand.find(i=>B.spell(s,i).kind==='hit');s=B.select(s,index);valid(s);const hp=s.bossHp;s=B.bossAnswer(s,B.question(s));assert.ok(s.bossHp<hp);assert.equal(s.mana,3-B.spell(s,index).cost);assert.equal(s.hand.includes(index),false);assert.equal(B.bossAnswer(s,'1-0'),s);valid(s);s=B.advance(s);valid(s);
 const second=s.hand.find(i=>B.spell(s,i).cost<=s.mana);s=B.select(s,second);s=B.bossAnswer(s,'2-0');assert.equal(s.heroHp,81);assert.equal(s.results[ids[second]].wrong,1);valid(s);s=B.advance(s);
 const intent=B.intent(s);s=B.endTurn(s);assert.equal(s.heroHp,81-intent.value);valid(s);s=B.advance(s);assert.equal(s.mana,s.maxMana);assert.equal(s.hand.length,5);valid(s);
});

test('boss guard absorbs only the next turn, relics advance stages, and all three bosses are beatable',()=>{
 let guard=create('boss');guard.hand=[1,0,2,3,4];guard.pile=[5,6,7,8,9,10,11];guard.discard=[];guard=B.select(guard,1);guard=B.bossAnswer(guard,B.question(guard));guard=B.advance(guard);assert.equal(guard.block,18);guard=B.endTurn(guard);assert.equal(guard.heroHp,85);assert.equal(guard.block,0);valid(guard);
 let s=create('boss'),moves=0;while(!B.complete(s)&&moves++<1000){
  valid(s);
  if(s.phase==='feedback'||s.phase==='counter'){s=B.advance(s);continue;}
  if(s.phase==='camp'){s=B.relic(s,'ember');continue;}
  const affordable=s.hand.filter(i=>B.spell(s,i).cost<=s.mana);
  const rank=i=>{const c=B.spell(s,i);return c.kind==='heal'?(s.heroHp<65?100:-20):c.kind==='guard'?(s.block<B.intent(s).value?80:-10):c.kind==='power'?90:c.kind==='spark'?75:70;};
  affordable.sort((a,b)=>rank(b)-rank(a));if(affordable.length&&rank(affordable[0])>0){s=B.select(s,affordable[0]);s=B.bossAnswer(s,B.question(s));}else s=B.endTurn(s);
 }
 valid(s);assert.equal(s.phase,'won');assert.equal(s.stage,3);assert.equal(s.relics.length,2);assert.ok(s.heroHp>0);assert.equal(B.select(s,0),s);
});

test('draft validation rejects corrupt decks, combat events, phases, word IDs and payloads',()=>{
 for(const mode of ['robot','boss']){const s=create(mode);valid(s);valid({id:s.id,mode,at:s.at,ended:true});for(const patch of [{wordIds:[...ids]},{elapsedMs:-1},{mode:'other'},{rng:-1},{results:{'50-12':{wrong:0,success:true}}},{extra:'x'.repeat(61000)}]){const d={...s,...patch};if(mode==='boss'&&patch.wordIds)continue;assert.equal(B.validDraft(d),false);}}
 const s=create('boss');s.hand[0]=s.hand[1];assert.equal(B.validDraft(s),false);const r=B.fight(charge(charge(B.buy(create('robot'),'volt'))));r.fight.events[0].target='outsider';assert.equal(B.validDraft(r),false);
});

test('separate robot and boss drafts merge independently and completion cannot resurrect a stale battle',()=>{
 const base=emptyProgress(),a=structuredClone(base),b=structuredClone(base);a.battleDrafts.robot=create('robot');b.battleDrafts.boss=create('boss');const merged=S.merge(base,a,b);assert.ok(merged.battleDrafts.robot);assert.ok(merged.battleDrafts.boss);validateProgress(merged);
 const done=structuredClone(merged),d=done.battleDrafts.robot;done.games.history[d.id]={mode:'robot',at:d.at+10,score:100,correct:1,total:10,seconds:5,won:false,stage:1,words:d.wordIds.map((id,i)=>({id,wrong:0,success:i===0}))};done.battleDrafts.robot={id:d.id,mode:'robot',at:d.at+10,ended:true};const stale=structuredClone(merged);stale.battleDrafts.robot.at+=20;const combined=S.merge(merged,stale,done);assert.equal(combined.battleDrafts.robot.ended,true);validateProgress(combined);
 const legacy=structuredClone(base);delete legacy.battleDrafts;assert.deepEqual(S.merge(base,legacy,merged).battleDrafts,merged.battleDrafts);
});

function ui(initial=emptyProgress()){
 const listeners={},timers=new Map(),nodes=new Map();let state=structuredClone(initial),now=0,serial=0,owner='player',saved;
 const node=()=>({innerHTML:'',focus(){}}),document={visibilityState:'visible',activeElement:{tagName:'BODY'},querySelector(s){if(!nodes.has(s))nodes.set(s,node());return nodes.get(s);},querySelectorAll(){return [];},addEventListener(type,fn){(listeners[type]??=[]).push(fn);}};
 class ClockDate extends Date{static now(){return 1700000000000+now;}}
 const ctx={Date:ClockDate,document,location:{hash:'#games'},performance:{now:()=>now},crypto:{randomUUID:()=>`battle-ui-test-${++serial}`},setTimeout(fn,ms){const id=++serial;timers.set(id,{fn,at:now+ms});return id;},clearTimeout:id=>timers.delete(id),ProfileStore:{isActive:()=>true,account:()=>owner}};ctx.window=ctx;vm.createContext(ctx);for(const name of ['data.js','review-engine.js','games-engine.js','battle-engine.js','battle-games.js'])vm.runInContext(fs.readFileSync(new URL('../public/'+name,import.meta.url),'utf8'),ctx);
 ctx.BattleGames.init({getState:()=>state,save(){saved=structuredClone(state);},review(id,correct){ctx.VocabularyReview.answer(state,id,correct,ClockDate.now());},speak(){},notify(){},onExit(){}});
 return {ctx,document,host:node(),get state(){return state;},get saved(){return saved;},click(dataset){const button={dataset,disabled:false};for(const fn of listeners.click||[])fn({target:{closest:()=>button}});},advance(ms){const end=now+ms;for(;;){const next=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].fn();}now=end;},switch(){owner='other';state=emptyProgress();ctx.BattleGames.identity();}};
}

test('actual controller auto advances after 2 seconds, waits on mistakes, pauses time and resumes a reload',()=>{
 const h=ui();h.ctx.BattleGames.start(h.host,'robot');h.advance(1200);h.click({battle:'charge'});const id=h.state.battleDrafts.robot.wordIds[0];h.click({battle:'answer',word:id});assert.equal(h.state.battleDrafts.robot.phase,'feedback');assert.equal(h.state.reviews[id].streak,1);h.advance(1999);assert.equal(h.state.battleDrafts.robot.phase,'feedback');h.advance(1);assert.equal(h.state.battleDrafts.robot.phase,'prep');h.click({battle:'charge'});h.click({battle:'answer',word:'50-0'});h.advance(5000);assert.equal(h.state.battleDrafts.robot.phase,'feedback');h.click({battle:'pause'});const elapsed=h.state.battleDrafts.robot.elapsedMs;h.advance(10000);h.ctx.BattleGames.checkpoint();assert.equal(h.state.battleDrafts.robot.elapsedMs,elapsed);validateProgress(h.state);
 const reload=ui(h.saved);reload.ctx.BattleGames.start(reload.host,'robot');assert.match(reload.host.innerHTML,/Nghỉ một chút/);reload.advance(5000);reload.click({battle:'resume'});reload.click({battle:'next'});assert.equal(reload.state.battleDrafts.robot.charged,2);reload.switch();assert.equal(reload.ctx.BattleGames.isActive(),false);assert.equal(reload.state.battleDrafts.robot,null);
});

test('controller records a completed battle once and saves a tombstone across reload',()=>{
 let s=create('boss');s.heroHp=1;s.phase='counter';s.feedback={wordId:null,correct:false,effect:'Tấn công'};s.heroHp=0;const initial=emptyProgress();initial.battleDrafts.boss=s;const h=ui(initial);h.ctx.BattleGames.start(h.host,'boss');h.click({battle:'resume'});h.advance(1000);assert.equal(h.state.battleDrafts.boss.ended,true);assert.equal(Object.keys(h.state.games.history).length,1);h.ctx.BattleGames.render(h.host);h.ctx.BattleGames.checkpoint();assert.equal(Object.keys(h.state.games.history).length,1);validateProgress(h.state);
});


test('both tactical games wire fullscreen controls, keep a layout region and restore on exit',()=>{
 for(const mode of ['robot','boss']){
  const h=ui(),active=[];
  h.ctx.GameScreen={control:()=>'<button data-screen-toggle>Toàn màn hình</button>',setActive:value=>active.push(value)};
  h.ctx.BattleGames.start(h.host,mode);
  assert.match(h.host.innerHTML,/data-screen-toggle/);assert.match(h.host.innerHTML,/class="battle-layout /);
  assert.match(h.host.innerHTML,/class="battle-deck"/);assert.equal(active.at(-1),true);
  h.click({battle:'pause'});assert.match(h.host.innerHTML,/pause-screenbar/);
  h.click({battle:'exit'});assert.equal(active.at(-1),false);assert.equal(h.ctx.BattleGames.isActive(),false);
 }
});
