// Run by the server operator only. Never exposed over HTTP.
import {openDatabase,transaction,audit} from '../server/database.mjs';
import {normalizeAccount} from '../server/progress.ts';
import {hashPassword} from '../server/security.mjs';
import {passwordInput} from './password-input.mjs';
let db;
try{const username=normalizeAccount(process.argv[2]);db=openDatabase();const user=db.prepare('SELECT * FROM users WHERE username=? AND role=\'admin\'').get(username);if(!user)throw new Error('Không tìm thấy admin này.');const password=await passwordInput(),hash=await hashPassword(password);transaction(db,()=>{db.prepare('UPDATE users SET password_hash=?,active=1,must_change_password=0 WHERE id=?').run(hash,user.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);audit(db,null,'admin.recover',user.id);});console.log('Đã phục hồi admin: '+username);}catch(error){console.error(error.message);process.exitCode=1;}finally{db?.close();}
