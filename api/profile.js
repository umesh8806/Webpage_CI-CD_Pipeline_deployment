import{readFileSync,writeFileSync}from'fs';import path from'path';

function parseCookies(str){
  return (str||'').split(';').reduce((a,c)=>{
    const[k,...v]=c.trim().split('=');
    if(k)a[k.trim()]=v.join('=');
    return a;
  },{});
}
const P=()=>path.join(process.cwd(),'data/profile.json');
function isAdmin(req){return!!parseCookies(req.headers.cookie).session;}
export default function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();
  if(req.method==='GET'){
    try{return res.status(200).json(JSON.parse(readFileSync(P(),'utf8')));}
    catch{return res.status(500).json({error:'Failed to load profile'});}
  }
  if(req.method==='PUT'){
    if(!isAdmin(req))return res.status(401).json({error:'Unauthorized'});
    try{
      const cur=JSON.parse(readFileSync(P(),'utf8'));
      const upd={...cur,...req.body,id:cur.id};
      writeFileSync(P(),JSON.stringify(upd,null,2),'utf8');
      return res.status(200).json(upd);
    }catch{return res.status(500).json({error:'Failed to save'});}
  }
  return res.status(405).json({error:'Method not allowed'});
}
