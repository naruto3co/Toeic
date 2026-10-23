/* Three-way reconciliation keeps changes from separate devices. */
(function(root){
 const clone=x=>JSON.parse(JSON.stringify(x));
 const same=(a,b)=>{
  if(a===b)return true;
  if(a===null||b===null||typeof a!=='object'||typeof b!=='object')return false;
  if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((value,i)=>same(value,b[i]));
  const keys=Object.keys(a),other=Object.keys(b);
  return keys.length===other.length&&keys.every(key=>Object.prototype.hasOwnProperty.call(b,key)&&same(a[key],b[key]));
 };
 const mergeSet=(base,local,remote)=>{
  const before=new Set(base||[]),after=new Set(local||[]),out=new Set(remote||[]);
  for(const item of before)if(!after.has(item))out.delete(item);
  for(const item of after)if(!before.has(item))out.add(item);
  return [...out];
 };
 function merge(base,local,remote){
  const out=clone(remote);
  out.known=mergeSet(base.known,local.known,remote.known);
  out.saved=mergeSet(base.saved,local.saved,remote.saved);
  for(const [id,row] of Object.entries(local.seen||{})){
   const prior=base.seen?.[id],there=remote.seen?.[id];
   out.seen[id]={ids:[...new Set([...(there?.ids||[]),...row.ids])],last:!prior||row.last!==prior.last?row.last:(there?.last||0)};
  }
  for(const [id,row] of Object.entries(local.scores||{})){
   const prior=base.scores?.[id],there=remote.scores?.[id];
   const added=Math.max(0,row.attempts-(prior?.attempts||0));
   out.scores[id]={...(added?row:(there||row)),best:Math.max(row.best,there?.best||0),attempts:(there?.attempts||0)+added};
  }
  for(const [date,count] of Object.entries(local.activity||{}))out.activity[date]=(remote.activity?.[date]||0)+Math.max(0,count-(base.activity?.[date]||0));
  if(local.lastLesson!==base.lastLesson)out.lastLesson=local.lastLesson;
  if(!same(local.quiz,base.quiz))out.quiz=clone(local.quiz);
  const rounds={...(remote.games?.history||{}),...(local.games?.history||{})};
  out.games={history:Object.fromEntries(Object.entries(rounds).sort((a,b)=>b[1].at-a[1].at||a[0].localeCompare(b[0])).slice(0,100))};
  out.reviews={...(remote.reviews||{})};
  for(const [id,entry] of Object.entries(local.reviews||{})){
   if(same(entry,base.reviews?.[id]))continue;
   const there=out.reviews[id];if(!there||entry.reviewedAt>there.reviewedAt||(entry.reviewedAt===there.reviewedAt&&JSON.stringify(entry)>JSON.stringify(there)))out.reviews[id]=clone(entry);
  }
  for(const id of Object.keys(base.reviews||{}))if(local.reviews&&!Object.hasOwn(local.reviews,id))delete out.reviews[id];
  out.boardDraft=remote.boardDraft||null;
  if(Object.hasOwn(local,'boardDraft')&&!same(local.boardDraft,base.boardDraft||null)){
   const here=local.boardDraft,there=out.boardDraft;
   if(!here)out.boardDraft=null;
   else if(!there||here.at>there.at||(here.at===there.at&&here.id>=there.id))out.boardDraft=clone(here);
  }
  if(out.boardDraft&&!out.boardDraft.ended&&out.games.history[out.boardDraft.id])out.boardDraft={id:out.boardDraft.id,at:Math.max(out.boardDraft.at,out.games.history[out.boardDraft.id].at),ended:true};
  out.battleDrafts={robot:remote.battleDrafts?.robot||null,boss:remote.battleDrafts?.boss||null};
  for(const mode of ['robot','boss']){
   if(local.battleDrafts&&Object.hasOwn(local.battleDrafts,mode)&&!same(local.battleDrafts[mode],base.battleDrafts?.[mode]||null)){
    const here=local.battleDrafts[mode],there=out.battleDrafts[mode];
    if(!here)out.battleDrafts[mode]=null;else if(!there||here.at>there.at||(here.at===there.at&&here.id>=there.id))out.battleDrafts[mode]=clone(here);
   }
   const d=out.battleDrafts[mode];if(d&&!d.ended&&out.games.history[d.id])out.battleDrafts[mode]={id:d.id,mode,at:Math.max(d.at,out.games.history[d.id].at),ended:true};
  }
  return out;
 }
 const api={merge,clone,same};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 else root.ProfileSync=api;
})(typeof window!=='undefined'?window:globalThis);
