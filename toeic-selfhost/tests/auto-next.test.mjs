import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the actual UI controllers with a deterministic clock.
function setup() {
 const timers=new Map(),listeners={},nodes=new Map();let now=0,id=0,account='test-profile';
 const node=()=>({innerHTML:'',textContent:'',value:'',dataset:{},classList:{toggle(){},remove(){},add(){}},setAttribute(){},removeAttribute(){},focus(){},addEventListener(){}});
 const document={visibilityState:'visible',activeElement:{tagName:'BODY'},querySelector(selector){if(selector==='[role="dialog"]')return null;if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);},querySelectorAll(){return [];},addEventListener(type,handler){(listeners[type]??=[]).push(handler);}};
 const context={document,location:{hash:'#games'},performance:{now:()=>now},localStorage:{getItem:()=>null},setTimeout(fn,ms){timers.set(++id,{fn,at:now+ms});return id;},clearTimeout(key){timers.delete(key);},setInterval(){return 0;},clearInterval(){},crypto:{randomUUID:()=>String(++id)},scrollTo(){},addEventListener(){},ProfileStore:{isActive:()=>!!account,account:()=>account,save(){},start(){}},BoardMatch:{init(){},identity(){},reset(){},suspend(){},isActive:()=>false}};
 context.window=context;vm.createContext(context);
 for(const file of ['data.js','review-engine.js','games-engine.js','games.js','app.js'])vm.runInContext(fs.readFileSync(new URL('../public/'+file,import.meta.url),'utf8'),context);
 const run=code=>vm.runInContext(code,context);
 const click=dataset=>{const button={dataset};for(const fn of listeners.click||[])fn({target:{closest:()=>button}});};
 return {context,nodes,run,click,document,visibility(value){document.visibilityState=value;for(const fn of listeners.visibilitychange||[])fn();},account(value){account=value;context.GameHub.identity();},advance(ms){const target=now+ms;while(true){const ready=[...timers].filter(([,t])=>t.at<=target).sort((a,b)=>a[1].at-b[1].at)[0];if(!ready)break;now=ready[1].at;timers.delete(ready[0]);ready[1].fn();}now=target;}};
}
function startQuiz(h,answers=[]) {
 h.context.location.hash='#lesson/1/quiz';
 h.run(`route={page:'lesson',id:1,mode:'quiz'};state.quiz={lesson:1,seed:42,answers:${JSON.stringify(answers)}};answerPending=null;renderQuiz(LESSONS[0]);`);
}
function quizAnswer(h,correct=true){const index=h.run('questions(LESSONS[0],state.quiz.seed)[state.quiz.answers.length].correct');h.click({answer:String(correct?index:(index+1)%4)});}
function startSprint(h){h.run('GameHub.render(document.querySelector("#main"))');
 h.click({game:'start',mode:'sprint'});
}
function answerSprint(h,correct=true){const html=h.nodes.get('#main').innerHTML;const word=html.match(/<h2>([^<]+)<\/h2>/)[1];const wordId=h.run(`WORDS.find(w=>w.word===${JSON.stringify(word)}).id`);h.click({game:'answer',word:correct?wordId:'not-the-answer'});}

test('lesson correct answer advances exactly once after 2 seconds; wrong waits',()=>{
 const h=setup();startQuiz(h);quizAnswer(h);h.advance(1999);assert.equal(h.run('state.quiz.answers.length'),0);h.advance(1);assert.equal(h.run('state.quiz.answers.length'),1);h.advance(5000);assert.equal(h.run('state.quiz.answers.length'),1);
 quizAnswer(h,false);h.advance(5000);assert.equal(h.run('state.quiz.answers.length'),1);h.click({action:'quiz-next'});assert.equal(h.run('state.quiz.answers.length'),2);
});
test('lesson manual next, hiding, restart and profile switch cannot skip a question',()=>{
 const h=setup();startQuiz(h);quizAnswer(h);h.click({action:'quiz-next'});h.advance(2000);assert.equal(h.run('state.quiz.answers.length'),1);
 quizAnswer(h);h.visibility('hidden');h.advance(4000);assert.equal(h.run('state.quiz.answers.length'),1);h.visibility('visible');h.advance(2000);assert.equal(h.run('state.quiz.answers.length'),2);
 quizAnswer(h);h.click({action:'restart-quiz'});h.advance(2000);assert.equal(h.run('state.quiz.answers.length'),0);
 quizAnswer(h);h.account('another-profile');h.advance(2000);assert.equal(h.run('state.quiz.answers.length'),0);
});
test('last correct lesson answer automatically saves and opens results',()=>{
 const h=setup();startQuiz(h,Array(29).fill(0));quizAnswer(h);h.advance(2000);assert.equal(h.run('state.quiz.answers.length'),30);assert.equal(h.run('state.scores[1].attempts'),1);assert.match(h.nodes.get('#lesson-content').innerHTML,/result-score/);
});
test('game correct answer auto advances, wrong stays, and suspension cancels stale work',()=>{
 const h=setup();startSprint(h);answerSprint(h);h.advance(1999);assert.match(h.nodes.get('#main').innerHTML,/0\/10 câu đã làm/);h.advance(1);assert.match(h.nodes.get('#main').innerHTML,/1\/10 câu đã làm/);
 answerSprint(h,false);h.advance(5000);assert.match(h.nodes.get('#main').innerHTML,/1\/10 câu đã làm/);h.click({game:'next'});
 answerSprint(h);h.context.GameHub.suspend();h.context.location.hash='#home';h.advance(4000);h.context.location.hash='#games';h.run('GameHub.render(document.querySelector("#main"))');assert.match(h.nodes.get('#main').innerHTML,/2\/10 câu đã làm/);h.advance(2000);assert.match(h.nodes.get('#main').innerHTML,/3\/10 câu đã làm/);
 answerSprint(h);h.click({game:'next'});h.advance(2000);assert.match(h.nodes.get('#main').innerHTML,/4\/10 câu đã làm/);
});
