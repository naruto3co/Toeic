import {readFileSync} from 'node:fs';
import {openDatabase,transaction,audit,snapshot} from '../server/database.mjs';
import {normalizeAccount,validateProgress} from '../server/progress.ts';
let db;
try{
 const username=normalizeAccount(process.argv[2]),path=process.argv[3];if(!path)throw new Error('Cách dùng: node scripts/import-progress.mjs USERNAME FILE.json [--replace]');
 const input=JSON.parse(readFileSync(path,'utf8')),progress=validateProgress(input.state||input);db=openDatabase();
 const user=db.prepare('SELECT * FROM users WHERE username=?').get(username);if(!user)throw new Error('Hãy tạo tài khoản trước khi nhập tiến độ.');
 const current=snapshot(db,user.id).state,hasData=current.known.length||current.saved.length||Object.keys(current.seen).length||Object.keys(current.scores).length||Object.keys(current.activity).length||Object.keys(current.games.history).length||current.quiz;
 if(hasData&&!process.argv.includes('--replace'))throw new Error('Hồ sơ đã có dữ liệu. Sao lưu trước; thêm --replace nếu muốn ghi đè.');
 transaction(db,()=>{db.prepare('UPDATE profiles SET progress=?,revision=revision+1,mutations=\'[]\',updated_at=? WHERE user_id=?').run(JSON.stringify(progress),new Date().toISOString(),user.id);audit(db,null,'profile.import',user.id);});
 console.log('Đã nhập tiến độ cho '+username+'. Hãy đăng xuất rồi đăng nhập lại trên các thiết bị cũ.');
}catch(error){console.error(error.message);process.exitCode=1;}finally{db?.close();}
