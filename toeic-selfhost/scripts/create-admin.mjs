import {openDatabase,createUser} from '../server/database.mjs';
import {normalizeAccount} from '../server/progress.ts';
import {hashPassword} from '../server/security.mjs';
import {passwordInput} from './password-input.mjs';
let db;
try{
 const username=normalizeAccount(process.argv[2]||'admin');db=openDatabase();
 if(db.prepare('SELECT id FROM users WHERE username=?').get(username))throw new Error('Tên tài khoản đã tồn tại. Dùng script recover-admin để phục hồi quyền truy cập.');
 const password=await passwordInput();createUser(db,{username,displayName:username,passwordHash:await hashPassword(password),role:'admin',mustChange:false});
 console.log('Đã tạo admin: '+username);
}catch(error){console.error(error.message);process.exitCode=1;}finally{db?.close();}
