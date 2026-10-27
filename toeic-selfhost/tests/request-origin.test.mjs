import test from 'node:test';
import assert from 'node:assert/strict';
import {checkRequestOrigin,originDiagnostic} from '../server/request-origin.mjs';
const trusted='https://learn.example.test';
test('exact Origin remains authoritative, independent of optional metadata or Referer',()=>{
 for(const headers of [{origin:trusted},{origin:trusted,'sec-fetch-site':'same-origin'},{origin:trusted,referer:'https://evil.test/'}])assert.equal(checkRequestOrigin(headers,trusted).ok,true);
 for(const value of ['null','',trusted+'/',trusted+'/path','http://learn.example.test',trusted+':8081',trusted+'.evil.test','https://evil.test',trusted+' https://evil.test',[],null])assert.equal(checkRequestOrigin({origin:value,referer:trusted+'/'},trusted).ok,false,String(value));
});
test('missing Origin uses the exact full Referer origin, including scheme and port',()=>{
 assert.equal(checkRequestOrigin({referer:trusted+'/profile?from=phone'},trusted).ok,true);
 assert.equal(checkRequestOrigin({referer:'http://192.168.79.109:8081/'},'http://192.168.79.109:8081').ok,true);
 for(const referer of [undefined,'',trusted+'.evil.test/',trusted+':8081/',trusted+'@evil.test/', 'http://learn.example.test/', '/relative', 'null', 'https://user:password@learn.example.test/', 'https://learn.example.test\n/'])assert.equal(checkRequestOrigin({referer},trusted).ok,false,String(referer));
 assert.equal(checkRequestOrigin({'sec-fetch-site':'same-origin'},trusted).ok,false);
});
test('cross-site metadata still blocks even with otherwise matching origin proof',()=>{
 assert.equal(checkRequestOrigin({origin:trusted,'sec-fetch-site':'cross-site'},trusted).ok,false);
 assert.equal(checkRequestOrigin({referer:trusted+'/','sec-fetch-site':'cross-site'},trusted).ok,false);
});
test('failure diagnostics contain no credentials, query strings or cookie values',()=>{
 const row=originDiagnostic({origin:undefined,referer:trusted+'/login?password=do-not-log&token=secret',cookie:'toeic_session=secret',authorization:'Bearer secret'},trusted,'missing_source');
 assert.equal(row.refererOrigin,trusted);assert.equal(row.receivedOrigin,'[missing]');assert.equal(JSON.stringify(row).includes('secret'),false);assert.equal(JSON.stringify(row).includes('password'),false);
});
