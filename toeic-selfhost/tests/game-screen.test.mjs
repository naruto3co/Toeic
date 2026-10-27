import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync(new URL('../public/game-screen.js',import.meta.url),'utf8');
function browser({native=true,reject=false,touch=false,embedded=false}={}){
 const classes=new Set(),props={},events={},windowEvents={},messages=[],timeouts=[];
 const root={style:{setProperty:(key,value)=>props[key]=value}},body={dataset:{},classList:{toggle:(key,active)=>active?classes.add(key):classes.delete(key)}};
 const app={rect:{width:1280,height:720},getBoundingClientRect(){return this.rect;}},main={rect:{width:1280,height:720},getBoundingClientRect(){return this.rect;}};
 const document={documentElement:root,body,getElementById:id=>id==='study-app'?app:id==='main'?main:null,fullscreenElement:null,querySelectorAll:()=>[],querySelector:()=>null,addEventListener:(key,fn)=>events[key]=fn};
 const window={innerWidth:1280,innerHeight:720,outerWidth:1280,outerHeight:820,screen:{width:1920,height:1080},addEventListener:(key,fn)=>windowEvents[key]=fn,matchMedia:()=>({matches:touch})};
 window.self=window;window.top=embedded?{}:window;
 if(native){app.requestFullscreen=async()=>{if(reject)throw Error('unsupported');document.fullscreenElement=app;events.fullscreenchange();};document.exitFullscreen=async()=>{document.fullscreenElement=null;events.fullscreenchange();};}
 window.ProfileStore={isActive:()=>true};
 const context={window,document,location:{hash:'#games'},setTimeout:fn=>timeouts.push(fn),requestAnimationFrame:fn=>{fn();return 1;},cancelAnimationFrame:()=>{}};
 vm.runInNewContext(code,context);window.GameScreen.init({notify:msg=>messages.push(msg)});window.GameScreen.setActive(true);
 return {screen:window.GameScreen,window,document,app,main,classes,props,events,windowEvents,messages,location:context.location,async flushTimers(){while(timeouts.length)await timeouts.shift()();}};
}
test('native fullscreen enters and exits without leaving the immersive layout stuck',async()=>{
 const b=browser();await b.screen.toggle();assert.equal(b.document.fullscreenElement,b.app);assert.equal(b.screen.mode(),'native');assert.ok(b.classes.has('battle-immersive'));assert.equal(b.document.body.dataset.screenMode,'native');
 await b.screen.toggle();assert.equal(b.screen.mode(),'window');assert.ok(!b.classes.has('battle-immersive'));
 await b.screen.toggle();b.document.fullscreenElement=null;b.events.fullscreenchange();assert.equal(b.screen.mode(),'window');assert.ok(!b.classes.has('battle-immersive'));
});
test('F11 browser resize automatically enters the game and restores normal view on exit',()=>{
 const b=browser();b.window.innerWidth=b.window.outerWidth=1920;b.window.innerHeight=b.window.outerHeight=1080;b.windowEvents.resize();
 assert.equal(b.screen.mode(),'browser');assert.ok(b.classes.has('battle-immersive'));assert.equal(b.props['--game-height'],'1080px');
 b.window.innerWidth=b.window.outerWidth=1280;b.window.innerHeight=720;b.window.outerHeight=820;b.windowEvents.resize();assert.equal(b.screen.mode(),'window');assert.ok(!b.classes.has('battle-immersive'));
});
test('unsupported or rejected mobile fullscreen has a usable viewport mode and Escape exit',async()=>{
 for(const options of [{native:false},{reject:true}]){const b=browser(options);await b.screen.toggle();assert.equal(b.screen.mode(),'expanded');assert.ok(b.classes.has('battle-immersive'));b.events.keydown({key:'Escape'});assert.equal(b.screen.mode(),'window');}
});
test('browser fullscreen button gives the correct exit shortcut instead of pretending it exited',async()=>{
 const b=browser();b.window.innerWidth=1920;b.window.innerHeight=1080;b.screen.sync();await b.screen.toggle();assert.equal(b.screen.mode(),'browser');assert.match(b.messages[0],/F11/);
});
test('mobile browser bars and rotation update viewport height without mistaking a phone for F11',()=>{
 const b=browser({touch:true,native:false});b.window.screen={width:390,height:844};b.window.innerWidth=390;b.window.innerHeight=844;b.window.visualViewport={height:750,scale:1};b.screen.sync();assert.equal(b.screen.mode(),'window');assert.equal(b.props['--game-height'],'750px');
 b.window.innerWidth=844;b.window.innerHeight=390;b.window.visualViewport.height=350;b.windowEvents.orientationchange();assert.equal(b.props['--game-height'],'350px');
});

test('F11 still expands the game if the browser does not resize, and toggles back',()=>{
 const b=browser();b.events.keydown({key:'F11'});assert.equal(b.screen.mode(),'expanded');assert.ok(b.classes.has('battle-immersive'));b.events.keydown({key:'F11'});assert.equal(b.screen.mode(),'window');
 b.events.keydown({key:'F11'});b.window.innerWidth=1920;b.window.innerHeight=1080;b.windowEvents.resize();assert.equal(b.screen.mode(),'browser');b.window.innerWidth=1280;b.window.innerHeight=720;b.windowEvents.resize();assert.equal(b.screen.mode(),'window');
});

test('fullscreen transition never collapses the game when the visual viewport reports zero',async()=>{
 const b=browser();b.window.visualViewport={height:0,scale:1};b.screen.sync();assert.equal(b.props['--game-height'],'720px');
 await b.screen.toggle();b.window.innerHeight=0;b.window.visualViewport.height=0;b.screen.sync();assert.equal(b.props['--game-height'],'720px');
 b.window.innerHeight=1080;b.screen.sync();assert.equal(b.props['--game-height'],'1080px');
});
test('embedded viewers keep the existing visible game instead of fullscreening the outer frame',async()=>{
 const b=browser({embedded:true});await b.screen.toggle();assert.equal(b.document.fullscreenElement,null);assert.equal(b.screen.mode(),'expanded');assert.ok(b.classes.has('battle-immersive'));
 await b.screen.toggle();assert.equal(b.screen.mode(),'window');
});
test('an empty native fullscreen automatically returns to the visible viewport game',async()=>{
 const b=browser();b.main.rect={width:0,height:0};await b.screen.toggle();await b.flushTimers();assert.equal(b.document.fullscreenElement,null);assert.equal(b.screen.mode(),'expanded');assert.ok(b.classes.has('battle-immersive'));assert.equal(b.props['--game-height'],'720px');
});


test('leaving games or signing out restores site chrome and exits native fullscreen',async()=>{
 for(const change of ['route','account']){
  const b=browser();await b.screen.toggle();assert.ok(b.classes.has('battle-playing'));
  if(change==='account'){b.window.ProfileStore.isActive=()=>false;b.screen.setActive(false);}
  else{b.location.hash='#review';b.windowEvents.hashchange();}
  assert.equal(b.screen.mode(),'window');assert.equal(b.document.fullscreenElement,null);
  assert.ok(!b.classes.has('battle-playing'));assert.ok(!b.classes.has('battle-immersive'));
 }
});
