/* Fullscreen API, browser F11 detection, and a viewport fallback for mobile. */
(function(){
 'use strict';
 let expanded=false,wasBrowserFullscreen=false,notify=()=>{},frame=null,lastHeight=720,recovering=false;
 const app=()=>document.getElementById('game-app');
 const usable=n=>Number.isFinite(n)&&n>=160;
 const nativeElement=()=>document.fullscreenElement||document.webkitFullscreenElement;
 function browserFullscreen(){
  const s=window.screen;if(!s?.height||!s?.width||window.matchMedia?.('(hover: none) and (pointer: coarse)').matches)return false;
  const fillsScreen=Math.abs(window.innerHeight-s.height)<=6&&Math.abs(window.innerWidth-s.width)<=6;
  const hiddenChrome=window.outerHeight>0&&Math.abs(window.outerHeight-s.height)<=6&&Math.abs(window.outerWidth-s.width)<=6&&Math.abs(window.outerHeight-window.innerHeight)<=8;
  return fillsScreen||hiddenChrome;
 }
 const mode=()=>nativeElement()?'native':browserFullscreen()?'browser':expanded?'expanded':'window';
 function control(){const active=mode()!=='window';return `<button class="t-icon screen-toggle" data-screen-toggle aria-label="${active?'Thoát toàn màn hình':'Toàn màn hình'}" aria-pressed="${active}" title="${active?'Thoát toàn màn hình':'Toàn màn hình · F11'}"><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="${active?'M3 9h6V3m6 0v6h6M3 15h6v6m6 0v-6h6':'M9 3H3v6m12-6h6v6M3 15v6h6m6 0h6v-6'}"/></svg><span class="screen-label">${active?'Thu nhỏ':'Toàn màn hình'}</span></button>`;}
 function sync(){
  const inBrowser=browserFullscreen();if(wasBrowserFullscreen&&!inBrowser)expanded=false;wasBrowserFullscreen=inBrowser;
  const current=mode(),active=current!=='window';
  document.body.classList.toggle('game-immersive',active);
  document.body.dataset.screenMode=current;
  const viewport=window.visualViewport;
  // Fullscreen transitions can temporarily report a zero-sized visual viewport.
  // Preserve a usable layout until the new viewport has settled.
  const preferred=!nativeElement()&&viewport?.scale===1?viewport.height:window.innerHeight;
  const height=usable(preferred)?preferred:usable(window.innerHeight)?window.innerHeight:lastHeight;
  lastHeight=Math.round(height);document.documentElement.style.setProperty('--game-height',lastHeight+'px');
  for(const b of document.querySelectorAll('[data-screen-toggle]')){
   b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',active?'Thoát toàn màn hình':'Toàn màn hình');
   b.title=current==='browser'?'Nhấn F11 để thoát toàn màn hình':active?'Thoát toàn màn hình':'Toàn màn hình · F11';
   b.innerHTML=control().replace(/^<button[^>]*>/,'').replace(/<\/button>$/,'');
  }
 }
 function schedule(){if(frame!==null)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{frame=null;sync();});}
 async function toggle(){
  const current=mode();window.ActionAudio?.play('click');
  if(current==='browser'){notify('Nhấn F11 để thoát chế độ toàn màn hình của trình duyệt.');return;}
  if(current==='native'){
   const exit=document.exitFullscreen||document.webkitExitFullscreen;
   try{await exit?.call(document);}catch{notify('Dùng phím Esc để thoát toàn màn hình.');}sync();return;
  }
  if(expanded){expanded=false;sync();return;}
  expanded=true;sync();
  const target=app();
  // Embedded Site viewers may promote an empty outer frame. Keep the game in
  // place there; F11 remains available for the browser's own full-screen mode.
  const framed=window.self!==window.top;
  const enter=target&&(target.requestFullscreen||target.webkitRequestFullscreen);
  if(!framed&&enter){try{await enter.call(target);}catch{/* Keep the visible viewport layout on failure. */}}
  if(nativeElement()===target)setTimeout(recoverEmptyFullscreen,400);
  sync();
 }
 async function recoverEmptyFullscreen(){
  if(recovering||nativeElement()!==app())return;
  const target=app(),main=document.getElementById('main'),box=target?.getBoundingClientRect(),content=main?.getBoundingClientRect();
  if(box?.width>=160&&box?.height>=160&&content?.width>=120&&content?.height>=120)return;
  recovering=true;
  try{const exit=document.exitFullscreen||document.webkitExitFullscreen;await exit?.call(document);}catch{}
  expanded=true;recovering=false;sync();
 }
 function fullscreenChanged(){if(!recovering)expanded=false;sync();if(nativeElement()===app())setTimeout(recoverEmptyFullscreen,400);}
 document.addEventListener('fullscreenchange',fullscreenChanged);
 document.addEventListener('webkitfullscreenchange',fullscreenChanged);
 document.addEventListener('click',e=>{if(e.target.closest('[data-screen-toggle]'))toggle();});
 document.addEventListener('keydown',e=>{
  // Leave the browser's reserved F11 shortcut intact. Resize then updates the game.
  if(e.key==='F11'&&!e.repeat){expanded=mode()==='window';sync();for(const delay of [0,150,500])setTimeout(schedule,delay);}
  if(e.key==='Escape'&&expanded&&!nativeElement()&&!document.querySelector('dialog[open]')){expanded=false;sync();}
 });
 window.addEventListener('resize',schedule);window.addEventListener('orientationchange',schedule);
 window.visualViewport?.addEventListener('resize',schedule);
 window.GameScreen={control,toggle,sync,mode,init(options={}){notify=options.notify||notify;sync();}};
 sync();
})();
