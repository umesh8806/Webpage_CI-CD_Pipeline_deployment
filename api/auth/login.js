import{readFileSync}from'fs';import path from'path';
export default function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const{email,password}=req.body||{};
  if(!email||!password)return res.status(400).json({error:'Email and password required'});
  try{
    const users=JSON.parse(readFileSync(path.join(process.cwd(),'data/users.json'),'utf8'));
    const user=users.find(u=>u.email===email&&u.password===password);
    if(!user)return res.status(401).json({error:'Invalid credentials'});
    const token=Buffer.from(user.id+':'+user.email+':'+Date.now()).toString('base64');
    res.setHeader('Set-Cookie','session='+token+'; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400');
    return res.status(200).json({authenticated:true,email:user.email,name:user.name});
  }catch(e){console.error(e);return res.status(500).json({error:'Server error'});}
}
