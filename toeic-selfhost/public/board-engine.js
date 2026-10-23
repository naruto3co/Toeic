(function(root){
 const E=root.VocabularyGames;
 function create(words,progress,{size=8,topic='all',seed=Date.now()}={}){
  if(![4,6,8].includes(size))throw new Error('Chọn bảng 4×4, 6×6 hoặc 8×8.');
  const count=size*size/2,random=E.rng(seed),due=new Set(E.reviewIds(progress)),saved=new Set(progress.saved||[]),known=new Set(progress.known||[]);
  const rank=w=>(topic!=='all'&&w.lesson===Number(topic)?-10:0)+(due.has(w.id)?0:saved.has(w.id)?1:!known.has(w.id)?2:3);
  const candidates=E.shuffle(words,random).sort((a,b)=>rank(a)-rank(b)),chosen=[],terms=new Set(),meanings=new Set();
  for(const w of candidates){if(terms.has(E.normalize(w.word))||meanings.has(E.normalize(w.meaning)))continue;terms.add(E.normalize(w.word));meanings.add(E.normalize(w.meaning));chosen.push(w);if(chosen.length===count)break;}
  if(chosen.length!==count)throw new Error('Chưa đủ từ để tạo bảng này.');
  const cards=E.shuffle(chosen.flatMap(w=>[{key:w.id+'-en',wordId:w.id,lang:'en',text:w.word},{key:w.id+'-vi',wordId:w.id,lang:'vi',text:w.meaning}]),random);
  return {size,seed,topic,words:chosen,cards,selected:null,pending:null,cleared:[],mistakes:0,moves:0};
 }
 function paired(a,b){return !!a&&!!b&&a.key!==b.key&&a.lang!==b.lang&&a.wordId===b.wordId;}
 function select(board,key){
  const card=board.cards.find(c=>c.key===key);
  if(!card||board.pending||board.cleared.includes(card.wordId))return {board,kind:'ignored'};
  if(board.selected===key)return {board:{...board,selected:null},kind:'deselected'};
  if(!board.selected)return {board:{...board,selected:key},kind:'selected'};
  const first=board.cards.find(c=>c.key===board.selected),correct=paired(first,card);
  return {board:{...board,moves:board.moves+1,mistakes:board.mistakes+(correct?0:1),pending:{kind:correct?'correct':'wrong',keys:[first.key,card.key]}},kind:correct?'correct':'wrong',first,second:card};
 }
 function settle(board){if(!board.pending)return board;const first=board.cards.find(c=>c.key===board.pending.keys[0]);return {...board,cleared:board.pending.kind==='correct'?[...board.cleared,first.wordId]:board.cleared,selected:null,pending:null};}
 const complete=board=>!board.pending&&board.cleared.length===board.words.length;
 const format=ms=>{const tenths=Math.floor(Math.max(0,ms)/100);return String(Math.floor(tenths/600)).padStart(2,'0')+':'+String(Math.floor(tenths/10)%60).padStart(2,'0')+'.'+tenths%10;};
 root.PairBoardEngine={create,paired,select,settle,complete,format};
})(typeof window!=='undefined'?window:globalThis);
