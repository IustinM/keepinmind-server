import { tokenTypes, validateToken } from "../utils/generateToken.js";
export const verifyTokenMiddleware = (req,res,next) =>{
    const admin = req.body.admin 
    const accessToken = req.cookies['accessCookie'];
    if(!admin){
        if(!accessToken){
            return res.status(401).send('Token is missing!');
        }
        
        const decodedAccess = validateToken(accessToken,tokenTypes.accessToken);
        if(decodedAccess !== 'expired'){
            req.userData = decodedAccess;
            next();
        } else{
            console.log('token is invalid')
            return res.status(401).send('Token is invalid');
        }
    }else{
        next()
    }
}