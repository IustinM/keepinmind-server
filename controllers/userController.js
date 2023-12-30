import db from "../utils/db.js";
import bcrypt from 'bcrypt';
import { validateToken } from "../utils/generateToken.js";
import { generateToken, tokenTypes } from "../utils/generateToken.js";

export const loginUserController = (req,res,next) =>{

    const {email,password} = req.body;

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
                    const refreshToken = generateToken(tokenTypes.refreshToken,email);

                    console.log(accessToken);
                    console.log(refreshToken);
                    console.log('here')
                    
                    res.cookie('accessCookie',accessToken,{
                        maxAge :3000000,
                        httpOnly:true,
                        secure:true,
                        sameSite:'none'
                    });
                    
                    res.cookie('refreshCookie',refreshToken,{
                        maxAge:14 * 24 * 60 * 60 * 1000,
                        httpOnly:true,
                        secure:true,
                        sameSite:'none'
                    })
                    res.status(200).json({
                        message:'User logged successfully!',
                        username:result[0].username,
                        email:result[0].email,
                    });
                    console.log(res.cookie)
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
                        console.log(err)
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
        const user =db.query('SELECT email,username FROM users WHERE email = ?',[decodedAccess.email],(err,result)=>{
            if(err){
               return res.status(400).send(err);
            }
            res.status(200).send(result[0]);
        });
}

export const updateUserProfileController = (req,res,next) => {
    try{
        const {email,username,newEmail,newUsername} =  req.body;
        const checkUser = db.query('SELECT * FROM users WHERE username = ? OR email = ?',[username,email],async (error,results)=>{
            if(error){
                return res.status(500).send('Something went wrong');
            }
            if(results.length === 0){
                return res.status(500).json({status:404,message:'User does not  exists',userExists:false})
            }else{
        
                const values = [];
                let sqlString = ``;
                if(newEmail && newUsername){
                    sqlString=`UPDATE users SET email =? ,username=? WHERE email = ? AND username = ?`;          
                    values.push(newEmail)
                    values.push(newUsername)
                }else if(newEmail && !newUsername){
                    values.push(newEmail)
                    sqlString=`UPDATE users SET email =? WHERE email = ? AND username = ?`;
                }else if(!newEmail && newUsername){
                    values.push(newUsername)
                    sqlString=`UPDATE users SET username =? WHERE email = ? AND username = ?`;
                }
            
                const updateUser = db.query(sqlString,[...values,email,username],async (err,result)=>{
                    if(err){
                        return res.status(400).send('Something went wrong with the update'); 
                    }
                    const checkUser = db.query('SELECT * FROM users WHERE username = ? OR email = ?',[username,email],async (error,updateResult)=>{
                        if(error){
                            return res.status(400).send('Something went wrong with the result');
                        }
                        return res.status(200).json({message:'User updated successfully',email:updateResult[0].email,username:updateResult[0].username});
                    })
                })
            
            }
        })
    }catch(err){
        return res.status(500).send(err)
    }
}
export const updatePasswordController = async (req, res, next) => {
    const { email, newPassword } = req.body;

    try {
        const [results] = await db.promise().query('SELECT * FROM users WHERE  email = ?', [ email]);
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(newPassword, user.password);

        if (passwordMatch) {
            return res.status(401).json({ message: 'Password already used' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.HASH_SALT));
        const [updateResult] = await db.promise().query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
        
        if (updateResult.affectedRows === 0) {
            return res.status(500).send('No update made to the user');
        }

        return res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while updating the password' });
    }
};
 
export const logoutUserController = (req,res,next) =>{
    res.clearCookie('accessCookie');
    res.clearCookie('refreshCookie');
    return res.status(200).json({ message: "Logged out successfully" });
}