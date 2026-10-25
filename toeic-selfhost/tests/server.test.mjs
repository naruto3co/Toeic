import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,existsSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {backup,DatabaseSync} from 'node:sqlite';
import {createApp} from '../server/app.mjs';
import {createUser} from '../server/database.mjs';
import {hashPassword} from '../server/security.mjs';
import {emptyProgress} from '../server/progress.ts';
const origin='https://study.example.test',password='Test-password-2026!';
async function fixture(options={}){
 const directory=mkdtempSync(join(tmpdir(),'toeic-test-')),dbPath=join(directory,'test.sqlite'),app=await createApp({dbPath,publicOrigin:origin,secureCookies:true,...options});
 const admin=createUser(app.db,{username:'admin',displayName:'Admin',passwordHash:await hashPassword(password),role:'admin',mustChange:false});
 await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+app.server.address().port;
 async function call(path,{method='GET',body,cookie='',csrf='',headers={}}={}){const requestHeaders={Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...(csrf?{'X-CSRF-Token':csrf}:{}),...headers};for(const key of Object.keys(requestHeaders))if(requestHeaders[key]===undefined)delete requestHeaders[key];const res=await fetch(base+path,{method,headers:requestHeaders,...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:res.status,body:await res.json(),headers:res.headers};}
 async function login(username='admin',value=password){const result=await call('/api/auth/login',{method:'POST',body:{username,password:value}});return {...result,cookie:result.headers.get('set-cookie')?.split(';')[0],csrf:result.body.csrf};}
 const auth=(session,method,body)=>({method,body,cookie:session.cookie,csrf:session.csrf});
 return {...app,directory,dbPath,call,login,auth,admin,async cleanup(){await app.close();rmSync(directory,{recursive:true,force:true});}};
}

test('authenticated users, forced password changes, database ownership and admin roles',async()=>{
 const f=await fixture();try{
  assert.equal((await f.call('/api/profile/state')).status,401);
  assert.equal((await f.login('admin','wrong')).status,401);
  const admin=await f.login();assert.equal(admin.status,200);assert.match(admin.headers.get('set-cookie'),/HttpOnly.*SameSite=Strict.*Secure/);assert.ok(!JSON.stringify(admin.body).includes('password_hash'));
  const raw=f.db.prepare('SELECT password_hash FROM users WHERE id=?').get(f.admin.id).password_hash;assert.ok(raw.startsWith('scrypt$'));assert.ok(!raw.includes(password));
  let r=await f.call('/api/admin/users',f.auth(admin,'POST',{username:'learner',displayName:'Người học',password,role:'student'}));assert.equal(r.status,201);const learnerId=r.body.user.id;
  const temporary=await f.login('learner');assert.equal(temporary.body.user.mustChangePassword,true);assert.equal(temporary.body.state,undefined);
  assert.equal((await f.call('/api/profile/state',{cookie:temporary.cookie})).status,403);
  r=await f.call('/api/auth/password',f.auth(temporary,'POST',{currentPassword:password,password:'My-new-password-2026!'}));assert.equal(r.status,200);assert.equal(r.body.user.mustChangePassword,false);
  const learner={cookie:r.headers.get('set-cookie').split(';')[0],csrf:r.body.csrf};
  assert.equal((await f.call('/api/auth/session',{cookie:temporary.cookie})).status,401);
  assert.equal((await f.call('/api/admin/users',{cookie:learner.cookie})).status,403);
  assert.equal((await f.call('/api/admin/users',f.auth(learner,'POST',{username:'bad-admin',displayName:'No',password,role:'admin'}))).status,403);
  const progress=emptyProgress();progress.known=['1-0'];progress.saved=['2-0'];
  r=await f.call('/api/profile/state',f.auth(learner,'PUT',{account:'admin',user_id:f.admin.id,revision:0,mutation:'test-mutation-0001',state:progress}));assert.equal(r.status,200);
  assert.deepEqual((await f.call('/api/profile/state',{cookie:admin.cookie})).body.state.known,[]);assert.deepEqual((await f.call('/api/profile/state',{cookie:learner.cookie})).body.state.known,['1-0']);
  const users=await f.call('/api/admin/users',{cookie:admin.cookie});assert.equal(users.body.users.find(u=>u.id===learnerId).progress.known,1);
  assert.equal((await f.call('/api/admin/users/'+f.admin.id,f.auth(admin,'PATCH',{active:false}))).status,400);
  assert.equal((await f.call('/api/admin/users/'+f.admin.id,f.auth(admin,'PATCH',{role:'student'}))).status,400);
  assert.equal((await f.call('/api/admin/users/'+learnerId,f.auth(admin,'PATCH',{active:false}))).status,200);
  assert.equal((await f.call('/api/auth/session',{cookie:learner.cookie})).status,401);assert.equal((await f.login('learner','My-new-password-2026!')).status,401);
  await f.call('/api/admin/users/'+learnerId,f.auth(admin,'PATCH',{active:true}));const active=await f.login('learner','My-new-password-2026!');assert.equal(active.status,200);
  await f.call('/api/admin/users/'+learnerId+'/password',f.auth(admin,'POST',{password:'Another-temp-password!'}));assert.equal((await f.call('/api/auth/session',{cookie:active.cookie})).status,401);
  assert.equal((await f.login('learner','Another-temp-password!')).body.user.mustChangePassword,true);
  const audit=await f.call('/api/admin/audit',{cookie:admin.cookie});assert.ok(audit.body.entries.some(e=>e.action==='user.password_reset'));assert.ok(!JSON.stringify(audit.body).includes('Another-temp-password!'));
 }finally{await f.cleanup();}
});

test('CSRF, origin validation, input validation, logout, expired sessions and login rate limiting',async()=>{
 const f=await fixture();try{
  const admin=await f.login(),data={username:'person',displayName:'Person',password,role:'student'};
  assert.equal((await f.call('/api/admin/users',{method:'POST',cookie:admin.cookie,body:data})).status,403);
  assert.equal((await f.call('/api/admin/users',{...f.auth(admin,'POST',data),headers:{Origin:'https://evil.example'}})).status,403);
  assert.equal((await f.call('/api/admin/users',f.auth(admin,'POST',{...data,password:'short'}))).status,400);
  assert.equal((await f.call('/api/admin/users',f.auth(admin,'POST',{...data,username:"x'; DROP TABLE users;--"}))).status,400);
  assert.equal((await f.call('/api/profile/state',f.auth(admin,'PUT',{revision:0,mutation:'test-mutation-0002',state:{}}))).status,400);
  assert.equal((await f.call('/api/auth/logout',f.auth(admin,'POST',{}))).status,200);assert.equal((await f.call('/api/auth/session',{cookie:admin.cookie})).status,401);
  const again=await f.login();f.db.prepare('UPDATE sessions SET expires_at=0').run();assert.equal((await f.call('/api/auth/session',{cookie:again.cookie})).status,401);
  for(let i=0;i<15;i++)assert.equal((await f.login('unknown','not-a-valid-password')).status,401);
  assert.equal((await f.login('unknown','not-a-valid-password')).status,429);
 }finally{await f.cleanup();}
});

test('revision conflicts and retried saves are safe; state, users and backups survive restart',async()=>{
 const f=await fixture();let reopened;try{
  const admin=await f.login(),state=emptyProgress();state.saved=['1-0'];const edit={revision:0,mutation:'test-idempotent-001',state};
  const first=await f.call('/api/profile/state',f.auth(admin,'PUT',edit));assert.equal(first.status,200);assert.equal(first.body.revision,1);
  const retry=await f.call('/api/profile/state',f.auth(admin,'PUT',edit));assert.equal(retry.status,200);assert.equal(retry.body.revision,1);
  const stale=await f.call('/api/profile/state',f.auth(admin,'PUT',{...edit,mutation:'other-device-0001'}));assert.equal(stale.status,409);assert.deepEqual(stale.body.state.saved,['1-0']);
  const target=join(f.directory,'backup.sqlite');await backup(f.db,target);assert.ok(existsSync(target));const db=new DatabaseSync(target);assert.equal(db.prepare('SELECT count(*) n FROM users').get().n,1);assert.deepEqual(JSON.parse(db.prepare('SELECT progress FROM profiles').get().progress).saved,['1-0']);db.close();
  await f.close();reopened=await createApp({dbPath:f.dbPath,publicOrigin:origin});assert.equal(reopened.db.prepare('SELECT count(*) n FROM users').get().n,1);assert.deepEqual(JSON.parse(reopened.db.prepare('SELECT progress FROM profiles').get().progress).saved,['1-0']);
  assert.ok(!readdirSync(f.directory).some(name=>name.includes('password')));
 }finally{if(reopened)await reopened.close();rmSync(f.directory,{recursive:true,force:true});}
});

test('browser registers, logs in, persists progress, retries offline and restores a fresh page',async()=>{
 const {default:vm}=await import('node:vm'),{readFileSync}=await import('node:fs');const f=await fixture();
 const nodes=new Map(),storage=new Map(),listeners={};let cookie='',online=true,value=emptyProgress(),context;
 const node=()=>({hidden:false,value:'',innerHTML:'',textContent:'',dataset:{},classList:{remove(){}},handlers:{},focus(){},querySelector(){return {disabled:false};},addEventListener(type,fn){this.handlers[type]=fn;}});
 const document={visibilityState:'visible',querySelector(selector){if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);},querySelectorAll(){return [];},addEventListener(type,fn){listeners[type]=fn;}};
 const until=async predicate=>{for(let i=0;i<300;i++){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,10));}throw new Error('UI did not reach expected state');};
 try{
  context={document,navigator:{onLine:true},AbortController,crypto:{},setTimeout,clearTimeout,addEventListener(){},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,v)=>storage.set(key,v)},GameHub:{identity(){}},async fetch(path,options){if(!online)throw new Error('Offline');const response=await fetch('http://127.0.0.1:'+f.server.address().port+path,{...options,headers:{...options.headers,Origin:origin,...(cookie?{Cookie:cookie}:{})}});const fresh=response.headers.get('set-cookie');if(fresh)cookie=fresh.split(';')[0];return response;}};
  context.window=context;vm.createContext(context);for(const file of ['profile-sync.js','profile.js'])vm.runInContext(readFileSync(new URL('../public/'+file,import.meta.url),'utf8'),context);
  context.ProfileStore.start({getState:()=>value,setState:next=>{value=next;},notify(){}});
  await until(()=>nodes.has('#profile-login-form'));
  listeners.click({target:{closest:()=>({dataset:{profileAction:'register'}})}});
  document.querySelector('#register-name').value='Người tự đăng ký';document.querySelector('#profile-account').value='self_learner';document.querySelector('#profile-password').value=password;document.querySelector('#register-confirm').value='different-password';
  const registration=nodes.get('#profile-register-form');await registration.handlers.submit({preventDefault(){},target:registration});assert.equal(nodes.get('#profile-login-error').textContent,'Hai mật khẩu chưa khớp.');
  document.querySelector('#register-confirm').value=password;await registration.handlers.submit({preventDefault(){},target:registration});assert.ok(nodes.get('#profile-gate').innerHTML.includes('Tạo tài khoản thành công!'));assert.equal(context.ProfileStore.isActive(),false);
  document.querySelector('#profile-account').value='self_learner';document.querySelector('#profile-password').value=password;
  const form=nodes.get('#profile-login-form');await form.handlers.submit({preventDefault(){},target:form});assert.equal(context.ProfileStore.isActive(),true);assert.equal(context.ProfileStore.account(),'self_learner');
  value.saved=['1-0'];context.ProfileStore.save(value);assert.equal(await context.ProfileStore.flush(),true);assert.deepEqual((await f.call('/api/profile/state',{cookie})).body.state.saved,['1-0']);
  const persisted=JSON.stringify([...storage]);assert.ok(!persisted.includes(password));assert.ok(!persisted.includes('toeic_session'));
  online=false;context.navigator.onLine=false;value.known=['2-0'];context.ProfileStore.save(value);assert.equal(await context.ProfileStore.flush(),false);assert.ok(JSON.stringify([...storage]).includes('2-0'));
  online=true;context.navigator.onLine=true;assert.equal(await context.ProfileStore.flush(),true);assert.deepEqual((await f.call('/api/profile/state',{cookie})).body.state.known,['2-0']);
  // Fresh page and empty local cache still restore learning from the server session.
  const freshNodes=new Map(),freshDocument={...document,querySelector(selector){if(!freshNodes.has(selector))freshNodes.set(selector,node());return freshNodes.get(selector);}};
  const fresh={...context,document:freshDocument,ProfileStore:undefined,localStorage:{getItem:()=>null,setItem(){}}};fresh.window=fresh;vm.createContext(fresh);for(const file of ['profile-sync.js','profile.js'])vm.runInContext(readFileSync(new URL('../public/'+file,import.meta.url),'utf8'),fresh);let restored;
  fresh.ProfileStore.start({getState:()=>restored,setState:next=>{restored=next;},notify(){}});await until(()=>fresh.ProfileStore.isActive());assert.equal(JSON.stringify(restored.known),'["2-0"]');
 }finally{if(context?.ProfileStore?.isActive())await context.ProfileStore.flush();await f.cleanup();}
});

test('public registration creates a private student profile, rejects duplicates and cannot grant admin',async()=>{
 const f=await fixture();try{
  assert.equal((await f.call('/api/auth/options')).body.registrationEnabled,true);
  const data={username:'New_Learner',displayName:'Người học mới',password,confirmPassword:password,role:'admin',active:true,mustChangePassword:false};
  const registered=await f.call('/api/auth/register',{method:'POST',body:data});assert.equal(registered.status,201);assert.equal(registered.body.username,'new_learner');assert.equal(registered.headers.get('set-cookie'),null);
  assert.equal((await f.call('/api/profile/state')).status,401);
  const row=f.db.prepare('SELECT * FROM users WHERE username=?').get('new_learner');assert.equal(row.role,'student');assert.equal(row.must_change_password,0);assert.notEqual(row.password_hash,password);
  const loggedIn=await f.login('new_learner');assert.equal(loggedIn.status,200);assert.equal(loggedIn.body.user.role,'student');assert.deepEqual(loggedIn.body.state,emptyProgress());
  assert.equal((await f.call('/api/admin/users',{cookie:loggedIn.cookie})).status,403);
  const other=await f.login();assert.deepEqual((await f.call('/api/profile/state',{cookie:other.cookie})).body.state.known,[]);
  assert.equal((await f.call('/api/auth/register',{method:'POST',body:data})).status,409);
  assert.equal((await f.call('/api/auth/register',{method:'POST',body:{...data,username:'short_password',password:'tiny',confirmPassword:'tiny'}})).status,400);
  assert.equal((await f.call('/api/auth/register',{method:'POST',body:{...data,username:'wrong_confirm',confirmPassword:'not-the-same-password'}})).status,400);
  assert.equal((await f.call('/api/auth/register',{method:'POST',body:{...data,username:'bad-origin'},headers:{Origin:'https://other.example'}})).status,403);
  const race={...data,username:'same_name'};const concurrent=await Promise.all([f.call('/api/auth/register',{method:'POST',body:race}),f.call('/api/auth/register',{method:'POST',body:race})]);assert.deepEqual(concurrent.map(x=>x.status).sort(),[201,409]);assert.equal(f.db.prepare('SELECT count(*) n FROM users WHERE username=?').get('same_name').n,1);
  const audit=f.db.prepare("SELECT * FROM audit_log WHERE action='auth.register' AND target_id=?").get(row.id);assert.ok(audit);assert.ok(!audit.details.includes(password));
  f.db.prepare("UPDATE login_limits SET attempts=10 WHERE key LIKE 'register:%'").run();assert.equal((await f.call('/api/auth/register',{method:'POST',body:{...data,username:'too_many'}})).status,429);
 }finally{await f.cleanup();}
});

test('server operator can disable self-registration without changing existing logins',async()=>{
 const f=await fixture({allowRegistration:false});try{
  assert.equal((await f.call('/api/auth/options')).body.registrationEnabled,false);
  assert.equal((await f.call('/api/auth/register',{method:'POST',body:{username:'blocked_signup',displayName:'Learner',password,confirmPassword:password}})).status,403);
  assert.equal(f.db.prepare('SELECT count(*) n FROM users').get().n,1);assert.equal((await f.login()).status,200);
 }finally{await f.cleanup();}
});

test('review schedules, saved board and listening results persist; older clients cannot erase new fields',async()=>{
 const {default:vm}=await import('node:vm'),{readFileSync}=await import('node:fs');
 const context={};vm.createContext(context);for(const file of ['data.js','review-engine.js','games-engine.js','board-engine.js','board-checkpoint.js'])vm.runInContext(readFileSync(new URL('../public/'+file,import.meta.url),'utf8'),context);
 vm.runInContext('this.testWords=WORDS;',context);
 const f=await fixture();try{
  const admin=await f.login(),state=emptyProgress();context.VocabularyReview.answer(state,'1-0',true,1700000000000);state.reviews=JSON.parse(JSON.stringify(state.reviews));
  const board=context.PairBoardEngine.create(context.testWords,state,{size:8,seed:42});state.boardDraft=JSON.parse(JSON.stringify(context.BoardCheckpoint.pack({id:'saved-board-api-test',board,wrong:{},score:0,combo:0,bestCombo:0},12345,1700000000000)));
  state.games.history['listening-api-test']={mode:'listen',at:1700000000000,score:100,correct:1,total:1,seconds:8,words:[{id:'1-0',wrong:0,success:true}]};
  let result=await f.call('/api/profile/state',f.auth(admin,'PUT',{state,revision:0,mutation:'learning-save-api-001'}));assert.equal(result.status,200);assert.deepEqual(result.body.state.reviews,state.reviews);assert.deepEqual(result.body.state.boardDraft,state.boardDraft);
  const login=await f.login();assert.deepEqual(login.body.state.boardDraft.order,state.boardDraft.order);assert.equal(login.body.state.games.history['listening-api-test'].mode,'listen');
  const legacy=structuredClone(state);delete legacy.reviews;delete legacy.boardDraft;legacy.known=['2-0'];result=await f.call('/api/profile/state',f.auth(admin,'PUT',{state:legacy,revision:1,mutation:'older-client-save-001'}));assert.equal(result.status,200);assert.deepEqual(result.body.state.reviews,state.reviews);assert.deepEqual(result.body.state.boardDraft,state.boardDraft);
  const invalid=structuredClone(state);invalid.boardDraft.elapsedMs=-1;assert.equal((await f.call('/api/profile/state',f.auth(admin,'PUT',{state:invalid,revision:2,mutation:'invalid-checkpoint-001'}))).status,400);
  result=await f.call('/api/profile/state',f.auth(admin,'PUT',{state:emptyProgress(),revision:2,mutation:'explicit-reset-001'}));assert.equal(result.status,200);assert.deepEqual(result.body.state.reviews,{});assert.equal(result.body.state.boardDraft,null);
 }finally{await f.cleanup();}
});

test('robot and boss campaigns persist through API and old clients, stay private and serve bundled art safely',async()=>{
 const f=await fixture();try{
  const B=globalThis.WordBattles,ids=Array.from({length:12},(_,i)=>`1-${i}`),admin=await f.login(),state=emptyProgress();
  state.battleDrafts.robot=B.buy(B.create('robot',ids.slice(0,10),{id:'api-robot-campaign',seed:32}),'volt');
  state.battleDrafts.boss=B.create('boss',ids,{id:'api-boss-campaign',seed:17});
  for(const mode of ['robot','boss'])state.games.history['api-history-'+mode]={mode,at:Date.now(),score:300,correct:2,total:3,seconds:30,won:false,stage:1,words:ids.slice(0,3).map((id,i)=>({id,wrong:i===2?1:0,success:i!==2}))};
  let saved=await f.call('/api/profile/state',f.auth(admin,'PUT',{state,revision:0,mutation:'api-battles-save-01'}));assert.equal(saved.status,200);assert.deepEqual(saved.body.state.battleDrafts,state.battleDrafts);assert.equal(saved.body.state.games.history['api-history-boss'].stage,1);
  assert.deepEqual((await f.login()).body.state.battleDrafts,state.battleDrafts);
  const legacy=structuredClone(state);delete legacy.battleDrafts;saved=await f.call('/api/profile/state',f.auth(admin,'PUT',{state:legacy,revision:1,mutation:'api-battles-legacy-01'}));assert.equal(saved.status,200);assert.deepEqual(saved.body.state.battleDrafts,state.battleDrafts);
  await f.call('/api/auth/register',{method:'POST',body:{username:'battle_student',displayName:'Player',password,confirmPassword:password}});const other=await f.login('battle_student');assert.deepEqual(other.body.state.battleDrafts,{robot:null,boss:null});
  const invalid=structuredClone(state);invalid.battleDrafts.boss.hand[0]=99;assert.equal((await f.call('/api/profile/state',f.auth(admin,'PUT',{state:invalid,revision:2,mutation:'api-battles-invalid-1'}))).status,400);
  const base='http://127.0.0.1:'+f.server.address().port;
  for(const name of ['robots-v1.png','arena-v1.png','pixel-crystal-v1.png','pixel-ember-v1.png','pixel-eclipse-v1.png','pixel-hero-v1.png','pixel-arena-v1.png','pixel-spells-v1.png']){const res=await fetch(base+'/assets/'+name);assert.equal(res.status,200);assert.equal(res.headers.get('content-type'),'image/png');assert.ok((await res.arrayBuffer()).byteLength>1000);}
  for(const path of ['/assets/server/app.mjs','/assets/%2e%2e%2fserver%2fapp.mjs','/data/toeic.sqlite'])assert.equal((await fetch(base+path)).status,404);
  const reset=await f.call('/api/profile/state',f.auth(admin,'PUT',{state:emptyProgress(),revision:2,mutation:'api-battles-reset-01'}));assert.equal(reset.status,200);assert.deepEqual(reset.body.state.battleDrafts,{robot:null,boss:null});
 }finally{await f.cleanup();}
});


test('Origin-less same-origin login and profile writes work via Referer, while unsafe requests stay blocked',async()=>{
 const f=await fixture();try{
  const body={username:'admin',password};
  const login=await f.call('/api/auth/login',{method:'POST',body,headers:{Origin:undefined,Referer:origin+'/?from=iphone','Sec-Fetch-Site':'same-origin'}});
  assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0],csrf=login.body.csrf;
  assert.match(login.headers.get('set-cookie'),/HttpOnly.*SameSite=Strict.*Secure/);
  for(const headers of [
   {Origin:undefined},
   {Origin:undefined,Referer:'https://evil.example/'},
   {Origin:'null',Referer:origin+'/'},
   {Origin:'https://evil.example',Referer:origin+'/'},
   {Origin:origin,Referer:origin+'/','Sec-Fetch-Site':'cross-site'},
   {Origin:undefined,Referer:origin+'.evil.example/'}
  ])assert.equal((await f.call('/api/auth/login',{method:'POST',body,headers})).status,403);
  const headers={Origin:undefined,Referer:origin+'/'};
  assert.equal((await f.call('/api/profile/state',{method:'PUT',cookie,headers,body:{revision:0,mutation:'iphone-save-0001',state:emptyProgress()}})).status,403);
  const next=emptyProgress();next.saved=['1-0'];
  assert.equal((await f.call('/api/profile/state',{method:'PUT',cookie,csrf,headers,body:{revision:0,mutation:'iphone-save-0001',state:next}})).status,200);
  assert.deepEqual((await f.call('/api/profile/state',{cookie})).body.state.saved,['1-0']);
  assert.equal((await f.call('/api/profile/state',{method:'PUT',cookie,csrf,headers:{Origin:undefined,Referer:'https://evil.example/'},body:{revision:1,mutation:'iphone-save-0002',state:emptyProgress()}})).status,403);
 }finally{await f.cleanup();}
});
