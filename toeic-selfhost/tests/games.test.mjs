import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import '../public/games-engine.js';
import '../public/profile-sync.js';
const E=globalThis.VocabularyGames;
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../public/data.js',import.meta.url),'utf8')+';this.words=WORDS;this.lessons=LESSONS;',context);
const words=JSON.parse(JSON.stringify(context.words));
const blank=()=>({known:[],saved:[],seen:{},scores:{},activity:{},lastLesson:1,quiz:null,games:{history:{}}});
const round=(mode,at,entries)=>({mode,at,score:100,correct:entries.filter(e=>e.success&&!e.wrong).length,total:entries.length,seconds:30,words:entries});

test('every topic produces playable unique decks in all modes, with real sentence blanks',()=>{
 for(let topic=1;topic<=50;topic++)for(const mode of ['match','sprint','spell']){
  const deck=E.deck(words,blank(),{topic:String(topic),mode,seed:topic});
  assert.equal(deck.length,{match:6,sprint:10,spell:8}[mode]);assert.equal(new Set(deck.map(w=>w.id)).size,deck.length);assert.ok(deck.every(w=>w.lesson===topic));
  for(const w of deck){if(mode==='spell')assert.ok(E.gap(w).includes('________'));const options=E.choices(w,words,42);assert.equal(options.length,4);assert.equal(new Set(options.map(o=>o.meaning)).size,4);assert.equal(options.filter(o=>o.id===w.id).length,1);}
 }
});

test('mistakes are prioritized, a later unaided answer clears review, and saved words remain useful',()=>{
 const s=blank();s.saved=['3-1'];s.games=E.record(s,'round-mistake',round('sprint',1,[{id:'1-0',wrong:1,success:false}]));
 assert.deepEqual(E.reviewIds(s),['1-0']);assert.equal(E.deck(words,s,{seed:4})[0].id,'1-0');
 s.games=E.record(s,'round-hinted',round('spell',2,[{id:'1-0',wrong:1,success:true}]));assert.deepEqual(E.reviewIds(s),['1-0']);
 s.games=E.record(s,'round-recalled',round('spell',3,[{id:'1-0',wrong:0,success:true}]));assert.deepEqual(E.reviewIds(s),[]);
 assert.equal(E.deck(words,s,{seed:4})[0].id,'3-1');
});

test('spelling accepts case and whitespace variants but keeps distinct words distinct',()=>{
 assert.equal(E.normalize('  Boarding   PASS '),E.normalize('boarding pass'));
 assert.equal(E.normalize('CHECK–IN'),E.normalize('check-in'));
 assert.notEqual(E.normalize('contract'),E.normalize('contact'));
 assert.equal(E.gap({word:'rent',example:'Please rent the car.'}),'Please ________ the car.');
 assert.equal(E.gap({word:'rent',example:'Check the parent company.'}),null);
});

test('two devices merge game results once; retries and old profiles keep the same history',()=>{
 const base=blank(),a=blank(),b=blank();a.games=E.record(a,'game-device-A',round('match',1,[{id:'1-0',wrong:0,success:true}]));b.games=E.record(b,'game-device-B',round('sprint',2,[{id:'2-0',wrong:1,success:false}]));
 const merged=globalThis.ProfileSync.merge(base,b,a);assert.equal(Object.keys(merged.games.history).length,2);
 assert.equal(Object.keys(globalThis.ProfileSync.merge(base,b,merged).games.history).length,2);
 const old=blank();delete old.games;assert.equal(Object.keys(globalThis.ProfileSync.merge(old,old,merged).games.history).length,2);
});

test('history stays bounded and a weak word can be replayed without filler',()=>{
 const s=blank();for(let i=0;i<110;i++)s.games=E.record(s,'round-history-'+String(i).padStart(4,'0'),round('match',i,[{id:'1-0',wrong:0,success:true}]));
 assert.equal(Object.keys(s.games.history).length,100);assert.equal(E.history(s)[0][1].at,10);
 s.games=E.record(s,'round-latest-error',round('spell',200,[{id:'1-0',wrong:1,success:false}]));assert.equal(E.deck(words,s,{mode:'spell',review:true}).length,1);
 assert.ok(E.points(true,4)>E.points(true,1));assert.ok(E.points(true,1)>E.points(false,1));
});


test('synchronization compares JSON content independently of object property order',()=>{
 const local={mode:'board',elapsedMs:1200,words:[{id:'1-0',wrong:0,success:true}]};
 const server={words:[{success:true,wrong:0,id:'1-0'}],mode:'board',elapsedMs:1200};
 assert.equal(globalThis.ProfileSync.same(local,server),true);
 assert.equal(globalThis.ProfileSync.same({answers:[0,1]},{answers:[1,0]}),false);
});
