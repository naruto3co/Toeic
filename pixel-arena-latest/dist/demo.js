/* Standalone demo. Real account/database functionality belongs to the self-host package. */
(function(){
 'use strict';
 const key='toeic-pixel-arena-demo-v1',main=document.querySelector('#main');
 const blank=()=>({known:[],saved:[],seen:{},scores:{},activity:{},lastLesson:1,quiz:null,games:{history:{}},reviews:{},boardDraft:null,battleDrafts:{robot:null,boss:null}});
 let state=blank(),mode=null,noticeTimer;
 try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved&&typeof saved==='object'&&!Array.isArray(saved)){state={...state,...saved};for(const name of ['robot','boss']){const draft=state.battleDrafts?.[name];if(draft&&!WordBattles.validDraft(draft))state.battleDrafts[name]=null;}}}catch{state=blank();}
 WordJourney.init(state,WORDS.map(w=>w.id));
 window.ProfileStore={isActive:()=>true,account:()=> 'local-demo'};
 function notify(message){const box=document.querySelector('#demo-notice');box.textContent=message;box.classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>box.classList.remove('visible'),4200);}
 function stats(){document.querySelector('#demo-words').textContent=state.journey.mastered.length;document.querySelector('#demo-rounds').textContent=Object.keys(state.games?.history||{}).length;}
 function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{notify('Trình duyệt chưa lưu được tiến độ. Ván này vẫn tiếp tục chơi được.');}stats();}
 const bridge={getState:()=>state,save,dayKey:()=>new Date().toLocaleDateString('en-CA'),icon:()=>'',notify,speak(id){const word=WORDS.find(w=>w.id===id);if(word)LearningAudio.play(word.word,{rate:.8,onError:notify});},review(id,correct){VocabularyReview.answer(state,id,correct);if(!correct&&!state.saved.includes(id))state.saved.push(id);save();},onExit(){CampaignUI.reset();document.body.classList.remove('game-active');mode=null;document.querySelectorAll('[data-demo-mode]').forEach(b=>b.classList.remove('active'));main.innerHTML='<div class="lobby-screenbar"><button class="t-button map-lobby-button" data-demo-mode="map">✦ Bản đồ 50 chủ đề →</button>'+GameScreen.control()+'</div><div class="demo-lobby-intro"><span>CHƠI MỘT CHÚT, NHỚ THÊM MỘT CHÚT</span><h1>Chọn một chuyến phiêu lưu.</h1><p>Mỗi từ nhớ được là một sức mạnh mới.</p></div>'+BattleGames.tiles();window.scrollTo({top:0,behavior:'instant'});}};
 GameScreen.init({notify});
 CampaignUI.init(bridge);
 BattleGames.init(bridge);
 function start(name){if(!['map','boss','robot'].includes(name))name='map';if(mode===name&&(name==='map'||BattleGames.isActive()))return;LearningAudio.cancel();CampaignUI.reset();BattleGames.reset();mode=name;document.querySelectorAll('[data-demo-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.demoMode===name);b.setAttribute('aria-pressed',String(b.dataset.demoMode===name));});if(name==='map')CampaignUI.start(main);else BattleGames.start(main,name);}

 document.addEventListener('click',e=>{const choice=e.target.closest('[data-demo-mode]'),tile=e.target.closest('[data-game="start"]');if(choice||tile){ActionAudio.play('select');const name=choice?.dataset.demoMode||tile.dataset.mode;if(location.hash!=='#games/'+name)location.hash='games/'+name;else start(name);}});
 function showHelp(){ActionAudio.play('click');if(mode==='map'){CampaignUI.suspend();CampaignUI.render();}else{BattleGames.suspend();if(mode)BattleGames.render(main);}document.querySelector('#demo-help-dialog').showModal();}
 document.querySelector('#demo-help').addEventListener('click',showHelp);
 document.addEventListener('click',e=>{if(e.target.closest('[data-screen-help]'))showHelp();});
 document.querySelector('#demo-close-help').addEventListener('click',()=>document.querySelector('#demo-help-dialog').close());
 window.addEventListener('hashchange',()=>start(location.hash.split('/')[1]));
 window.addEventListener('pagehide',()=>{BattleGames.checkpoint();LearningAudio.cancel();});
 stats();if(!location.hash.startsWith('#games'))location.hash='games/map';else start(location.hash.split('/')[1]);
})();
