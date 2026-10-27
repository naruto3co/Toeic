import {scrypt,randomBytes,timingSafeEqual,createHash,createHmac} from 'node:crypto';
import {promisify} from 'node:util';
const derive=promisify(scrypt),N=32768,r=8,p=3;
const SESSION_MAX_AGE_SECONDS=365*24*60*60;
export const digest=value=>createHash('sha256').update(value).digest('hex');
export const csrfFor=token=>createHmac('sha256',token).update('toeic-csrf-v1').digest('hex');
export class HttpError extends Error{constructor(status,message){super(message);this.status=status;}}
export function passwordPolicy(value){if(typeof value!=='string'||value.length<12||value.length>128)throw new HttpError(400,'Mật khẩu cần từ 12 đến 128 ký tự.');return value;}
let working=0;
async function key(password,salt){if(working>=4)throw new HttpError(503,'Máy chủ đang bận. Bạn thử lại sau vài giây nhé.');working++;try{return await derive(password,salt,64,{N,r,p,maxmem:64*1024*1024});}finally{working--;}}
export async function hashPassword(password){passwordPolicy(password);const salt=randomBytes(16).toString('hex');return `scrypt$${N}$${r}$${p}$${salt}$${(await key(password,salt)).toString('hex')}`;}
export async function verifyPassword(password,encoded){if(typeof password!=='string'||password.length>128)return false;const parts=encoded?.split('$');if(parts?.length!==6||parts[0]!=='scrypt'||parts[1]!==String(N)||parts[2]!==String(r)||parts[3]!==String(p))return false;const actual=await key(password,parts[4]),expected=Buffer.from(parts[5],'hex');return actual.length===expected.length&&timingSafeEqual(actual,expected);}
export function equal(a,b){const x=Buffer.from(String(a||'')),y=Buffer.from(String(b||''));return x.length===y.length&&timingSafeEqual(x,y);}
export function newSession(db,userId){const token=randomBytes(32).toString('base64url'),expires=Date.now()+SESSION_MAX_AGE_SECONDS*1000;db.prepare('DELETE FROM sessions WHERE expires_at<?').run(Date.now());db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(digest(token),userId,expires);return {token,expires,csrf:csrfFor(token)};}
export function sessionCookie(token,{secure=true,clear=false}={}){return `toeic_session=${clear?'':token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${clear?0:SESSION_MAX_AGE_SECONDS}${secure?'; Secure':''}`;}
export function sessionFrom(db,request){const cookie=request.headers.cookie||'',match=cookie.match(/(?:^|;\s*)toeic_session=([A-Za-z0-9_-]{43})(?:;|$)/);if(!match)return null;const token=match[1];const user=db.prepare('SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1').get(digest(token),Date.now());return user?{user,token,csrf:csrfFor(token)}:null;}
export function loginLimit(db,key,maximum,message='Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.'){const now=Date.now();db.prepare('DELETE FROM login_limits WHERE reset_at<?').run(now);const row=db.prepare('SELECT * FROM login_limits WHERE key=?').get(key);if(row?.attempts>=maximum)throw new HttpError(429,message);db.prepare('INSERT INTO login_limits(key,attempts,reset_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=attempts+1').run(key,now+15*60000);}
