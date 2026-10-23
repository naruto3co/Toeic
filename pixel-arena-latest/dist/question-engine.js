/* Question formats shared by the expedition and both tactical games. */
(function(root){
 'use strict';
 const normalize=s=>String(s??'').normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/[‐‑–—-]/g,' ').replace(/\s+/g,' ');
 function make(w,words,seed,tier='normal'){
  const level=typeof tier==='number'?tier:({normal:1,hard:2,nightmare:3}[tier]||1);
  if(level===3){const sentence=VocabularyGames.gap(w);return {kind:'cloze',title:w.meaning,sentence:sentence||'________',hint:sentence?w.translation:'Viết từ hoặc cụm từ tiếng Anh tương ứng.',options:[],answer:w.word};}
  const options=VocabularyGames.choices(w,words,seed,{difficulty:level}).map(o=>({id:o.id,label:level===2?o.word:o.meaning}));
  return {kind:level===2?'reverse':'meaning',title:level===2?w.meaning:w.word,hint:level===2?'Chọn từ tiếng Anh tương ứng.':'Chọn nghĩa tiếng Việt tương ứng.',options,answer:w.id};
 }
 const grade=(q,value)=>q.kind==='cloze'?normalize(value)!==''&&normalize(value)===normalize(q.answer):String(value)===q.answer;
 root.WordQuestions={make,grade,normalize};
})(typeof window!=='undefined'?window:globalThis);
