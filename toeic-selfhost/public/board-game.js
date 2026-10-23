(function(){
 'use strict';
 const E=PairBoardEngine,V=VocabularyGames;
 let bridge,host,session=null,owner=null,clock=null,animation=null,lastCheckpoint=0;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icon=name=>bridge.icon(name);
 const id=()=>globalThis.crypto?.randomUUID?.()||'board-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 const isHere=()=>location.hash.replace(/^#\/?/,'').split('/')[0]==='games'&&window.ProfileStore?.isActive();
 function clearClock(){if(clock)clearInterval(clock);clock=null;}
 function unfocus(){document.querySelector('#study-app')?.classList.remove('board-focus');}
 function reset(){clearClock();clearTimeout(animation);animation=null;session=null;unfocus();}
 function identity(name){if(owner!==name){reset();owner=name;}}
 function elapsed(){return session?(session.done?session.finalMs:session.carried+(session.paused?0:performance.now()-session.started)):0;}
 function checkpoint(){if(!session||session.done||!bridge||owner!==window.ProfileStore?.account())return;const state=bridge.getState(),at=Math.max(Date.now(),(state.boardDraft?.at||0)+1);state.boardDraft=window.BoardCheckpoint.pack(session,elapsed(),at);lastCheckpoint=performance.now();bridge.save();}
 function resumeSaved(target){reset();host=target;owner=window.ProfileStore?.account();const state=bridge.getState();if(!window.BoardCheckpoint.available(state)){bridge.notify('Chưa có ván đang lưu.');bridge.onExit();return;}session=window.BoardCheckpoint.restore(state.boardDraft,WORDS);if(!session){bridge.notify('Chưa khôi phục được ván này. Bạn có thể bắt đầu ván mới.');bridge.onExit();return;}lastCheckpoint=performance.now();if(E.complete(session.board))finish();else render(host);}
 function tick(){if(!session||session.paused||session.done||!isHere()){clearClock();return;}const el=document.querySelector('#board-time');if(el)el.textContent=E.format(elapsed());if(performance.now()-lastCheckpoint>=5000)checkpoint();}
 function runClock(){clearClock();if(session&&!session.done&&!session.paused){tick();clock=setInterval(tick,100);}}
 function start(target,{size=8,topic='all'}={}){
  reset();host=target;owner=window.ProfileStore?.account();
  try{const seed=Math.floor(Math.random()*4294967295),board=E.create(WORDS,bridge.getState(),{size,topic,seed});session={id:id(),board,wrong:{},combo:0,bestCombo:0,score:0,carried:0,started:performance.now(),paused:false,done:false,saved:false,finalMs:0,lastWord:null,message:'Chọn hai thẻ có cùng nghĩa: một thẻ EN và một thẻ VI.'};checkpoint();render(host);}catch(error){bridge.notify(error.message);bridge.onExit();}
 }
 function record(){
  if(session.saved)return;session.saved=true;const s=bridge.getState(),words=session.board.words.map(w=>({id:w.id,wrong:Math.min(20,session.wrong[w.id]||0),success:true}));
  const round={mode:'board',at:Date.now(),score:session.score,correct:words.filter(w=>!w.wrong).length,total:words.length,seconds:Math.min(86400,Math.round(session.finalMs/1000)),elapsedMs:Math.min(86400000,Math.round(session.finalMs)),boardSize:session.board.size,mistakes:Math.min(100000,session.board.mistakes),words};
  s.games=V.record(s,session.id,round);s.boardDraft={id:session.id,at:Math.max(Date.now(),(s.boardDraft?.at||0)+1),ended:true};s.saved=[...new Set([...s.saved,...words.filter(w=>w.wrong).map(w=>w.id)])];const date=bridge.dayKey();s.activity[date]=(s.activity[date]||0)+words.length;bridge.save();
 }
 function finish(){if(!session||session.done||!E.complete(session.board))return;session.finalMs=elapsed();session.done=true;session.paused=false;clearClock();record();render(host);document.querySelector('[data-board-action="again"]')?.focus({preventScroll:true});}
 function best(){const results=Object.values(bridge.getState().games?.history||{}).filter(r=>r.mode==='board'&&r.boardSize===session.board.size&&r.elapsedMs!==undefined);return results.length?Math.min(...results.map(r=>r.elapsedMs)):null;}
 function overlays(){
  if(session.done){const recordTime=best(),newBest=recordTime!==null&&session.finalMs<=recordTime+1;return `<section class="board-win" role="status" aria-label="Chiến thắng, bảng đã sạch"><div class="board-win-card"><div class="board-confetti" aria-hidden="true">✦ <span>✳</span> ✦</div><div class="eyebrow">${newBest?'MỘT KỶ LỤC MỚI!':'HOÀN THÀNH THỬ THÁCH'}</div><h2>Sạch bảng rồi!</h2><p>Bạn đã tìm đủ ${session.board.words.length} cặp từ.<br>Không còn thẻ nào trên bảng.</p><div class="board-win-stats"><div><strong>${E.format(session.finalMs)}</strong><span>thời gian</span></div><div><strong>${session.board.mistakes}</strong><span>lượt ghép sai</span></div><div><strong>+${session.score}</strong><span>điểm</span></div></div><div class="board-win-actions"><button class="button button-primary" data-board-action="again">Chơi ván mới ${icon('reset')}</button><button class="button button-secondary" data-board-action="exit">Chọn bảng khác</button></div><small>Kết quả được ghi vào hồ sơ. Từ nhầm được lưu để ôn lại.</small></div></section>`;}
  if(session.paused)return `<section class="board-paused" aria-label="Ván chơi tạm dừng"><div><span aria-hidden="true">Ⅱ</span><h2>Nghỉ một chút nhé.</h2><p>Đồng hồ đã dừng, các thẻ đang được che lại.</p><button class="button button-primary" data-board-action="resume">Tiếp tục chơi ${icon('arrow')}</button></div></section>`;
  return '';
 }
 function render(target){
  if(!session)return;host=target;document.querySelector('#study-app')?.classList.add('board-focus');
  const b=session.board,n=b.size,total=b.cards.length,cleared=b.cleared.length*2,pending=b.pending;
  host.innerHTML=`<section class="pair-game" aria-label="Game tìm cặp Anh Việt ${n} nhân ${n}"><header class="board-header"><button class="text-link" data-board-action="exit">${icon('left')}Chọn trò chơi</button><div><span class="eyebrow">TRỘN THẺ · TÌM CẶP · DỌN SẠCH</span><h1>Dọn sạch bảng <span>${n}×${n}</span></h1></div><button class="button button-secondary board-pause-button" data-board-action="${session.paused?'resume':'pause'}" ${session.done?'disabled':''}>${session.paused?'Tiếp tục':'Ⅱ Tạm dừng'}</button></header><div class="board-hud"><div class="board-timer">${icon('clock')}<span id="board-time" aria-label="Thời gian đã chơi">${E.format(elapsed())}</span></div><div><strong id="board-cleared">${cleared}</strong><span>/${total} thẻ đã dọn</span></div><div><strong id="board-mistakes">${b.mistakes}</strong><span>lượt sai</span></div><div class="board-hud-score"><strong id="board-score">${session.score}</strong><span>điểm</span></div></div><div class="board-progress" aria-hidden="true"><span style="width:${cleared/total*100}%"></span></div><div class="board-canvas ${session.paused?'is-paused':''} ${session.done?'is-won':''}"><div class="mixed-board" style="--board-size:${n}" role="group" aria-label="${total} thẻ, tìm ${total/2} cặp"><div class="board-clean-decoration" aria-hidden="true"></div>${b.cards.map(card=>{const gone=b.cleared.includes(card.wordId),selected=b.selected===card.key,animating=pending?.keys.includes(card.key)?`board-${pending.kind}`:'';return `<button class="mixed-card ${card.lang==='en'?'card-en':'card-vi'} ${gone?'is-cleared':''} ${selected?'is-selected':''} ${animating}" data-board-card="${card.key}" data-word="${card.wordId}" data-lang="${card.lang}" aria-label="${card.lang==='en'?'Tiếng Anh':'Tiếng Việt'}: ${escape(card.text)}" aria-pressed="${selected}" ${gone?'disabled tabindex="-1" aria-hidden="true"':''} ${session.paused&&!gone?'disabled':''}><span class="card-language" aria-hidden="true">${card.lang==='en'?'EN':'VI'}</span><span class="card-text">${escape(card.text)}</span><span class="card-correct-mark" aria-hidden="true">✓</span></button>`;}).join('')}</div>${overlays()}</div><footer class="board-learning-bar"><div id="board-message" role="status" aria-live="polite">${session.done?'Bảng trống. Một ván chơi trọn vẹn!':escape(session.message)}</div><div class="board-last-word" id="board-last-word">${session.lastWord?`<button class="text-link" data-board-action="speak" data-word="${session.lastWord.id}">${icon('sound')}<strong>${escape(session.lastWord.word)}</strong><span>${escape(session.lastWord.meaning)}</span></button>`:'<span class="board-hint-keys">Chọn bằng chuột, hoặc Tab + Enter</span>'}</div></footer></section>`;
  runClock();
 }
 function applySelection(key){
  if(!session||session.done||session.paused)return;
  const response=E.select(session.board,key);if(response.kind==='ignored')return;session.board=response.board;
  if(response.kind==='selected'||response.kind==='deselected'){
   document.querySelectorAll('[data-board-card]').forEach(el=>{const selected=el.dataset.boardCard===session.board.selected;el.classList.toggle('is-selected',selected);el.setAttribute('aria-pressed',String(selected));});return;
  }
  const correct=response.kind==='correct',word=session.board.words.find(w=>w.id===response.first.wordId);
  if(correct){session.combo++;session.bestCombo=Math.max(session.bestCombo,session.combo);session.score+=V.points(!session.wrong[word.id],session.combo);session.lastWord=word;session.message=`Đúng rồi! ${word.word} — ${word.meaning}`;}
  else{session.combo=0;for(const wordId of new Set([response.first.wordId,response.second.wordId]))session.wrong[wordId]=(session.wrong[wordId]||0)+1;session.message=response.first.lang===response.second.lang?'Chưa đúng. Cần một thẻ EN và một thẻ VI nhé.':'Hai thẻ chưa cùng nghĩa. Thử cặp khác nhé!';}
  for(const cardKey of session.board.pending.keys)document.querySelector(`[data-board-card="${cardKey}"]`)?.classList.add(correct?'board-correct':'board-wrong');
  document.querySelector('#board-message').textContent=session.message;
  document.querySelector('#board-mistakes').textContent=session.board.mistakes;
  document.querySelector('#board-score').textContent=session.score;
  if(correct)bridge.review(word.id,!session.wrong[word.id]);else for(const wordId of new Set([response.first.wordId,response.second.wordId]))bridge.review(wordId,false);checkpoint();
  const token=session.id;animation=setTimeout(()=>{
   if(!session||session.id!==token)return;
   session.board=E.settle(session.board);animation=null;
   if(E.complete(session.board)){finish();return;}
   const activeKey=document.activeElement?.getAttribute('data-board-card');render(host);
   if(!session.paused){const next=activeKey?document.querySelector(`[data-board-card="${activeKey}"]:not(:disabled)`):null;(next||document.querySelector('[data-board-card]:not(:disabled)'))?.focus({preventScroll:true});}
  },correct?650:580);
 }
 function pause({paint=true}={}){if(!session||session.done||session.paused)return;session.carried=elapsed();session.paused=true;clearClock();checkpoint();if(paint&&isHere())render(host);}
 function resume(){if(!session||session.done||!session.paused)return;session.started=performance.now();session.paused=false;checkpoint();render(host);}
 function requestExit(){if(!session||session.done){reset();bridge.onExit();return;}pause();document.querySelector('#dialog-root').innerHTML=`<div class="overlay"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="game-leave-title"><h2 id="game-leave-title">Tạm cất ván chơi này?</h2><p>Ván này đã được giữ trong hồ sơ. Bạn có thể quay lại Chơi mà nhớ và bấm Tiếp tục ván đang lưu.</p><div class="dialog-actions"><button class="button button-secondary" data-game="stay" data-board-action="stay">Ở lại ván này</button><button class="button button-primary" data-board-action="confirm-exit">Lưu và rời ván</button></div></section></div>`;document.querySelector('[data-board-action="stay"]')?.focus();}
 document.addEventListener('click',e=>{
  const card=e.target.closest('[data-board-card]');if(card&&isHere()){applySelection(card.dataset.boardCard);return;}
  const button=e.target.closest('[data-board-action]');if(!button||!isHere())return;
  const action=button.dataset.boardAction;
  if(action==='pause')pause();if(action==='resume')resume();if(action==='exit')requestExit();
  if(action==='stay'){document.querySelector('#dialog-root').innerHTML='';resume();}
  if(action==='confirm-exit'){document.querySelector('#dialog-root').innerHTML='';reset();bridge.onExit();}
  if(action==='again'){const {size,topic}=session.board;start(host,{size,topic});}
  if(action==='speak')bridge.speak(button.dataset.word);
 });
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')pause({paint:false});else if(session&&isHere())render(host);});
 window.BoardMatch={init(callbacks){bridge=callbacks;},start,resumeSaved,checkpoint,render,identity,reset,isActive:()=>!!session,suspend(){pause({paint:false});unfocus();}};
})();
