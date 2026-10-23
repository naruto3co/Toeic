/* Pure, deterministic rules shared by the UI, validation and tests. */
(function(root){
 'use strict';
 const ROBOTS=[
  {id:'aegis',name:'Aegis',role:'tank',art:0,hp:155,atk:15,color:'cyan'},
  {id:'volt',name:'Volt',role:'striker',art:1,hp:95,atk:29,color:'teal'},
  {id:'mender',name:'Mender',role:'support',art:2,hp:100,atk:13,color:'violet'},
  {id:'atlas',name:'Atlas',role:'tank',art:0,hp:135,atk:20,color:'gold'},
  {id:'nova',name:'Nova',role:'striker',art:1,hp:85,atk:34,color:'rose'},
  {id:'oracle',name:'Oracle',role:'support',art:2,hp:95,atk:18,color:'mint'}
 ];
 const SPELLS=[
  {id:'strike',name:'Kiếm ánh sáng',kind:'hit',cost:1,value:15,icon:'blade'},
  {id:'shield',name:'Khiên tinh thể',kind:'guard',cost:1,value:18,icon:'shield'},
  {id:'meteor',name:'Thiên thạch',kind:'hit',cost:2,value:32,icon:'fire'},
  {id:'heal',name:'Mạch sống',kind:'heal',cost:1,value:14,icon:'heal'},
  {id:'spark',name:'Tia chớp',kind:'spark',cost:1,value:10,icon:'bolt'},
  {id:'focus',name:'Tập trung',kind:'power',cost:1,value:4,icon:'rune'}
 ];
 const BOSSES=[{name:'Hộ Vệ Pha Lê',title:'Kẻ canh cổng ký ức',hp:76,armor:0},{name:'Bạo Chúa Tro Tàn',title:'Lớp giáp của sự lãng quên',hp:108,armor:2},{name:'Long Vương Nhật Thực',title:'Thử thách cuối cùng',hp:148,armor:1}];
 const clone=x=>JSON.parse(JSON.stringify(x));
 const bot=id=>ROBOTS.find(r=>r.id===id);
 const complete=s=>['won','lost'].includes(s.phase);
 const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
 function random(s){s.rng=(Math.imul(s.rng,1664525)+1013904223)>>>0;return s.rng/4294967296;}
 function shuffle(a,s){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random(s)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function create(mode,wordIds,{id='battle-'+Date.now().toString(36),seed=1,at=Date.now()}={}){
  if(!['robot','boss'].includes(mode))throw new Error('Chế độ chưa hợp lệ.');
  const count=mode==='robot'?10:12;if(wordIds.length!==count||new Set(wordIds).size!==count)throw new Error('Chưa đủ từ để bắt đầu.');
  const s={id,mode,at,ended:false,rng:seed>>>0,wordIds:[...wordIds],results:{},score:0,combo:0,elapsedMs:0,feedback:null};
  if(mode==='robot')Object.assign(s,{phase:'prep',wave:1,baseHp:20,coins:6,charged:0,energy:0,units:[],serial:0,shop:['aegis','volt','mender'],fight:null});
  else{Object.assign(s,{phase:'hand',stage:1,heroHp:85,block:0,mana:3,maxMana:3,strength:0,bossHp:BOSSES[0].hp,bossBlock:0,turn:1,hand:[],pile:[],discard:[],selected:null,relics:[]});s.pile=shuffle(Array.from({length:12},(_,i)=>i),s);draw(s,5);}
  return s;
 }
 function mark(s,id,correct){const old=s.results[id]||{wrong:0,success:false};s.results[id]={wrong:Math.min(20,old.wrong+(correct?0:1)),success:old.success||correct};s.combo=correct?s.combo+1:0;if(correct)s.score=Math.min(10000,s.score+100+Math.min(3,s.combo-1)*10);}
 function synergies(s){const count={tank:0,striker:0,support:0};for(const u of s.units||[])count[bot(u.type).role]++;return count;}
 function buy(s,type){if(s.mode!=='robot'||s.phase!=='prep'||s.coins<3||!s.shop.includes(type))return s;const n=clone(s),same=n.units.filter(u=>u.type===type&&u.star===1);if(n.units.length>=6&&same.length<2)return s;n.coins-=3;const pos=Array.from({length:6},(_,i)=>i).find(p=>!n.units.some(u=>u.pos===p))??same[0].pos;n.units.push({uid:'unit-'+(++n.serial),type,star:1,pos});
  for(let star=1;star<3;star++){const copies=n.units.filter(u=>u.type===type&&u.star===star);if(copies.length>=3){const keep=copies[0];n.units=n.units.filter(u=>!copies.slice(1,3).some(c=>c.uid===u.uid));keep.star++;}}
  return n;
 }
 function sell(s,uid){if(s.mode!=='robot'||s.phase!=='prep')return s;const u=s.units.find(u=>u.uid===uid);if(!u)return s;const n=clone(s);n.units=n.units.filter(x=>x.uid!==uid);n.coins+=u.star===1?2:u.star===2?7:20;return n;}
 function move(s,uid,pos){if(s.mode!=='robot'||s.phase!=='prep'||!integer(pos,0,5))return s;const n=clone(s),u=n.units.find(x=>x.uid===uid);if(!u)return s;const other=n.units.find(x=>x.pos===pos);if(other)other.pos=u.pos;u.pos=pos;return n;}
 function shop(s){if(s.mode!=='robot'||s.phase!=='prep'||s.coins<1)return s;const n=clone(s);n.coins--;n.shop=shuffle(ROBOTS.map(r=>r.id),n).slice(0,3);return n;}
 function question(s){return s.mode==='robot'?s.wordIds[(s.wave-1)*2+s.charged]:s.wordIds[s.selected];}
 function charge(s){if(s.mode!=='robot'||s.phase!=='prep'||s.charged>=2)return s;return {...clone(s),phase:'quiz'};}
 function robotAnswer(s,chosen){if(s.mode!=='robot'||s.phase!=='quiz')return s;const n=clone(s),id=question(s),correct=chosen===id;mark(n,id,correct);n.coins+=correct?4:1;n.energy+=correct?1:0;n.charged++;n.feedback={wordId:id,chosen,correct,effect:correct?'+4 đồng · sức mạnh chiến đấu +8%':'+1 đồng hỗ trợ · từ này sẽ quay lại sớm hơn'};n.phase='feedback';return n;}
 function fighters(s){const syn=synergies(s),list=s.units.map(u=>{const r=bot(u.type),scale=[0,1,1.9,3.5][u.star],maxHp=Math.round(r.hp*scale*(syn.tank>=2?1.25:1));return {uid:u.uid,type:u.type,star:u.star,pos:u.pos,side:'ally',maxHp,hp:maxHp,atk:Math.round(r.atk*scale*(syn.striker>=2?1.25:1)*(1+s.energy*.08))};});
  const count=Math.min(4,s.wave),types=['volt','aegis','nova','oracle'];for(let i=0;i<count;i++){const final=s.wave===5&&i===0,maxHp=final?235:65+s.wave*18;list.push({uid:'enemy-'+i,type:types[i],star:final?2:1,pos:i,side:'enemy',maxHp,hp:maxHp,atk:final?27:8+s.wave*3});}return list;
 }
 function fight(s){if(s.mode!=='robot'||s.phase!=='prep'||s.charged<2||!s.units.length)return s;const n=clone(s),initial=fighters(n),actors=clone(initial),events=[],syn=synergies(n);let cycle=0;
  while(actors.some(f=>f.side==='ally'&&f.hp>0)&&actors.some(f=>f.side==='enemy'&&f.hp>0)&&events.length<160){cycle++;
   for(const actor of actors){if(actor.hp<=0)continue;const foes=actors.filter(f=>f.side!==actor.side&&f.hp>0).sort((a,b)=>(a.pos<3?0:1)-(b.pos<3?0:1)||a.hp-b.hp);if(!foes.length)break;
    const target=foes[0],damage=Math.min(target.hp,Math.max(1,actor.atk+(cycle>7?15:0)));target.hp-=damage;events.push({actor:actor.uid,target:target.uid,amount:damage,kind:'hit'});
    if(actor.side==='ally'&&bot(actor.type).role==='support'){const friends=actors.filter(f=>f.side==='ally'&&f.hp>0&&f.hp<f.maxHp).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp);if(friends.length){const friend=friends[0],amount=Math.min(friend.maxHp-friend.hp,8*actor.star+(syn.support>=2?8:0));friend.hp+=amount;events.push({actor:actor.uid,target:friend.uid,amount,kind:'heal'});}}
    if(events.length>=160)break;
   }
  }
  const won=!actors.some(f=>f.side==='enemy'&&f.hp>0);n.fight={fighters:initial,events:events.slice(0,160),cursor:0,won};n.phase='fight';return n;
 }
 function frame(s){if(s.mode!=='robot'||s.phase!=='fight')return s;const n=clone(s);n.fight.cursor++;
  if(n.fight.cursor>=n.fight.events.length){if(n.fight.won){n.coins+=5;n.score=Math.min(10000,n.score+150);}else n.baseHp=Math.max(0,n.baseHp-3-n.wave);n.phase=n.baseHp<=0?'lost':n.wave===5?(n.fight.won?'won':'lost'):'report';}return n;
 }
 function board(s){if(!s.fight)return fighters(s);const units=clone(s.fight.fighters);for(const event of s.fight.events.slice(0,s.fight.cursor)){const target=units.find(u=>u.uid===event.target);if(target)target.hp=Math.max(0,Math.min(target.maxHp,target.hp+(event.kind==='heal'?event.amount:-event.amount)));}return units;}
 function nextWave(s){if(s.mode!=='robot'||s.phase!=='report')return s;const n=clone(s);n.wave++;n.charged=0;n.energy=0;n.fight=null;n.phase='prep';return n;}
 function draw(s,count){for(let i=0;i<count&&s.hand.length<7;i++){if(!s.pile.length){s.pile=shuffle(s.discard,s);s.discard=[];}if(!s.pile.length)break;s.hand.push(s.pile.shift());}}
 function spell(s,index){return SPELLS[index%SPELLS.length];}
 function select(s,index){if(s.mode!=='boss'||s.phase!=='hand'||!s.hand.includes(index)||spell(s,index).cost>s.mana)return s;const n=clone(s);n.selected=index;n.phase='quiz';return n;}
 function bossAnswer(s,chosen){if(s.mode!=='boss'||s.phase!=='quiz')return s;const n=clone(s),id=question(s),correct=chosen===id,card=spell(s,s.selected);mark(n,id,correct);n.mana-=card.cost;n.hand=n.hand.filter(i=>i!==s.selected);n.discard.push(s.selected);let effect='Phép chưa thành công · mất 4 máu';
  if(correct){
   if(['hit','spark'].includes(card.kind)){const raw=Math.max(1,card.value+n.strength+(n.combo>=2?3:0)-BOSSES[n.stage-1].armor),absorbed=Math.min(n.bossBlock,raw);n.bossBlock-=absorbed;n.bossHp=Math.max(0,n.bossHp-(raw-absorbed));effect=`Gây ${raw-absorbed} sát thương${absorbed?' · phá '+absorbed+' giáp':''}`;if(card.kind==='spark'){draw(n,1);effect+=' · rút thêm 1 thẻ';}}
   if(card.kind==='guard'){n.block+=card.value+n.strength;effect=`Tạo ${card.value+n.strength} giáp cho lượt này`;}
   if(card.kind==='heal'){const before=n.heroHp;n.heroHp=Math.min(85,n.heroHp+card.value);effect=`Hồi ${n.heroHp-before} máu`;}
   if(card.kind==='power'){n.strength=Math.min(100,n.strength+card.value);effect=`Sức mạnh phép +${card.value} cho cả chuyến đi`;}
   if(n.combo%3===0){n.mana=Math.min(5,n.mana+1);effect+=' · combo 3: +1 năng lượng';}
  }else n.heroHp=Math.max(0,n.heroHp-4);
  n.feedback={wordId:id,chosen,correct,effect};n.phase='feedback';return n;
 }
 function intent(s){const step=(s.turn-1)%3;if(s.stage===2&&step===2)return {kind:'heal',value:12,label:'Hồi 12 máu'};if(s.stage===3&&step===2)return {kind:'guard',value:18,label:'Tạo 18 giáp'};const value=[11,15,18][step]+(s.stage-1)*4+Math.max(0,s.turn-6)*3;return {kind:'hit',value,label:'Tấn công '+value};}
 function endTurn(s){if(s.mode!=='boss'||s.phase!=='hand')return s;const n=clone(s),action=intent(s);if(action.kind==='hit'){const absorbed=Math.min(n.block,action.value);n.heroHp=Math.max(0,n.heroHp-action.value+absorbed);}if(action.kind==='heal')n.bossHp=Math.min(BOSSES[n.stage-1].hp,n.bossHp+action.value);if(action.kind==='guard')n.bossBlock=Math.min(100,n.bossBlock+action.value);n.block=0;n.phase='counter';n.feedback={wordId:null,correct:false,effect:action.label};return n;}
 function advance(s){const n=clone(s);if(s.phase==='feedback'){
   n.feedback=null;if(s.mode==='robot'){n.phase='prep';return n;}n.selected=null;if(n.heroHp<=0)n.phase='lost';else if(n.bossHp<=0){n.score=Math.min(10000,n.score+200);n.phase=n.stage===3?'won':'camp';}else n.phase='hand';return n;
  }
  if(s.mode==='boss'&&s.phase==='counter'){n.feedback=null;n.turn++;if(n.heroHp<=0||n.turn>40){n.phase='lost';return n;}n.discard.push(...n.hand);n.hand=[];n.mana=n.maxMana;draw(n,5);n.phase='hand';}return n;
 }
 function relic(s,type){if(s.mode!=='boss'||s.phase!=='camp'||!['ember','battery','bloom'].includes(type))return s;const n=clone(s);n.relics.push(type);if(type==='ember')n.strength=Math.min(100,n.strength+5);if(type==='battery')n.maxMana=Math.min(5,n.maxMana+1);if(type==='bloom')n.heroHp=Math.min(85,n.heroHp+30);n.heroHp=Math.min(85,n.heroHp+12);n.stage++;n.bossHp=BOSSES[n.stage-1].hp;n.bossBlock=0;n.turn=1;n.block=0;n.selected=null;n.mana=n.maxMana;n.hand=[];n.discard=[];n.pile=shuffle(Array.from({length:12},(_,i)=>i),n);draw(n,5);n.phase='hand';return n;}
 function validDraft(d){
  if(!d||typeof d!=='object'||!['robot','boss'].includes(d.mode)||typeof d.id!=='string'||!/^[a-zA-Z0-9-]{8,80}$/.test(d.id)||!integer(d.at,0,4102444800000)||typeof d.ended!=='boolean')return false;
  if(d.ended)return Object.keys(d).every(k=>['id','at','ended','mode'].includes(k));
  if(JSON.stringify(d).length>60000||!integer(d.rng,0,4294967295)||!integer(d.score,0,10000)||!integer(d.combo,0,500)||!integer(d.elapsedMs,0,86400000)||!Array.isArray(d.wordIds)||d.wordIds.length!==(d.mode==='robot'?10:12)||new Set(d.wordIds).size!==d.wordIds.length||!d.wordIds.every(id=>typeof id==='string'&&/^(?:[1-9]|[1-4][0-9]|50)-(?:[0-9]|1[01])$/.test(id)))return false;
  if(!d.results||typeof d.results!=='object'||Array.isArray(d.results)||!Object.entries(d.results).every(([id,r])=>d.wordIds.includes(id)&&r&&integer(r.wrong,0,20)&&typeof r.success==='boolean'))return false;
  if(d.feedback!==null&&(!d.feedback||typeof d.feedback!=='object'||!(d.feedback.wordId===null||d.wordIds.includes(d.feedback.wordId))||typeof d.feedback.correct!=='boolean'||typeof d.feedback.effect!=='string'||d.feedback.effect.length>200))return false;
  if(d.mode==='robot'){
   if(!['prep','quiz','feedback','fight','report','won','lost'].includes(d.phase)||!integer(d.wave,1,5)||!integer(d.baseHp,0,20)||!integer(d.coins,0,500)||!integer(d.charged,0,2)||!integer(d.energy,0,2)||!integer(d.serial,0,10000)||!Array.isArray(d.units)||d.units.length>6||!Array.isArray(d.shop)||d.shop.length!==3||!d.shop.every(bot))return false;
   if(d.units.some(u=>!u||typeof u!=='object'))return false;
   if(new Set(d.units.map(u=>u.uid)).size!==d.units.length||new Set(d.units.map(u=>u.pos)).size!==d.units.length||!d.units.every(u=>u&&typeof u.uid==='string'&&/^unit-\d{1,5}$/.test(u.uid)&&bot(u.type)&&integer(u.star,1,3)&&integer(u.pos,0,5)))return false;
   if(d.fight!==null){const f=d.fight;if(!f||!Array.isArray(f.fighters)||f.fighters.length<2||f.fighters.length>10||f.fighters.some(x=>!x||typeof x!=='object')||new Set(f.fighters.map(x=>x.uid)).size!==f.fighters.length||!f.fighters.every(x=>x&&typeof x.uid==='string'&&/^(?:unit|enemy)-\d{1,5}$/.test(x.uid)&&bot(x.type)&&['ally','enemy'].includes(x.side)&&integer(x.star,1,3)&&integer(x.pos,0,5)&&integer(x.maxHp,1,10000)&&integer(x.hp,0,x.maxHp)&&integer(x.atk,1,1000)))return false;
    const ids=f.fighters.map(x=>x.uid);if(!Array.isArray(f.events)||f.events.length<1||f.events.length>160||!f.events.every(e=>e&&ids.includes(e.actor)&&ids.includes(e.target)&&['hit','heal'].includes(e.kind)&&integer(e.amount,1,10000))||!integer(f.cursor,0,f.events.length)||typeof f.won!=='boolean')return false;
   }
   if(['fight','report'].includes(d.phase)&&!d.fight)return false;if(d.phase==='quiz'&&d.charged>=2)return false;
  }else{
   if(!['hand','quiz','feedback','counter','camp','won','lost'].includes(d.phase)||!integer(d.stage,1,3)||!integer(d.heroHp,0,85)||!integer(d.block,0,1000)||!integer(d.mana,0,5)||!integer(d.maxMana,3,5)||!integer(d.strength,0,100)||!integer(d.bossHp,0,BOSSES[d.stage-1].hp)||!integer(d.bossBlock,0,100)||!integer(d.turn,1,41)||!Array.isArray(d.relics)||d.relics.length>2||!d.relics.every(r=>['ember','battery','bloom'].includes(r)))return false;
   if(![d.hand,d.pile,d.discard].every(Array.isArray)||d.hand.length>7)return false;const cards=[...d.hand,...d.pile,...d.discard];if(cards.length!==12||new Set(cards).size!==12||!cards.every(i=>integer(i,0,11)))return false;
   if(d.selected!==null&&!integer(d.selected,0,11))return false;if(d.phase==='quiz'&&(!d.hand.includes(d.selected)||spell(d,d.selected).cost>d.mana))return false;
  }
  return true;
 }
 root.WordBattles={ROBOTS,SPELLS,BOSSES,create,complete,bot,spell,question,synergies,buy,sell,move,shop,charge,robotAnswer,fight,frame,board,nextWave,select,bossAnswer,intent,endTurn,advance,relic,validDraft};
})(typeof window!=='undefined'?window:globalThis);
