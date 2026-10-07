import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {EventEmitter} from 'node:events';
import {createNeuroLog} from './neurolog.js';
test('sanitized request logs are delivered without guest information',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'guest-neurolog-')),sent=[];
 const logger=createNeuroLog({endpoint:'https://example.test/ingest',key:'test',spool:path.join(dir,'queue.json'),send:async(u,o)=>{sent.push(JSON.parse(o.body));return{ok:true};}});
 const res=new EventEmitter();res.statusCode=400;res.setHeader=()=>{};
 logger.middleware({method:'POST',path:'/api/invitations/send',route:{path:'/api/invitations/send'},body:{email:'private@example.test'},headers:{'x-api-key':'private'}},res,()=>{});res.emit('finish');
 await new Promise(r=>setTimeout(r,20));assert.equal(sent[0].source,'guest-connect');assert.equal(sent[0].severity_level,4);assert.ok(sent[0].trace_id);assert.ok(!JSON.stringify(sent).includes('private'));
 logger.close();fs.rmSync(dir,{recursive:true,force:true});
});
test('failed delivery remains durable across restart',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'guest-neurolog-')),spool=path.join(dir,'queue.json');
 const first=createNeuroLog({endpoint:'https://example.test/ingest',key:'test',spool,send:async()=>{throw Error('Offline');}});first.log('Database unavailable',3);await new Promise(r=>setTimeout(r,20));assert.equal(first.pending(),1);first.close();
 const sent=[];const second=createNeuroLog({endpoint:'https://example.test/ingest',key:'test',spool,send:async(u,o)=>{sent.push(JSON.parse(o.body));return{ok:true};}});await second.flush();assert.equal(second.pending(),0);assert.equal(sent[0].severity_level,3);second.close();fs.rmSync(dir,{recursive:true,force:true});
});
