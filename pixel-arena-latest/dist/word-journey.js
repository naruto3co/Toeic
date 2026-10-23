/* Personal word difficulty. Ordinary solved prompts stay retired; repeatedly
   missed words need three consecutive successful recalls before retirement. */
(function(root){
 'use strict';
 const count=n=>Number.isFinite(n)?Math.max(0,Math.min(100000,Math.floor(n))):0;
 const empty=()=>({attempts:0,wrong:0,streak:0,lastAt:0});
 function init(state,ids){
  const valid=new Set(ids);if(state.journey?.version===2)return state.journey;
  const previous=state.journey||{},mastered=new Set([...(state.known||[]),...(previous.mastered||[])]),missed=new Set(previous.missed||[]),introduced=new Set(previous.introduced||[]),items={};
  const rowsById={};
  for(const round of [...Object.values(state.games?.history||{}),...Object.values(state.battleDrafts||{})]){
   const rows=round?.words||Object.entries(round?.results||{}).map(([id,r])=>({id,...r}));
   for(const r of rows){if(!valid.has(r.id))continue;const item=rowsById[r.id]??=empty();item.wrong+=count(r.wrong);item.attempts+=count(r.wrong)+(r.success?1:0);if(r.success){mastered.add(r.id);item.streak=1;}else if(r.wrong)missed.add(r.id);introduced.add(r.id);}
  }
  for(const id of new Set([...introduced,...Object.keys(rowsById),...Object.keys(state.reviews||{})])){
   if(!valid.has(id))continue;const old=rowsById[id]||empty(),review=state.reviews?.[id];
   const wrong=Math.max(old.wrong,count(review?.lapses)),streak=review?count(review.streak):old.streak;
   items[id]={attempts:Math.max(old.attempts,wrong+streak,1),wrong,streak:Math.min(3,streak),lastAt:Number.isFinite(review?.reviewedAt)?review.reviewedAt:0};
   if(streak>0)mastered.add(id);else if(wrong)missed.add(id);
   if(wrong>=2&&streak<3){mastered.delete(id);missed.add(id);}introduced.add(id);
  }
  state.journey={version:2,mastered:[...mastered].filter(id=>valid.has(id)),missed:[...missed].filter(id=>valid.has(id)&&!mastered.has(id)),introduced:[...introduced].filter(id=>valid.has(id)),items};return state.journey;
 }
 function status(state,id){const j=state.journey,r=j.items?.[id]||empty(),mastered=j.mastered.includes(id);return {...r,mastered,hard:r.wrong>=2&&!mastered,needsReview:r.wrong>0&&!mastered};}
 function answer(state,id,correct,at=Date.now()){
  const j=state.journey,old=j.items[id]||empty(),r={attempts:count(old.attempts+1),wrong:count(old.wrong+(correct?0:1)),streak:correct?Math.min(3,old.streak+1):0,lastAt:at};j.items[id]=r;
  if(!j.introduced.includes(id))j.introduced.push(id);
  const mastered=correct&&(r.wrong<2||r.streak>=3);
  if(mastered){if(!j.mastered.includes(id))j.mastered.push(id);j.missed=j.missed.filter(x=>x!==id);}
  else{j.mastered=j.mastered.filter(x=>x!==id);if(!j.missed.includes(id))j.missed.push(id);}
  return j;
 }
 function hardWords(state){return Object.keys(state.journey.items||{}).map(id=>({id,...status(state,id)})).filter(r=>r.hard).sort((a,b)=>b.wrong-a.wrong||a.streak-b.streak||a.lastAt-b.lastAt||a.id.localeCompare(b.id));}
 function pool(state,ids,seed){
  const j=init(state,ids),done=new Set(j.mastered),missed=new Set(j.missed),random=VocabularyGames.rng(seed);
  const fresh=VocabularyGames.shuffle(ids.filter(id=>!done.has(id)&&!missed.has(id)),random);
  const retry=VocabularyGames.shuffle(ids.filter(id=>!done.has(id)&&missed.has(id)),random).sort((a,b)=>status(state,b).wrong-status(state,a).wrong),out=[];
  while(fresh.length||retry.length){for(let i=0;i<4&&fresh.length;i++)out.push(fresh.shift());if(retry.length)out.push(retry.shift());}return out;
 }
 root.WordJourney={init,answer,pool,status,hardWords};
})(typeof window!=='undefined'?window:globalThis);
