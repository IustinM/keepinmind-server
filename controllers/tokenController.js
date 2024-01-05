import { tokenTypes, validateToken,generateToken } from "../utils/generateToken.js";

export const regenerateTokenController = (req,res,next) =>{

    if(!req.cookies['refreshCookie']){
        res.status(500).json({message:'Token is missing',missingToken:true})    
    }
    const decodedRefresh = validateToken(req.cookies['refreshCookie'],tokenTypes.refreshToken);
  
    if(!decodedRefresh){
        return res.status(400).json({message:"Token is invalid"})
    }
    
    const decodedAccess = validateToken(req.cookies['accessCookie'],tokenTypes.accessToken);
    
    if(decodedAccess && decodedAccess != 'expired'){
        return res.status(200).json({message:"Token is still valid"})
    }
    const email = decodedRefresh.email;
    
    if(!email){
        return res.status(500).json('No valid email')
    }
    const newAcccessToken =generateToken(tokenTypes.accessToken,email);
    res.cookie('accessCookie',newAcccessToken,{
        maxAge :3000000,
        httpOnly:true,
        secure:true,
        sameSite:'None'
    });
    res.status(200).send('Token created successfully');
    
}