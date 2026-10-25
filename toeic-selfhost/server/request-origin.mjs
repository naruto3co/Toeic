// Exact-origin verification, including the standard Referer fallback when Origin
// is absent. An explicit invalid/null/mismatched Origin never uses the fallback.
function httpURL(value){
 if(typeof value!=='string'||!value||/[\u0000-\u0020\u007f]/.test(value))return null;
 try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u:null;}catch{return null;}
}
export function checkRequestOrigin(headers,expectedOrigin){
 if(headers['sec-fetch-site']==='cross-site')return {ok:false,reason:'cross_site'};
 if(headers.origin!==undefined){
  const u=httpURL(headers.origin);
  if(!u||headers.origin!==u.origin)return {ok:false,reason:'invalid_origin'};
  return u.origin===expectedOrigin?{ok:true,source:'origin'}:{ok:false,reason:'origin_mismatch'};
 }
 const ref=httpURL(headers.referer);
 if(!ref)return {ok:false,reason:'missing_source'};
 return ref.origin===expectedOrigin?{ok:true,source:'referer'}:{ok:false,reason:'referer_mismatch'};
}
export function originDiagnostic(headers,expectedOrigin,reason){
 // Record origin only: never a Referer path/query, cookies, credentials or body.
 const received=headers.origin===undefined?'[missing]':headers.origin==='null'?'null':httpURL(headers.origin)?.origin||'[invalid]';
 return {event:'origin_rejected',reason,expectedOrigin,receivedOrigin:received,refererOrigin:httpURL(headers.referer)?.origin||'[missing-or-invalid]',fetchSite:['same-origin','same-site','cross-site','none'].includes(headers['sec-fetch-site'])?headers['sec-fetch-site']:'[missing-or-unknown]'};
}
