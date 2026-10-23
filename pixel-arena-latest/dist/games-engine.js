(function(root){
 const normalize=value=>String(value).normalize('NFKC').trim().toLowerCase().replace(/[‐‑–—]/g,'-').replace(/\s+/g,' ');
 function rng(seed){let n=seed>>>0;return()=>{n+=0x6D2B79F5;let t=Math.imul(n^n>>>15,n|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
 function shuffle(items,random=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
 function gap(word){const escaped=word.word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const re=new RegExp('(?<![a-z])'+escaped+'(?![a-z])','i');return re.test(word.example)?word.example.replace(re,'________'):null;}
 function history(state){return Object.entries(state.games?.history||{}).sort((a,b)=>a[1].at-b[1].at);}
 function reviewIds(state){const due=new Map();for(const [,round] of history(state))for(const word of round.words){if(word.wrong>0||!word.success)due.set(word.id,round.at);else due.delete(word.id);}return [...due.entries()].sort((a,b)=>a[1]-b[1]).map(x=>x[0]);}
 function deck(words,state,{mode='match',topic='all',review=false,seed=Date.now()}={}){
  const random=rng(seed),due=new Set([...reviewIds(state),...(root.VocabularyReview?.due(state)||[])]),saved=new Set(state.saved||[]),known=new Set(state.known||[]);
  let pool=words.filter(w=>(topic==='all'||w.lesson===Number(topic))&&(mode!=='spell'||gap(w)));
  if(review&&pool.some(w=>due.has(w.id)))pool=pool.filter(w=>due.has(w.id));
  const rank=w=>due.has(w.id)?0:saved.has(w.id)?1:!known.has(w.id)?2:3;
  return shuffle(pool,random).sort((a,b)=>rank(a)-rank(b)).slice(0,{match:6,sprint:10,spell:8,listen:10,robot:10,boss:12}[mode]||6);
 }
 function choices(word,words,seed,{difficulty=1}={}){const random=rng(seed),seen=new Set([word.meaning]),others=[];const rank=w=>difficulty>=3?(w.lesson===word.lesson&&w.pos===word.pos?0:w.pos===word.pos?1:w.lesson===word.lesson?2:3):difficulty===2?(w.lesson===word.lesson?0:1):0;for(const candidate of shuffle(words.filter(w=>w.id!==word.id),random).sort((a,b)=>rank(a)-rank(b))){if(!seen.has(candidate.meaning)){seen.add(candidate.meaning);others.push(candidate);}if(others.length===3)break;}return shuffle([word,...others],random);}
 function points(clean,combo=1){return (clean?100:50)+(clean?Math.min(3,Math.max(0,combo-1))*10:0);}
 function record(state,id,round){const result={...(state.games||{}),history:{...(state.games?.history||{}),[id]:round}};result.history=Object.fromEntries(Object.entries(result.history).sort((a,b)=>b[1].at-a[1].at||a[0].localeCompare(b[0])).slice(0,100));return result;}
 const api={normalize,rng,shuffle,gap,history,reviewIds,deck,choices,points,record};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VocabularyGames=api;
})(typeof window!=='undefined'?window:globalThis);
