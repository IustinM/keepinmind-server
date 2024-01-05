import db from "../utils/db.js";

export const postDayController = (req, res, next) => {
    const {id} = req.body.data;
    const fields =  Object.keys(req.body.data);
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(req.body.data);

    const idExists = db.query(`SELECT id FROM days WHERE id = ? `,[id],(err,result)=>{
        if(result.length >0){
            return res.status(404).send('Value already exists!');
        }
    })
    db.query(
        `INSERT INTO days (${fields.join(', ')}) VALUES (${placeholders})`,
        values,
        (err, result) => {
            console.log(result)
            if (err) {
                console.log(err)
                return res.status(409).send('Something went wrong');
            }
            res.status(200).send('Day added successfully!');
        }
    );
}
export const getDaysController = (req,res,next) =>{
    const email = req.body.email;
    db.query(`SELECT * FROM days WHERE  user_email = ?`,[email],(err,result) =>{
        if(err){
           return res.status(400).send('Something went wrong');
        }
        console.log('Result ok')
        res.status(200).json(result);
    })
 
}
export const updateDaysController = (req,res,next) =>{

    const fields =  Object.keys(req.body.data);
    fields.pop()
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(req.body.data);
    const updateDay = db.query(`UPDATE days SET ${fields.join('=?, ')+'=?'} WHERE id = ?`,values,(err,result)=>{
        if(err){
            console.log(err)
            return res.status(400).send('Something went wrong with the update');
        }
        res.status(200).send('Day updated successfully');
    })
}

export const deleteDaysController = (req,res,next) =>{
    const daysId = req.params.id;

    const deleteValue = db.query('DELETE FROM days WHERE id = ? ',[daysId],(err,result)=>{
        if(err){
            return res.status(400).send('Something went wrong with the delete')
        }
        res.status(200).send('Deleted successfully')
    });
}