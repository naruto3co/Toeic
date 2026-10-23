import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,chmodSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {emptyProgress} from './progress.ts';

export function openDatabase(path=process.env.DB_PATH||'data/toeic.sqlite') {
 if(path!==':memory:'){path=resolve(path);mkdirSync(dirname(path),{recursive:true,mode:0o700});}
 const db=new DatabaseSync(path);
 if(path!==':memory:')chmodSync(path,0o600);
 db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY,applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
 CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY,username TEXT NOT NULL UNIQUE,display_name TEXT NOT NULL,password_hash TEXT NOT NULL,
 role TEXT NOT NULL CHECK(role IN ('admin','student')),active INTEGER NOT NULL DEFAULT 1 CHECK(active IN(0,1)),
 must_change_password INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,last_login_at TEXT);
 CREATE TABLE IF NOT EXISTS profiles(user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 progress TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 0,mutations TEXT NOT NULL DEFAULT '[]',updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
 CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
 CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
 CREATE TABLE IF NOT EXISTS audit_log(id INTEGER PRIMARY KEY,actor_id INTEGER REFERENCES users(id),action TEXT NOT NULL,
 target_id INTEGER REFERENCES users(id),details TEXT NOT NULL DEFAULT '{}',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
 CREATE TABLE IF NOT EXISTS login_limits(key TEXT PRIMARY KEY,attempts INTEGER NOT NULL,reset_at INTEGER NOT NULL);
 INSERT OR IGNORE INTO schema_migrations(version) VALUES(1);`);
 return db;
}
export function transaction(db,fn){db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(error){db.exec('ROLLBACK');throw error;}}
export function createUser(db,{username,displayName,passwordHash,role='student',mustChange=true},actor=null){
 return transaction(db,()=>{
  const row=db.prepare('INSERT INTO users(username,display_name,password_hash,role,must_change_password) VALUES(?,?,?,?,?) RETURNING *').get(username,displayName,passwordHash,role,mustChange?1:0);
  db.prepare('INSERT INTO profiles(user_id,progress) VALUES(?,?)').run(row.id,JSON.stringify(emptyProgress()));
  audit(db,actor,'user.create',row.id,{role});return row;
 });
}
export function audit(db,actor,action,target=null,details={}){db.prepare('INSERT INTO audit_log(actor_id,action,target_id,details) VALUES(?,?,?,?)').run(actor,action,target,JSON.stringify(details));}
export function safeUser(row){return {id:row.id,username:row.username,displayName:row.display_name,role:row.role,active:!!row.active,mustChangePassword:!!row.must_change_password,createdAt:row.created_at,lastLoginAt:row.last_login_at};}
export function snapshot(db,userId){const p=db.prepare('SELECT * FROM profiles WHERE user_id=?').get(userId);return {state:JSON.parse(p.progress),revision:p.revision,mutations:JSON.parse(p.mutations),updatedAt:p.updated_at};}
