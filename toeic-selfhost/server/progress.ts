import '../public/battle-engine.js';
const battleRules=(globalThis as unknown as {WordBattles:{validDraft:(d:unknown)=>boolean}}).WordBattles;
export type GameRound = {mode: 'match'|'sprint'|'spell'|'listen'|'board'|'robot'|'boss'; won?:boolean;stage?:number; elapsedMs?: number; boardSize?: number; mistakes?: number; at: number; score: number; correct: number; total: number; seconds: number; words: {id: string; wrong: number; success: boolean}[]};
export type ReviewRow = {reviewedAt:number;dueAt:number;streak:number;lapses:number};
export type BoardDraft = {id:string;at:number;ended:true} | {id:string;at:number;ended:false;size:number;seed:number;topic:string;wordIds:string[];order:string[];cleared:string[];wrong:Record<string,number>;score:number;combo:number;bestCombo:number;elapsedMs:number;moves:number;mistakes:number};
export type Progress = {
  reviews: Record<string,ReviewRow>; boardDraft: BoardDraft|null; battleDrafts: {robot:Record<string,unknown>|null;boss:Record<string,unknown>|null};
  known: string[]; saved: string[]; games: {history: Record<string,GameRound>};
  seen: Record<string, { ids: string[]; last: number }>;
  scores: Record<string, { best: number; last: number; attempts: number; date: string }>;
  activity: Record<string, number>; lastLesson: number;
  quiz: { lesson: number; seed: number; answers: number[] } | null;
};
export const emptyProgress = (): Progress => ({known:[],saved:[],seen:{},scores:{},activity:{},lastLesson:1,quiz:null,games:{history:{}},reviews:{},boardDraft:null,battleDrafts:{robot:null,boss:null}});
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const integer = (v: unknown, min: number, max: number): v is number => typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
const validWord = (v: unknown): v is string => typeof v === 'string' && /^(?:[1-9]|[1-4][0-9]|50)-(?:[0-9]|1[01])$/.test(v);
const validDate = (v: unknown): v is string => typeof v === 'string' && /^20\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/.test(v);
export function normalizeAccount(value: unknown): string {
  if(typeof value !== 'string') throw new Error('Nhập tên tài khoản của bạn.');
  const account=value.trim().toLowerCase();
  if(!/^[a-z0-9][a-z0-9_.-]{2,31}$/.test(account)) throw new Error('Dùng 3–32 ký tự: chữ không dấu, số, dấu chấm, gạch dưới hoặc gạch ngang.');
  return account;
}
export function validateProgress(value: unknown): Progress {
  if(!object(value)) throw new Error('Tiến độ không hợp lệ.');
  const result=emptyProgress();
  for(const key of ['known','saved'] as const){
    const list=value[key]; if(!Array.isArray(list)||list.length>600||!list.every(validWord)) throw new Error('Danh sách từ không hợp lệ.');
    result[key]=[...new Set(list)];
  }
  if(!integer(value.lastLesson,1,50)) throw new Error('Bài học không hợp lệ.');result.lastLesson=value.lastLesson;
  for(const key of ['seen','scores','activity'] as const)if(!object(value[key]))throw new Error('Dữ liệu tiến độ không hợp lệ.');
  const seen=value.seen as Record<string,unknown>;if(Object.keys(seen).length>50)throw new Error('Quá nhiều bài học.');
  for(const [id,row] of Object.entries(seen)){
    if(!/^(?:[1-9]|[1-4][0-9]|50)$/.test(id)||!object(row)||!Array.isArray(row.ids)||row.ids.length>50||!row.ids.every(validWord)||!integer(row.last,0,49))throw new Error('Thẻ đã học không hợp lệ.');
    result.seen[id]={ids:[...new Set(row.ids)],last:row.last};
  }
  const scores=value.scores as Record<string,unknown>;if(Object.keys(scores).length>50)throw new Error('Quá nhiều điểm số.');
  for(const [id,row] of Object.entries(scores)){
    if(!/^(?:[1-9]|[1-4][0-9]|50)$/.test(id)||!object(row)||!integer(row.best,0,30)||!integer(row.last,0,30)||!integer(row.attempts,1,1000000)||!validDate(row.date))throw new Error('Điểm kiểm tra không hợp lệ.');
    result.scores[id]={best:row.best,last:row.last,attempts:row.attempts,date:row.date};
  }
  const activity=value.activity as Record<string,unknown>;if(Object.keys(activity).length>3660)throw new Error('Quá nhiều ngày hoạt động.');
  for(const [date,count] of Object.entries(activity)){
    if(!validDate(date)||!integer(count,0,1000000))throw new Error('Lịch sử hoạt động không hợp lệ.');result.activity[date]=count;
  }
  if(value.quiz!==null){
    const q=value.quiz;if(!object(q)||!integer(q.lesson,1,50)||!integer(q.seed,0,4294967295)||!Array.isArray(q.answers)||q.answers.length>30||!q.answers.every(a=>integer(a,0,3)))throw new Error('Bài kiểm tra đang làm không hợp lệ.');
    result.quiz={lesson:q.lesson,seed:q.seed,answers:q.answers};
  }
  if(value.games!==undefined){
    const games=value.games;
    if(!object(games)||!object(games.history)||Object.keys(games.history).length>100)throw new Error('Lịch sử trò chơi không hợp lệ.');
    for(const [id,row] of Object.entries(games.history)){
      if(!/^[a-zA-Z0-9-]{8,80}$/.test(id)||!object(row)||!['match','sprint','spell','listen','board','robot','boss'].includes(String(row.mode))||!integer(row.at,0,4102444800000)||!integer(row.score,0,10000)||!integer(row.correct,0,row.mode==='board'?32:12)||!integer(row.total,1,row.mode==='board'?32:12)||row.correct>row.total||!integer(row.seconds,0,86400)||!Array.isArray(row.words)||row.words.length!==row.total)throw new Error('Kết quả trò chơi không hợp lệ.');
      const words: GameRound['words']=[];
      for(const w of row.words){if(!object(w)||!validWord(w.id)||!integer(w.wrong,0,20)||typeof w.success!=='boolean')throw new Error('Từ trong trò chơi không hợp lệ.');words.push({id:w.id,wrong:w.wrong,success:w.success});}
      if(new Set(words.map(w=>w.id)).size!==words.length)throw new Error('Từ trong trò chơi bị trùng.');
      result.games.history[id]={mode:row.mode as GameRound['mode'],at:row.at,score:row.score,correct:row.correct,total:row.total,seconds:row.seconds,words};
      if(row.mode==='robot'||row.mode==='boss'){if(typeof row.won!=='boolean'||!integer(row.stage,1,row.mode==='robot'?5:3))throw new Error('Kết quả chiến dịch không hợp lệ.');Object.assign(result.games.history[id],{won:row.won,stage:row.stage});}
      if(row.mode==='board'){
        if(!integer(row.elapsedMs,0,86400000)||!integer(row.mistakes,0,100000)||!integer(row.boardSize,4,8)||![4,6,8].includes(row.boardSize)||row.boardSize*row.boardSize!==row.total*2)throw new Error('Kích thước hoặc thời gian bảng không hợp lệ.');
        Object.assign(result.games.history[id],{elapsedMs:row.elapsedMs,boardSize:row.boardSize,mistakes:row.mistakes});
      }
    }
  }
  if(value.reviews!==undefined){
    if(!object(value.reviews)||Object.keys(value.reviews).length>600)throw new Error('Lịch ôn không hợp lệ.');
    for(const [id,row] of Object.entries(value.reviews)){
      if(!validWord(id)||!object(row)||!integer(row.reviewedAt,0,4102444800000)||!integer(row.dueAt,row.reviewedAt,4102444800000)||!integer(row.streak,0,1000)||!integer(row.lapses,0,100000))throw new Error('Mốc ôn từ không hợp lệ.');
      result.reviews[id]={reviewedAt:row.reviewedAt,dueAt:row.dueAt,streak:row.streak,lapses:row.lapses};
    }
  }
  if(value.boardDraft!==undefined&&value.boardDraft!==null){
    const d=value.boardDraft;
    if(!object(d)||typeof d.id!=='string'||!/^[a-zA-Z0-9-]{8,80}$/.test(d.id)||!integer(d.at,0,4102444800000)||typeof d.ended!=='boolean')throw new Error('Ván đang lưu không hợp lệ.');
    if(d.ended)result.boardDraft={id:d.id,at:d.at,ended:true};
    else{
      if(!integer(d.size,4,8)||![4,6,8].includes(d.size)||!integer(d.seed,0,4294967295)||typeof d.topic!=='string'||!(d.topic==='all'||/^(?:[1-9]|[1-4][0-9]|50)$/.test(d.topic)))throw new Error('Cấu hình ván lưu không hợp lệ.');
      const pairs=d.size*d.size/2;
      if(!Array.isArray(d.wordIds)||d.wordIds.length!==pairs||!d.wordIds.every(validWord)||new Set(d.wordIds).size!==pairs)throw new Error('Bộ từ ván lưu không hợp lệ.');
      const ids=d.wordIds as string[],keys=new Set(ids.flatMap(id=>[id+'-en',id+'-vi']));
      if(!Array.isArray(d.order)||d.order.length!==pairs*2||new Set(d.order).size!==pairs*2||!d.order.every(key=>typeof key==='string'&&keys.has(key)))throw new Error('Vị trí thẻ đã lưu không hợp lệ.');
      if(!Array.isArray(d.cleared)||d.cleared.length>pairs||new Set(d.cleared).size!==d.cleared.length||!d.cleared.every(id=>ids.includes(String(id))))throw new Error('Thẻ đã dọn không hợp lệ.');
      if(!object(d.wrong)||Object.keys(d.wrong).length>pairs||!Object.entries(d.wrong).every(([id,count])=>ids.includes(id)&&integer(count,0,100000)))throw new Error('Lượt sai đã lưu không hợp lệ.');
      if(!integer(d.score,0,10000)||!integer(d.combo,0,pairs)||!integer(d.bestCombo,d.combo,pairs)||!integer(d.elapsedMs,0,86400000)||!integer(d.moves,0,100000)||!integer(d.mistakes,0,d.moves))throw new Error('Điểm hoặc thời gian đã lưu không hợp lệ.');
      result.boardDraft={id:d.id,at:d.at,ended:false,size:d.size,seed:d.seed,topic:d.topic,wordIds:ids,order:d.order as string[],cleared:d.cleared as string[],wrong:d.wrong as Record<string,number>,score:d.score,combo:d.combo,bestCombo:d.bestCombo,elapsedMs:d.elapsedMs,moves:d.moves,mistakes:d.mistakes};
    }
  }
  if(value.battleDrafts!==undefined){
    if(!object(value.battleDrafts)||Object.keys(value.battleDrafts).some(k=>!['robot','boss'].includes(k)))throw new Error('Ván chiến thuật không hợp lệ.');
    for(const mode of ['robot','boss'] as const){const draft=value.battleDrafts[mode];if(draft===null||draft===undefined)continue;if(!object(draft)||draft.mode!==mode||!battleRules.validDraft(draft))throw new Error('Ván chiến thuật đang lưu không hợp lệ.');result.battleDrafts[mode]=JSON.parse(JSON.stringify(draft));}
  }
  return result;
}
export async function readProfileRequest(request: Request): Promise<Record<string,unknown>> {
  const origin=request.headers.get('origin');
  if(origin && origin!==new URL(request.url).origin)throw new Error('Nguồn yêu cầu không hợp lệ.');
  if(Number(request.headers.get('content-length')||0)>524288)throw new Error('Dữ liệu quá lớn.');
  const text=await request.text();if(text.length>524288)throw new Error('Dữ liệu quá lớn.');
  const body=JSON.parse(text);if(!object(body))throw new Error('Yêu cầu không hợp lệ.');return body;
}
export function json(body: unknown, status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
