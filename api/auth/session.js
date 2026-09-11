import{readFileSync}from'fs';import path from'path';

function parseCookies(str){
  return (str||'').split(';').reduce((a,c)=>{
    const[k,...v]=c.trim().split('=');
    if(k)a[k.trim()]=v.join('=');
    return a;
  },{});
}
export default function handler(req,res){
  const cookies=parseCookies(req.headers.cookie);
  const token=cookies.session;
  if(!token)return res.status(200).json({authenticated:false});
  try{
    const decoded=Buffer.from(token,'base64').toString('utf8');
    const[userId,email]=decoded.split(':');
    const users=JSON.parse(readFileSync(path.join(process.cwd(),'data/users.json'),'utf8'));
    const user=users.find(u=>u.id===parseInt(userId)&&u.email===email);
    if(!user)return res.status(200).json({authenticated:false});
    return res.status(200).json({authenticated:true,email:user.email,name:user.name});
  }catch{return res.status(200).json({authenticated:false});}
}
