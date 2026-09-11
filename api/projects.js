import{readFileSync,writeFileSync}from'fs';import path from'path';

function parseCookies(str){
  return (str||'').split(';').reduce((a,c)=>{
    const[k,...v]=c.trim().split('=');
    if(k)a[k.trim()]=v.join('=');
    return a;
  },{});
}
const P=()=>path.join(process.cwd(),'data/projects.json');
function isAdmin(req){return!!parseCookies(req.headers.cookie).session;}
function read(){return JSON.parse(readFileSync(P(),'utf8'));}
function save(d){writeFileSync(P(),JSON.stringify(d,null,2),'utf8');}
export default function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();
  const id=req.query.id?parseInt(req.query.id):null;
  const admin=req.query.admin==='1';
  if(req.method==='GET'){
    try{
      const all=read();
      if(admin){if(!isAdmin(req))return res.status(401).json({error:'Unauthorized'});return res.json(all);}
      return res.json(all.filter(p=>p.status==='active').sort((a,b)=>a.display_order-b.display_order));
    }catch{return res.status(500).json({error:'Failed to load'});}
  }
  if(req.method==='POST'){
    if(!isAdmin(req))return res.status(401).json({error:'Unauthorized'});
    try{
      const all=read();
      const newId=all.reduce((m,p)=>Math.max(m,p.id),0)+1;
      const proj={id:newId,status:'active',featured:false,display_order:newId,...req.body};
      all.push(proj);save(all);return res.status(201).json(proj);
    }catch{return res.status(500).json({error:'Failed to create'});}
  }
  if(req.method==='PUT'&&id){
    if(!isAdmin(req))return res.status(401).json({error:'Unauthorized'});
    try{
      const all=read();const i=all.findIndex(p=>p.id===id);
      if(i===-1)return res.status(404).json({error:'Not found'});
      all[i]={...all[i],...req.body,id};save(all);return res.json(all[i]);
    }catch{return res.status(500).json({error:'Failed to update'});}
  }
  if(req.method==='DELETE'&&id){
    if(!isAdmin(req))return res.status(401).json({error:'Unauthorized'});
    try{
      const all=read();const i=all.findIndex(p=>p.id===id);
      if(i===-1)return res.status(404).json({error:'Not found'});
      all.splice(i,1);save(all);return res.json({success:true});
    }catch{return res.status(500).json({error:'Failed to delete'});}
  }
  return res.status(405).json({error:'Method not allowed'});
}
