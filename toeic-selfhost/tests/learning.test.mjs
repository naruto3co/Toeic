import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import '../public/review-engine.js';
import '../public/games-engine.js';
import '../public/board-engine.js';
import '../public/board-checkpoint.js';
import '../public/profile-sync.js';
import {emptyProgress,validateProgress} from '../server/progress.ts';
const R=globalThis.VocabularyReview,E=globalThis.PairBoardEngine,C=globalThis.BoardCheckpoint,S=globalThis.ProfileSync;
const source=file=>fs.readFileSync(new URL('../public/'+file,import.meta.url),'utf8');
const data={};vm.createContext(data);vm.runInContext(source('data.js')+';this.words=WORDS;',data);const words=JSON.parse(JSON.stringify(data.words));

test('review intervals expand, mistakes return after 10 minutes, and legacy words enter the queue',()=>{
 const state=emptyProgress();let now=100000000;
 for(const days of [1,3,7,14,30,60,60]){const row=R.answer(state,'1-0',true,now);assert.equal(row.dueAt-now,days*R.DAY);now=row.dueAt;}
 const wrong=R.answer(state,'1-0',false,now);assert.equal(wrong.streak,0);assert.equal(wrong.lapses,1);assert.equal(wrong.dueAt-now,600000);assert.deepEqual(R.due(state,now+599999),[]);assert.deepEqual(R.due(state,now+600000),['1-0']);
 assert.equal(R.answer(state,'1-0',true,now+600001).streak,1);
 state.known=['2-0'];state.saved=['3-0'];state.seen={4:{ids:['4-0'],last:0}};assert.deepEqual(new Set(R.due(state,now)),new Set(['2-0','3-0','4-0']));assert.equal(validateProgress(state).reviews['1-0'].lapses,1);
});

test('two devices keep independent schedules, latest review wins, stale retries do not double counts',()=>{
 const base=emptyProgress(),a=structuredClone(base),b=structuredClone(base);R.answer(a,'1-0',true,1000);R.answer(b,'2-0',false,1100);R.answer(b,'1-0',false,1200);
 const merged=S.merge(base,a,b);assert.equal(Object.keys(merged.reviews).length,2);assert.equal(merged.reviews['1-0'].lapses,1);assert.deepEqual(S.merge(base,a,merged).reviews,merged.reviews);
 const older=structuredClone(base);delete older.reviews;delete older.boardDraft;assert.deepEqual(S.merge(base,older,merged).reviews,merged.reviews);
 const reset=structuredClone(merged);reset.reviews={};assert.deepEqual(S.merge(merged,reset,merged).reviews,{});
});

test('board checkpoint preserves shuffled positions, resolves animations and validates untrusted payloads',()=>{
 let board=E.create(words,emptyProgress(),{size:8,seed:42}),pair=board.cards.filter(c=>c.wordId===board.words[0].id);board=E.select(board,pair[0].key).board;board=E.select(board,pair[1].key).board;
 const session={id:'board-checkpoint-test',board,wrong:{},score:100,combo:1,bestCombo:1};const checkpoint=C.pack(session,9876,10000);assert.equal(board.cleared.length,0);assert.equal(checkpoint.cleared.length,1);
 const restored=C.restore(checkpoint,words);assert.deepEqual(restored.board.cards.map(c=>c.key),board.cards.map(c=>c.key));assert.equal(restored.board.pending,null);assert.equal(restored.paused,true);assert.equal(restored.carried,9876);
 const state=emptyProgress();state.boardDraft=checkpoint;assert.deepEqual(validateProgress(state).boardDraft,checkpoint);
 const duplicate=structuredClone(state);duplicate.boardDraft.order[0]=duplicate.boardDraft.order[1];assert.throws(()=>validateProgress(duplicate));
 const outsider=structuredClone(state);outsider.boardDraft.cleared=['50-11'];assert.throws(()=>validateProgress(outsider));
 const badTime=structuredClone(state);badTime.boardDraft.elapsedMs=-1;assert.throws(()=>validateProgress(badTime));
});

function ui(initial=emptyProgress(),files=['data.js','review-engine.js','games-engine.js','board-engine.js','board-checkpoint.js','board-game.js']){
 const listeners={},nodes=new Map(),timers=new Map();let state=structuredClone(initial),saved,now=0,serial=0,owner='learner',spoken=null;
 const node=()=>({innerHTML:'',textContent:'',dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},focus(){},getAttribute(){return null;},addEventListener(){}});
 const document={visibilityState:'visible',activeElement:node(),querySelector(selector){if(selector==='[role="dialog"]')return null;if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);},querySelectorAll(){return [];},addEventListener(type,fn){(listeners[type]??=[]).push(fn);}};
 class ClockDate extends Date{constructor(...args){super(...(args.length?args:[1700000000000+now]));}static now(){return 1700000000000+now;}}
 const context={Date:ClockDate,document,location:{hash:'#games'},performance:{now:()=>now},crypto:{randomUUID:()=>('test-session-'+String(++serial).padStart(6,'0'))},setTimeout(fn,ms){const id=++serial;timers.set(id,{fn,at:now+ms,repeat:0});return id;},clearTimeout:id=>timers.delete(id),setInterval(fn,ms){const id=++serial;timers.set(id,{fn,at:now+ms,repeat:ms});return id;},clearInterval:id=>timers.delete(id),ProfileStore:{isActive:()=>!!owner,account:()=>owner},BoardMatch:{init(){},identity(){},reset(){},isActive:()=>false},LearningAudio:{cancel(){},play(text,opts){spoken={text,opts};opts.onStart();return true;}}};context.window=context;vm.createContext(context);for(const file of files)vm.runInContext(source(file),context);
 const bridge={getState:()=>state,save(){saved=structuredClone(state);},icon:()=>'',notify(){},speak(){},dayKey:()=> '2026-10-21',review(id,correct){const row=context.VocabularyReview.answer(state,id,correct,ClockDate.now());this.save();return row;},onExit(){}};
 if(files.includes('board-game.js'))context.BoardMatch.init(bridge);if(files.includes('games.js'))context.GameHub.init(bridge);
 const click=dataset=>{const button={dataset,setAttribute(){},textContent:''};for(const fn of listeners.click||[])fn({target:{closest(selector){if(selector==='[data-board-card]')return dataset.boardCard?button:null;if(selector==='[data-board-action]')return dataset.boardAction?button:null;if(selector==='[data-game]')return dataset.game?button:null;return null;}}});};
 return {context,bridge,nodes,document,get state(){return state;},get saved(){return saved;},get spoken(){return spoken;},click,host:document.querySelector('#main'),advance(ms){const target=now+ms;while(true){const first=[...timers].filter(([,t])=>t.at<=target).sort((a,b)=>a[1].at-b[1].at)[0];if(!first)break;now=first[1].at;if(first[1].repeat)first[1].at+=first[1].repeat;else timers.delete(first[0]);first[1].fn();}now=target;},switchUser(){owner='someone-else';state=emptyProgress();context.BoardMatch.identity(owner);}};
}

test('actual board controller resumes after reload, stops time while away, isolates profiles and completes once',()=>{
 const h=ui();h.context.BoardMatch.start(h.host,{size:8});h.advance(1700);const first=h.state.boardDraft.wordIds[0];h.click({boardCard:first+'-en'});h.click({boardCard:first+'-vi'});h.advance(650);h.click({boardAction:'pause'});const stored=structuredClone(h.saved),oldTime=stored.boardDraft.elapsedMs;assert.equal(stored.boardDraft.cleared.length,1);assert.equal(oldTime,2350);
 const next=ui(stored);next.context.BoardMatch.resumeSaved(next.host);assert.match(next.host.innerHTML,/Nghỉ một chút/);next.advance(10000);next.context.BoardMatch.checkpoint();assert.equal(next.state.boardDraft.elapsedMs,oldTime);assert.deepEqual(next.state.boardDraft.order,stored.boardDraft.order);
 next.click({boardAction:'resume'});next.advance(1000);next.context.BoardMatch.checkpoint();assert.equal(next.state.boardDraft.elapsedMs,oldTime+1000);
 for(const id of stored.boardDraft.wordIds.slice(1)){next.click({boardCard:id+'-en'});next.click({boardCard:id+'-vi'});next.advance(650);}
 assert.equal(next.state.boardDraft.ended,true);assert.equal(Object.keys(next.state.games.history).length,1);const final=structuredClone(next.state);assert.equal(C.available(final),false);
 const merged=S.merge(stored,stored,final);assert.equal(merged.boardDraft.ended,true);assert.equal(Object.keys(merged.games.history).length,1);
 const profile=ui(stored);profile.context.BoardMatch.resumeSaved(profile.host);profile.switchUser();assert.equal(profile.context.BoardMatch.isActive(),false);assert.equal(profile.state.boardDraft,null);
});

test('closing during the last green animation resumes to one recorded victory',()=>{
 const h=ui();h.context.BoardMatch.start(h.host,{size:4});const ids=[...h.state.boardDraft.wordIds];for(const id of ids.slice(0,-1)){h.click({boardCard:id+'-en'});h.click({boardCard:id+'-vi'});h.advance(650);}const last=ids.at(-1);h.click({boardCard:last+'-en'});h.click({boardCard:last+'-vi'});
 assert.equal(h.state.boardDraft.cleared.length,8);assert.equal(Object.keys(h.state.games.history).length,0);
 const restored=ui(h.saved);restored.context.BoardMatch.resumeSaved(restored.host);assert.equal(Object.keys(restored.state.games.history).length,1);assert.equal(restored.state.boardDraft.ended,true);
});

test('listening requires actual playback, hides the English word, accepts meaning and schedules review',()=>{
 const h=ui(emptyProgress(),['data.js','review-engine.js','games-engine.js','games.js']);h.context.GameHub.render(h.host);h.click({game:'start',mode:'listen'});assert.match(h.host.innerHTML,/Bấm Nghe từ/);h.click({game:'answer',word:'1-0'});assert.equal(Object.keys(h.state.reviews).length,0);
 h.click({game:'listen-play'});assert.equal(h.spoken.opts.rate,.65);const word=words.find(w=>w.word===h.spoken.text);assert.ok(word);assert.ok(!h.host.innerHTML.includes('>'+word.word+'<'));
 h.click({game:'answer',word:word.id});assert.equal(h.state.reviews[word.id].streak,1);assert.match(h.host.innerHTML,/Tự chuyển sau 2 giây/);h.advance(2000);assert.match(h.host.innerHTML,/1\/10 câu đã làm/);
 h.context.LearningAudio.play=(_text,opts)=>{opts.onError('No speech engine');return false;};h.click({game:'listen-play'});h.click({game:'answer',word:'1-0'});assert.equal(Object.keys(h.state.reviews).length,1);assert.equal(h.nodes.get('#listen-status').textContent,'No speech engine');
});

test('audio helper handles voice, speed, cancellation and missing support without revealing answers',()=>{
 const timers=new Map();let utterance,started=0,ended=0,error='';const context={setTimeout(fn){timers.set(1,fn);return 1;},clearTimeout:id=>timers.delete(id),SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{cancel(){},getVoices:()=>[{lang:'en-US',name:'Test voice'}],speak(value){utterance=value;}}};context.window=context;vm.createContext(context);vm.runInContext(source('audio.js'),context);
 context.LearningAudio.play('contract',{rate:.65,onStart:()=>started++,onEnd:()=>ended++,onError:value=>error=value});assert.equal(utterance.lang,'en-US');assert.equal(utterance.rate,.65);utterance.onstart();assert.equal(started,1);assert.equal(timers.size,0);utterance.onend();assert.equal(ended,1);
 context.LearningAudio.play('agreement',{onError:value=>error=value});context.LearningAudio.cancel();utterance.onstart();assert.equal(timers.size,0);
 delete context.speechSynthesis;assert.equal(context.LearningAudio.play('test',{onError:value=>error=value}),false);assert.match(error,/chưa hỗ trợ/);
});
