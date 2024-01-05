import db from "../utils/db.js";

export const postMovieController = (req, res, next) => {
    const {id} = req.body.data;
    const fields =  Object.keys(req.body.data);
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(req.body.data);

    const idExists = db.query(`SELECT id FROM movies WHERE id = ? `,[id],(err,result)=>{
        if(result.length >0){
            return res.status(404).send('Value already exists!');
        }
    })
    db.query(
        `INSERT INTO movies (${fields.join(', ')}) VALUES (${placeholders})`,
        values,
        (err, result) => {
            if (err) {
                console.log(err)
                return res.status(409).send('Something went wrong');
            }
            res.status(200).send('Movie added successfully!');
        }
    );
}
export const getMoviesController = (req,res,next) =>{
    const email = req.body.email;
    db.query(`SELECT * FROM movies WHERE  user_email = ?`,[email],(err,result) =>{
        if(err){
           return res.status(400).send('Something went wrong');
        }
        res.status(200).json(result);
    })
}
export const updateMoviesController = (req,res,next) =>{

    const {id} = req.body.data;
    const fields =  Object.keys(req.body.data);
    fields.pop()
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(req.body.data);
    const updateDay = db.query(`UPDATE movies SET ${fields.join('=?, ')+'=?'} WHERE id = ?`,values,(err,result)=>{
        if(err){
            console.log(err)
            return res.status(400).send('Something went wrong with the update');
        }
        res.status(200).send('Day updated successfully');
    })
}

export const deleteMoviesController = (req,res,next) =>{
    const moviesId = req.params.id;
    const deleteValue = db.query('DELETE FROM movies WHERE id = ? ',[moviesId],(err,result)=>{
        if(err){
            return res.status(400).send('Something went wrong with the delete')
        }
        res.status(200).send('Deleted successfully')
    });
}