import db from "../utils/db.js";
import bcrypt from 'bcrypt';
import { validateToken } from "../utils/generateToken.js";
import { generateToken, tokenTypes } from "../utils/generateToken.js";

export const loginUserController = (req,res,next) =>{

    const {email,password} = req.body;
    console.log(email,password)
    if(!email || !password){
        return res.status(500).json('Credentials needed')
    }
    if('accessCookie' in req.cookies && 'refreshCookie' in req.cookies){
        return res.status(400).send('User is already logged');
    }
    const userQuery = db.query('SELECT * FROM users WHERE email = ?',[email],(error,result,fields)=>{
        if(error){
            console.error('Something went wrong with the database:', error);
            return res.status(500).send('Something went wrong');
        }else{
            if(result.length > 0){
                if(!bcrypt.compareSync(password, result[0].password)){
                   return res.status(401).send('User credentials invalid');
                }else{
                    const email = result[0].email;
                    const accessToken = generateToken(tokenTypes.accessToken,email);
                    const refreshToken = generateToken(tokenTypes.refreshToken,email)
                    res.cookie('accessCookie',accessToken,{
                        maxAge :3000000,
                        httpOnly:true,
                        secure:false,
                        sameSite:'strict'
                    });

                    res.cookie('refreshCookie',refreshToken,{
                        maxAge:14 * 24 * 60 * 60 * 1000,
                        httpOnly:true,
                        secure:false,
                        sameSite:'strict'
                    })
                    res.status(200).send('User logged successfully!');
                }
            }else{
                res.status(401).send('User credentials invalid');
            }
        }
    });
}

export const registerUserController = (req,res) =>{
    try{
        const {email,username,password} =  req.body;
        const checkUser = db.query('SELECT * FROM users WHERE username = ? OR email = ?',[username,email],async (error,results)=>{
            if(error){
                return res.status(500).send('Something went wrong');
            }
            if(results.length > 0){

               return res.json({status:404,message:'User already exists',userExists:true})
            }else{
                const hashedPassword = await bcrypt.hash(password,parseInt(process.env.HASH_SALT));
                const query = db.query('INSERT INTO users SET ?',{username:username,email:email,password:hashedPassword},(err,result)=>{
                    if(err){
                        res.status(500).send('Something went wrong');
                    }else{
                        res.status(200).json({message:'User created successfully'})
                    }
                })
            }
        })
        
    }catch(error){
        res.status(500).send('Something went wrong');
    }
}
export const getUserProfileController = (req,res,next) =>{
    
    const decodedAccess = validateToken(req.cookies['accessCookie'],tokenTypes.accessToken);

    if (decodedAccess === 'expired') {
        return res.status(400).send('Token has expired');
    }
    if (decodedAccess) {
        const user =db.query('SELECT email,username FROM users WHERE email = ?',[decodedAccess.email],(err,result)=>{
            if(err){
               return res.status(400).send(err);
            }
            res.status(200).send(result[0]);
        });
       
    } else {
        res.status(400).send('Token is invalid');
    }
}

export const logoutUserController = (req,res,next) =>{
    res.clearCookie('accessCookie');
    res.clearCookie('refreshCookie');

    return res.status(200).json({ message: "Logged out successfully" });
}