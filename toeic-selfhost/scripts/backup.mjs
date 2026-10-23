import {backup} from 'node:sqlite';
import {mkdirSync,chmodSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {openDatabase} from '../server/database.mjs';
const db=openDatabase(),folder=resolve(dirname(process.env.DB_PATH||'data/toeic.sqlite'),'backups');
try{mkdirSync(folder,{recursive:true,mode:0o700});const output=join(folder,'toeic-'+new Date().toISOString().replace(/[:.]/g,'-')+'.sqlite');await backup(db,output);chmodSync(output,0o600);console.log(output);}finally{db.close();}
