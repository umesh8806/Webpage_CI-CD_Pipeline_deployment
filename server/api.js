// server/api.js — Local dev server (mirrors Vercel serverless functions)
import express from 'express';
import cors    from 'cors';
import cookieParser from 'cookie-parser';
import { readFileSync, writeFileSync } from 'fs';
import path    from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT  = path.resolve(__dirname, '..');
const DATA  = path.join(ROOT, 'data');
const PORT  = parseInt(process.env.PORT||'3000',10);

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(ROOT));

// ── helpers ──────────────────────────────────────────────────────────────────
const rd = f => JSON.parse(readFileSync(path.join(DATA,f),'utf8'));
const wr = (f,d) => writeFileSync(path.join(DATA,f),JSON.stringify(d,null,2),'utf8');
const mkToken = u => Buffer.from(u.id+':'+u.email+':'+Date.now()).toString('base64');
function getUser(req){
  const t=req.cookies?.session;
  if(!t)return null;
  try{
    const[id,email]=Buffer.from(t,'base64').toString().split(':');
    return rd('users.json').find(u=>u.id===parseInt(id)&&u.email===email)||null;
  }catch{return null;}
}
const auth=(req,res,next)=>getUser(req)?next():res.status(401).json({error:'Unauthorized'});

// ── Auth ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/login',(req,res)=>{
  const{email,password}=req.body||{};
  if(!email||!password)return res.status(400).json({error:'Fields required'});
  const user=rd('users.json').find(u=>u.email===email&&u.password===password);
  if(!user)return res.status(401).json({error:'Invalid credentials'});
  res.cookie('session',mkToken(user),{httpOnly:true,maxAge:86400000,sameSite:'lax'});
  res.json({authenticated:true,email:user.email,name:user.name});
});

app.get('/api/auth/session',(req,res)=>{
  const u=getUser(req);
  if(!u)return res.json({authenticated:false});
  res.json({authenticated:true,email:u.email,name:u.name});
});

app.post('/api/auth/logout',(req,res)=>{
  res.clearCookie('session');res.json({success:true});
});

// ── Profile ──────────────────────────────────────────────────────────────────
app.get('/api/profile',(req,res)=>{
  try{res.json(rd('profile.json'));}catch{res.status(500).json({error:'Failed'});}
});

app.put('/api/profile',auth,(req,res)=>{
  try{
    const cur=rd('profile.json');
    const upd={...cur,...req.body,id:cur.id};
    wr('profile.json',upd);res.json(upd);
  }catch{res.status(500).json({error:'Save failed'});}
});

// ── Projects ─────────────────────────────────────────────────────────────────
app.get('/api/projects',(req,res)=>{
  try{res.json(rd('projects.json').filter(p=>p.status==='active').sort((a,b)=>a.display_order-b.display_order));}
  catch{res.status(500).json({error:'Failed'});}
});

app.get('/api/projects/admin',auth,(req,res)=>{
  try{res.json(rd('projects.json'));}catch{res.status(500).json({error:'Failed'});}
});

app.post('/api/projects',auth,(req,res)=>{
  try{
    const all=rd('projects.json');
    const id=all.reduce((m,p)=>Math.max(m,p.id),0)+1;
    const p={id,status:'active',featured:false,display_order:id,...req.body};
    all.push(p);wr('projects.json',all);res.status(201).json(p);
  }catch{res.status(500).json({error:'Failed'});}
});

app.put('/api/projects/:id',auth,(req,res)=>{
  try{
    const all=rd('projects.json');const id=parseInt(req.params.id);
    const i=all.findIndex(p=>p.id===id);
    if(i===-1)return res.status(404).json({error:'Not found'});
    all[i]={...all[i],...req.body,id};wr('projects.json',all);res.json(all[i]);
  }catch{res.status(500).json({error:'Failed'});}
});

app.delete('/api/projects/:id',auth,(req,res)=>{
  try{
    const all=rd('projects.json');const id=parseInt(req.params.id);
    const i=all.findIndex(p=>p.id===id);
    if(i===-1)return res.status(404).json({error:'Not found'});
    all.splice(i,1);wr('projects.json',all);res.json({success:true});
  }catch{res.status(500).json({error:'Failed'});}
});

app.listen(PORT,()=>{
  console.log('\n Portfolio CMS  →  http://localhost:'+PORT);
  console.log(' Admin          →  http://localhost:'+PORT+'/admin/login.html');
  console.log(' Login          →  admin@portfolio.com  /  portfolio_admin_2026\n');
});
