import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {randomBytes} from 'node:crypto';
import {openDatabase,transaction,createUser,audit,safeUser,snapshot} from './database.mjs';
import {normalizeAccount,validateProgress} from './progress.ts';
import {HttpError,passwordPolicy,hashPassword,verifyPassword,sessionFrom,newSession,sessionCookie,digest,equal,loginLimit} from './security.mjs';

const PUBLIC=fileURLToPath(new URL('../public/',import.meta.url));
const username=value=>{try{return normalizeAccount(value);}catch(error){throw new HttpError(400,error.message);}};
const displayName=value=>{if(typeof value!=='string'||!value.trim()||value.trim().length>80)throw new HttpError(400,'Tên hiển thị cần từ 1 đến 80 ký tự.');return value.trim();};
const role=value=>{if(!['admin','student'].includes(value))throw new HttpError(400,'Vai trò không hợp lệ.');return value;};
function summary(progress){const s=JSON.parse(progress);return {known:s.known.length,saved:s.saved.length,lessonsViewed:Object.keys(s.seen).length,lessonsCompleted:Object.values(s.scores).filter(x=>x.best>=24).length,rounds:Object.keys(s.games?.history||{}).length,quiz:s.quiz?{lesson:s.quiz.lesson,answered:s.quiz.answers.length}:null};}
export async function createApp({dbPath=process.env.DB_PATH||'data/toeic.sqlite',publicOrigin=process.env.PUBLIC_ORIGIN||'http://localhost:8081',secureCookies=new URL(publicOrigin).protocol==='https:',allowRegistration=process.env.ALLOW_REGISTRATION!=='false'}={}){
 const db=openDatabase(dbPath),origin=new URL(publicOrigin).origin;
 if(origin!==publicOrigin.replace(/\/$/,''))throw new Error('PUBLIC_ORIGIN phải là origin, ví dụ https://toeic.example.com');
 const dummy=await hashPassword(randomBytes(32).toString('hex'));
 const payload=session=>({user:safeUser(session.user),csrf:session.csrf,...(!session.user.must_change_password?snapshot(db,session.user.id):{})});
 const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
  if(secureCookies)res.setHeader('Strict-Transport-Security','max-age=31536000');
  const send=(status,body,headers={})=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(body));};
  try{
   const path=new URL(req.url,'http://internal').pathname,method=req.method;
   if(path==='/healthz'&&method==='GET'){db.prepare('SELECT 1').get();return send(200,{ok:true});}
   if(!path.startsWith('/api/')){
    if(method!=='GET'&&method!=='HEAD')throw new HttpError(405,'Phương thức không hợp lệ.');
    const name=path==='/'?'index.html':path==='/admin'?'admin.html':path.slice(1);
    if(!/^(?:[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(?:html|js|css|svg)|assets\/[a-zA-Z0-9][a-zA-Z0-9_-]*\.(?:png|webp|jpg))$/.test(name))throw new HttpError(404,'Không tìm thấy trang.');
    let bytes;try{bytes=await readFile(join(PUBLIC,name));}catch{throw new HttpError(404,'Không tìm thấy trang.');}
    const ext=name.split('.').at(-1),type={html:'text/html',js:'text/javascript',css:'text/css',svg:'image/svg+xml',png:'image/png',webp:'image/webp',jpg:'image/jpeg'}[ext];
    res.writeHead(200,{'Content-Type':type+(['png','webp','jpg'].includes(ext)?'':'; charset=utf-8'),'Cache-Control':'no-cache'});return res.end(method==='HEAD'?undefined:bytes);
   }
   let body={};
   if(['POST','PUT','PATCH','DELETE'].includes(method)){
    if(req.headers.origin!==origin||req.headers['sec-fetch-site']==='cross-site')throw new HttpError(403,'Nguồn yêu cầu không hợp lệ.');
    if(!(req.headers['content-type']||'').startsWith('application/json'))throw new HttpError(415,'Cần gửi dữ liệu JSON.');
    let length=0,chunks=[];for await(const chunk of req){length+=chunk.length;if(length>524288)throw new HttpError(413,'Dữ liệu quá lớn.');chunks.push(chunk);}
    try{body=JSON.parse(Buffer.concat(chunks).toString());}catch{throw new HttpError(400,'JSON không hợp lệ.');}
    if(!body||typeof body!=='object'||Array.isArray(body))throw new HttpError(400,'Dữ liệu không hợp lệ.');
   }
   if(path==='/api/auth/options'&&method==='GET')return send(200,{registrationEnabled:allowRegistration});
   if(path==='/api/auth/register'&&method==='POST'){
    if(!allowRegistration)throw new HttpError(403,'Tính năng tạo tài khoản đang tắt. Vui lòng liên hệ quản trị viên.');
    const ip=req.socket.remoteAddress||'unknown';
    loginLimit(db,'register:'+ip,10,'Bạn đã gửi quá nhiều yêu cầu tạo tài khoản. Vui lòng thử lại sau 15 phút.');
    const name=username(body.username),label=displayName(body.displayName);passwordPolicy(body.password);
    if(body.password!==body.confirmPassword)throw new HttpError(400,'Hai mật khẩu chưa khớp.');
    if(db.prepare('SELECT id FROM users WHERE username=?').get(name))throw new HttpError(409,'Tên tài khoản đã được sử dụng. Hãy chọn tên khác.');
    const hashed=await hashPassword(body.password);
    // Recheck after password hashing: another request may have claimed the name.
    if(db.prepare('SELECT id FROM users WHERE username=?').get(name))throw new HttpError(409,'Tên tài khoản đã được sử dụng. Hãy chọn tên khác.');
    const created=createUser(db,{username:name,displayName:label,passwordHash:hashed,role:'student',mustChange:false});
    audit(db,created.id,'auth.register',created.id);
    return send(201,{ok:true,username:created.username});
   }
   if(path==='/api/auth/login'&&method==='POST'){
    const name=username(body.username),ip=req.socket.remoteAddress||'unknown';
    loginLimit(db,'ip:'+ip,100);loginLimit(db,'account:'+name,15);
    const row=db.prepare('SELECT * FROM users WHERE username=?').get(name);
    const valid=await verifyPassword(body.password,row?.password_hash||dummy);
    if(!row||!valid||!row.active)throw new HttpError(401,'Tên tài khoản hoặc mật khẩu không đúng, hoặc tài khoản đã bị khóa.');
    db.prepare('DELETE FROM login_limits WHERE key=?').run('account:'+name);
    db.prepare('UPDATE users SET last_login_at=? WHERE id=?').run(new Date().toISOString(),row.id);
    const session=newSession(db,row.id);audit(db,row.id,'auth.login',row.id);
    return send(200,payload({...session,user:db.prepare('SELECT * FROM users WHERE id=?').get(row.id)}),{'Set-Cookie':sessionCookie(session.token,{secure:secureCookies})});
   }
   const session=sessionFrom(db,req);if(!session)throw new HttpError(401,'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
   if(method!=='GET'&&!equal(req.headers['x-csrf-token'],session.csrf))throw new HttpError(403,'Phiên thao tác không hợp lệ. Hãy tải lại trang.');
   const user=session.user;
   if(path==='/api/auth/session'&&method==='GET')return send(200,payload(session));
   if(path==='/api/auth/logout'&&method==='POST'){db.prepare('DELETE FROM sessions WHERE token_hash=?').run(digest(session.token));audit(db,user.id,'auth.logout',user.id);return send(200,{ok:true},{'Set-Cookie':sessionCookie('',{secure:secureCookies,clear:true})});}
   if(path==='/api/auth/password'&&method==='POST'){
    passwordPolicy(body.password);
    loginLimit(db,'password:'+user.id,10);
    if(!await verifyPassword(body.currentPassword,user.password_hash))throw new HttpError(400,'Mật khẩu hiện tại không đúng.');
    if(body.currentPassword===body.password)throw new HttpError(400,'Hãy chọn mật khẩu mới khác mật khẩu hiện tại.');
    const hashed=await hashPassword(body.password);
    transaction(db,()=>{db.prepare('UPDATE users SET password_hash=?,must_change_password=0 WHERE id=?').run(hashed,user.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);db.prepare('DELETE FROM login_limits WHERE key=?').run('password:'+user.id);audit(db,user.id,'auth.password_change',user.id);});
    const next=newSession(db,user.id);return send(200,payload({...next,user:db.prepare('SELECT * FROM users WHERE id=?').get(user.id)}),{'Set-Cookie':sessionCookie(next.token,{secure:secureCookies})});
   }
   if(user.must_change_password)throw new HttpError(403,'Bạn cần đổi mật khẩu tạm trước khi tiếp tục.');
   if(path==='/api/profile/state'&&method==='GET')return send(200,snapshot(db,user.id));
   if(path==='/api/profile/export'&&method==='GET')return send(200,{username:user.username,exportedAt:new Date().toISOString(),...snapshot(db,user.id)},{'Content-Disposition':`attachment; filename="toeic-progress-${user.username}.json"`});
   if(path==='/api/profile/state'&&method==='PUT'){
    if(!Number.isSafeInteger(body.revision)||body.revision<0||typeof body.mutation!=='string'||!/^[a-zA-Z0-9-]{8,80}$/.test(body.mutation))throw new HttpError(400,'Phiên bản đồng bộ không hợp lệ.');
    let progress;try{const prior=snapshot(db,user.id).state,incoming=body.state&&typeof body.state==='object'&&!Array.isArray(body.state)?{...body.state,...Object.fromEntries(['reviews','boardDraft','battleDrafts'].filter(key=>!Object.hasOwn(body.state,key)).map(key=>[key,prior[key]]))}:body.state;progress=validateProgress(incoming);}catch(error){throw new HttpError(400,error.message);}
    const result=transaction(db,()=>{const current=snapshot(db,user.id);if(current.mutations.includes(body.mutation))return {status:200,data:current};if(current.revision!==body.revision)return {status:409,data:current};db.prepare('UPDATE profiles SET progress=?,revision=revision+1,mutations=?,updated_at=? WHERE user_id=?').run(JSON.stringify(progress),JSON.stringify([...current.mutations,body.mutation].slice(-100)),new Date().toISOString(),user.id);return {status:200,data:snapshot(db,user.id)};});
    return send(result.status,result.data);
   }
   if(path.startsWith('/api/admin/')){
    if(user.role!=='admin')throw new HttpError(403,'Chỉ quản trị viên mới có quyền thực hiện.');
    if(path==='/api/admin/users'&&method==='GET'){
     const params=new URL(req.url,'http://internal').searchParams,q=(params.get('q')||'').slice(0,80),page=Math.max(1,Math.min(100000,parseInt(params.get('page')||'1',10)||1));
     const where=q?'WHERE instr(u.username,?)>0 OR instr(lower(u.display_name),lower(?))>0':'',args=q?[q,q]:[];
     const total=db.prepare(`SELECT count(*) n FROM users u ${where}`).get(...args).n;
     const rows=db.prepare(`SELECT u.*,p.progress,p.updated_at FROM users u JOIN profiles p ON p.user_id=u.id ${where} ORDER BY u.id DESC LIMIT 25 OFFSET ?`).all(...args,(page-1)*25);
     return send(200,{users:rows.map(row=>({...safeUser(row),progress:summary(row.progress),progressUpdatedAt:row.updated_at})),total,page,pages:Math.max(1,Math.ceil(total/25)),stats:db.prepare('SELECT count(*) total,sum(active) active,sum(role=\'admin\' AND active=1) admins FROM users').get()});
    }
    if(path==='/api/admin/users'&&method==='POST'){
     const name=username(body.username),label=displayName(body.displayName),targetRole=role(body.role||'student'),hashed=await hashPassword(body.password);
     if(db.prepare('SELECT id FROM users WHERE username=?').get(name))throw new HttpError(409,'Tên tài khoản đã được sử dụng.');
     const created=createUser(db,{username:name,displayName:label,passwordHash:hashed,role:targetRole},user.id);return send(201,{user:safeUser(created)});
    }
    const match=path.match(/^\/api\/admin\/users\/(\d+)(?:\/(password|sessions|progress))?$/);
    if(match){
     const targetId=Number(match[1]),action=match[2],target=db.prepare('SELECT * FROM users WHERE id=?').get(targetId);if(!target)throw new HttpError(404,'Không tìm thấy tài khoản.');
     if(method==='PATCH'&&!action){
      const nextRole=role(body.role??target.role),name=displayName(body.displayName??target.display_name);
      if(body.active!==undefined&&typeof body.active!=='boolean')throw new HttpError(400,'Trạng thái không hợp lệ.');
      const active=body.active===undefined?!!target.active:body.active;
      if(targetId===user.id&&(!active||nextRole!=='admin'))throw new HttpError(400,'Bạn không thể tự khóa hoặc tự bỏ quyền admin.');
      transaction(db,()=>{db.prepare('UPDATE users SET display_name=?,role=?,active=? WHERE id=?').run(name,nextRole,active?1:0,targetId);if(!active||nextRole!==target.role)db.prepare('DELETE FROM sessions WHERE user_id=?').run(targetId);audit(db,user.id,'user.update',targetId,{displayName:name,role:nextRole,active});});
      return send(200,{user:safeUser(db.prepare('SELECT * FROM users WHERE id=?').get(targetId))});
     }
     if(action==='password'&&method==='POST'){
      if(targetId===user.id)throw new HttpError(400,'Hãy đổi mật khẩu của bạn trong mục Hồ sơ học tập.');
      const hashed=await hashPassword(body.password);transaction(db,()=>{db.prepare('UPDATE users SET password_hash=?,must_change_password=1 WHERE id=?').run(hashed,targetId);db.prepare('DELETE FROM sessions WHERE user_id=?').run(targetId);audit(db,user.id,'user.password_reset',targetId);});return send(200,{ok:true});
     }
     if(action==='sessions'&&method==='DELETE'){db.prepare('DELETE FROM sessions WHERE user_id=?').run(targetId);audit(db,user.id,'user.sessions_revoke',targetId);return send(200,{ok:true});}
     if(action==='progress'&&method==='GET')return send(200,{user:safeUser(target),progress:summary(db.prepare('SELECT progress FROM profiles WHERE user_id=?').get(targetId).progress)});
    }
    if(path==='/api/admin/audit'&&method==='GET')return send(200,{entries:db.prepare('SELECT a.id,a.action,a.details,a.created_at,actor.username actor,target.username target FROM audit_log a LEFT JOIN users actor ON actor.id=a.actor_id LEFT JOIN users target ON target.id=a.target_id ORDER BY a.id DESC LIMIT 100').all()});
   }
   throw new HttpError(404,'Không tìm thấy chức năng.');
  }catch(error){const status=error instanceof HttpError?error.status:500;if(status===500)console.error('request_failed',error.code||error.name);if(!res.headersSent)send(status,{error:status===500?'Máy chủ chưa xử lý được yêu cầu. Vui lòng thử lại.':error.message});else res.end();}
 });
 server.requestTimeout=15000;server.headersTimeout=10000;server.keepAliveTimeout=5000;server.maxRequestsPerSocket=1000;
 return {server,db,async close(){await new Promise(resolve=>server.close(resolve));db.close();}};
}
