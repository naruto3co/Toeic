/* Tiny local chiptune synthesizer; audio begins only after a user gesture. */
(function(){
 'use strict';
 const key='pixel-arena-sound-v1';let ctx,volume=.35,muted=false;
 try{const s=JSON.parse(localStorage.getItem(key)||'null');if(s){volume=Math.max(0,Math.min(1,Number(s.volume)||0));muted=!!s.muted;}}catch{}
 function save(){try{localStorage.setItem(key,JSON.stringify({volume,muted}));}catch{}}
 function unlock(){if(!ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(Audio)ctx=new Audio();}if(ctx?.state==='suspended')ctx.resume().catch(()=>{});}
 const patterns={
  click:[[480,.045],[650,.055]],select:[[330,.06],[660,.08]],buy:[[440,.06],[660,.06],[880,.1]],merge:[[440,.08],[660,.08],[880,.08],[1320,.16]],sell:[[660,.06],[440,.09]],shop:[[310,.06],[460,.07]],
  correct:[[523,.06],[659,.07],[784,.12]],wrong:[[180,.1],[110,.16]],hit:[[190,.045],[65,.08]],heal:[[440,.07],[587,.09],[880,.15]],shield:[[260,.05],[520,.12]],meteor:[[150,.09],[90,.12],[55,.18]],spark:[[880,.04],[1320,.05],[1760,.1]],focus:[[392,.08],[587,.1],[784,.18]],
  charge:[[260,.05],[520,.07],[1040,.1]],fight:[[220,.08],[330,.08],[440,.13]],skill:[[330,.06],[660,.07],[990,.13],[1320,.18]],wave:[[523,.08],[659,.08],[784,.08],[1046,.18]],win:[[523,.1],[659,.1],[784,.1],[1046,.16],[784,.1],[1046,.3]],lose:[[330,.18],[294,.18],[220,.3]]
 };
 function play(name){if(muted||volume===0||document.hidden||!ctx||ctx.state!=='running')return;const notes=patterns[name]||patterns.click;let at=ctx.currentTime+.005;for(const [freq,duration] of notes){const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type=['hit','wrong','meteor'].includes(name)?'sawtooth':'square';oscillator.frequency.setValueAtTime(freq,at);gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume*.075,at+.006);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start(at);oscillator.stop(at+duration+.015);at+=duration*.8;}}
 document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock);
 window.ActionAudio={play,unlock,settings:()=>({muted,volume}),toggle(){unlock();muted=!muted;save();if(!muted)play('select');},setVolume(value){unlock();volume=Math.max(0,Math.min(1,Number(value)));save();play('click');}};
})();
