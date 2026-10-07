import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';

export function createNeuroLog({endpoint=process.env.NEUROLOG_ENDPOINT, key=process.env.NEUROLOG_INGEST_KEY, source='guest-connect', spool=path.resolve('server/.neurolog-outbox.json'), send=globalThis.fetch}={}) {
  let queue=[]; let sending=false; let retryAt=0; let delay=1000;
  const enabled=Boolean(endpoint&&key);
  if(enabled){try{queue=JSON.parse(fs.readFileSync(spool,'utf8'));if(!Array.isArray(queue))queue=[];}catch(e){if(e.code!=='ENOENT')console.warn('NeuroLog queue could not be read');}}
  function persist(){fs.mkdirSync(path.dirname(spool),{recursive:true});const temp=spool+'.tmp';fs.writeFileSync(temp,JSON.stringify(queue),{mode:0o600});fs.renameSync(temp,spool);}
  function log(message, severity=6, trace){if(!enabled)return;try{if(queue.length>=10000){console.warn('NeuroLog queue full');return;}queue.push({source,message:message.slice(0,10000),severity_level:severity,...(trace?{trace_id:trace}:{})});persist();void flush();}catch{console.warn('NeuroLog could not buffer event');}}
  async function flush(){if(!enabled||sending||Date.now()<retryAt)return;sending=true;try{while(queue.length){const response=await send(endpoint,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key},body:JSON.stringify(queue[0]),signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error('Delivery failed');queue.shift();persist();delay=1000;retryAt=0;}}catch{retryAt=Date.now()+delay;delay=Math.min(delay*2,30000);}finally{sending=false;}}
  const timer=enabled?setInterval(()=>void flush(),1000):null;timer?.unref();
  return {enabled,log,flush,pending:()=>queue.length,close:()=>clearInterval(timer),middleware(req,res,next){if(req.path.startsWith('/api/activity'))return next();const start=performance.now(),trace=randomUUID();res.setHeader('x-request-id',trace);res.on('finish',()=>{const route=req.route?.path;const name=typeof route==='string'&&route.startsWith('/api/')?route:req.path.startsWith('/api/')?'/api/unmatched':'frontend';log(`HTTP ${req.method} ${name} status=${res.statusCode} duration_ms=${(performance.now()-start).toFixed(1)}`,res.statusCode>=500?3:res.statusCode>=400?4:6,trace);});next();}};
}
