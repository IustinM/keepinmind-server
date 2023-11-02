import { tokenTypes, validateToken } from "../utils/generateToken.js";
export const verifyTokenMiddleware = (req,res,next) =>{
    const accessToken = req.cookies['accessCookie'];

    console.log('accessCookie:',accessToken)
    if(!accessToken){
        res.status(401).send('Token is missing!');
    }

    const decodedAccess = validateToken(accessToken,tokenTypes.accessToken);
    if(decodedAccess !== 'expired'){
        req.userData = decodedAccess;
        next();
    } else{
        console.log('')
        res.status(401).send('Token is invalid');
    }
}