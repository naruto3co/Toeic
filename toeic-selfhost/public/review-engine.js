(function(root){
 'use strict';
 const DAY=86400000,STEPS=[1,3,7,14,30,60];
 function enrolled(state){const ids=new Set([...(state.known||[]),...(state.saved||[]),...Object.keys(state.reviews||{})]);for(const row of Object.values(state.seen||{}))for(const id of row.ids||[])ids.add(id);for(const round of Object.values(state.games?.history||{}))for(const w of round.words||[])ids.add(w.id);return [...ids];}
 function row(state,id){return state.reviews?.[id]||{reviewedAt:0,dueAt:0,streak:0,lapses:0};}
 function due(state,now=Date.now()){return enrolled(state).filter(id=>row(state,id).dueAt<=now).sort((a,b)=>row(state,b).lapses-row(state,a).lapses||row(state,a).dueAt-row(state,b).dueAt||a.localeCompare(b));}
 function answer(state,id,correct,now=Date.now()){
  const before=row(state,id),at=Math.max(now,before.reviewedAt+1),streak=correct?Math.min(1000,before.streak+1):0;
  const next={reviewedAt:at,dueAt:at+(correct?STEPS[Math.min(streak-1,STEPS.length-1)]*DAY:10*60000),streak,lapses:Math.min(100000,before.lapses+(correct?0:1))};
  state.reviews={...(state.reviews||{}),[id]:next};return next;
 }
 function upcoming(state,now=Date.now()){return enrolled(state).filter(id=>row(state,id).dueAt>now).sort((a,b)=>row(state,a).dueAt-row(state,b).dueAt);}
 const api={DAY,STEPS,enrolled,row,due,answer,upcoming};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VocabularyReview=api;
})(typeof window!=='undefined'?window:globalThis);
