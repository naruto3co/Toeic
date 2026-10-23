(function(root){
 'use strict';
 const E=root.PairBoardEngine;
 function pack(session,elapsedMs,at=Date.now()){
  const b=E.settle(session.board);
  return {id:session.id,at,ended:false,size:b.size,seed:b.seed,topic:b.topic,wordIds:b.words.map(w=>w.id),order:b.cards.map(c=>c.key),cleared:[...b.cleared],wrong:{...session.wrong},score:session.score,combo:session.combo,bestCombo:session.bestCombo,elapsedMs:Math.min(86400000,Math.max(0,Math.round(elapsedMs))),moves:b.moves,mistakes:b.mistakes};
 }
 function restore(draft,words){
  if(!draft||draft.ended)return null;
  const map=new Map(words.map(w=>[w.id,w])),chosen=draft.wordIds.map(id=>map.get(id));if(chosen.some(w=>!w))return null;
  const cards=new Map(chosen.flatMap(w=>[{key:w.id+'-en',wordId:w.id,lang:'en',text:w.word},{key:w.id+'-vi',wordId:w.id,lang:'vi',text:w.meaning}]).map(c=>[c.key,c]));
  if(draft.order.length!==draft.size*draft.size||new Set(draft.order).size!==draft.order.length||draft.order.some(key=>!cards.has(key)))return null;
  return {id:draft.id,board:{size:draft.size,seed:draft.seed,topic:draft.topic,words:chosen,cards:draft.order.map(key=>cards.get(key)),cleared:[...draft.cleared],selected:null,pending:null,moves:draft.moves,mistakes:draft.mistakes},wrong:{...draft.wrong},score:draft.score,combo:draft.combo,bestCombo:draft.bestCombo,carried:draft.elapsedMs,started:0,paused:true,done:false,saved:false,finalMs:0,lastWord:null,message:'Đã khôi phục ván đang chơi. Bấm Tiếp tục để chạy đồng hồ.'};
 }
 function available(state){const d=state.boardDraft;return !!d&&!d.ended&&!state.games?.history?.[d.id];}
 const api={pack,restore,available};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BoardCheckpoint=api;
})(typeof window!=='undefined'?window:globalThis);
