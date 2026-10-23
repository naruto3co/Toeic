import {createApp} from './app.mjs';
const port=Number(process.env.PORT||3000),host=process.env.HOST||'0.0.0.0';
if(process.env.NODE_ENV==='production'&&!process.env.PUBLIC_ORIGIN)throw new Error('Cần đặt PUBLIC_ORIGIN trước khi chạy production.');
const app=await createApp();
app.server.listen(port,host,()=>console.log(`TOEIC listening on ${host}:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exit(0);});
