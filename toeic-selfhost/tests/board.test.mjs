import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import '../public/games-engine.js';
import '../public/board-engine.js';
const E=globalThis.PairBoardEngine;
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../public/data.js',import.meta.url),'utf8')+';this.words=WORDS;',context);
const words=JSON.parse(JSON.stringify(context.words));
const empty={known:[],saved:[],seen:{},scores:{},activity:{},lastLesson:1,quiz:null,games:{history:{}}};

test('8×8 contains exactly 64 mixed cards, 32 unambiguous bilingual pairs',()=>{
 const board=E.create(words,empty,{size:8,seed:123});
 assert.equal(board.cards.length,64);assert.equal(board.words.length,32);
 assert.equal(board.cards.filter(c=>c.lang==='en').length,32);assert.equal(board.cards.filter(c=>c.lang==='vi').length,32);
 assert.equal(new Set(board.cards.map(c=>c.key)).size,64);assert.equal(new Set(board.words.map(w=>w.meaning)).size,32);
 for(const w of board.words){const pair=board.cards.filter(c=>c.wordId===w.id);assert.equal(pair.length,2);assert.ok(E.paired(...pair));}
 assert.notDeepEqual(board.cards.map(c=>c.lang),[...Array(32).fill('en'),...Array(32).fill('vi')]);
});

test('wrong cards shake but remain; input is locked until feedback settles',()=>{
 let board=E.create(words,empty,{size:8,seed:42});const first=board.cards[0],wrong=board.cards.find(c=>c.wordId!==first.wordId&&c.lang!==first.lang);
 board=E.select(board,first.key).board;const result=E.select(board,wrong.key);assert.equal(result.kind,'wrong');board=result.board;
 assert.equal(board.mistakes,1);assert.equal(board.cleared.length,0);assert.equal(E.select(board,board.cards[3].key).kind,'ignored');
 board=E.settle(board);assert.equal(board.cleared.length,0);assert.equal(board.cards.length,64);assert.equal(board.selected,null);
 const partner=board.cards.find(c=>c.wordId===first.wordId&&c.key!==first.key);board=E.select(board,first.key).board;board=E.select(board,partner.key).board;assert.equal(board.pending.kind,'correct');assert.equal(board.cleared.length,0);
 board=E.settle(board);assert.equal(board.cleared.length,1);assert.equal(board.mistakes,1);assert.equal(E.select(board,first.key).kind,'ignored');
});

test('win happens only after the last correct pair finishes disappearing',()=>{
 let board=E.create(words,empty,{size:8,seed:11});
 for(let i=0;i<board.words.length;i++){
  const pair=board.cards.filter(c=>c.wordId===board.words[i].id);board=E.select(board,pair[0].key).board;board=E.select(board,pair[1].key).board;
  assert.equal(E.complete(board),false);board=E.settle(board);assert.equal(E.complete(board),i===31);
 }
 assert.equal(board.cleared.length*2,64);assert.equal(board.moves,32);assert.equal(board.mistakes,0);
});

test('all sizes and topics stay playable; larger boards supplement a 12-word topic',()=>{
 for(const size of [4,6,8])for(let topic=1;topic<=50;topic++){
  const board=E.create(words,empty,{size,topic:String(topic),seed:topic});assert.equal(board.cards.length,size*size);
  assert.equal(board.words.filter(w=>w.lesson===topic).length,Math.min(12,size*size/2));
 }
 assert.throws(()=>E.create(words,empty,{size:5}));assert.equal(E.format(61234),'01:01.2');
});
