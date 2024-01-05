import db from "../utils/db.js";

export const postBooksController = (req, res, next) => {
    const {id} = req.body.data;
    const fields =  Object.keys(req.body.data);
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(req.body.data);

    const idExists = db.query(`SELECT id FROM books WHERE id = ? `,[id],(err,result)=>{
        if(result.length >0){
            return res.status(404).send('Value already exists!');
        }
    })
    db.query(
        `INSERT INTO books (${fields.join(', ')}) VALUES (${placeholders})`,
        values,
        (err, result) => {
            if (err) {
                console.log(err)
                return res.status(409).send('Something went wrong');
            }
            res.status(200).send('Book added successfully!');
        }
    );
}
export const getBooksController = (req,res,next) =>{
    const email = req.body.email;
    console.log('email:',email);
    db.query(`SELECT * FROM books WHERE  user_email = ?`,[email],(err,result) =>{
        if(err){
           return res.status(400).send('Something went wrong');
        }
        console.log('Result ok')
        res.status(200).json(result);
    })
}
export const updateBooksController = (req,res,next) =>{
    const fields =  Object.keys(req.body.data);
    fields.pop()
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(req.body.data);
    const updateDay = db.query(`UPDATE books SET ${fields.join('=?, ')+'=?'} WHERE id = ?`,values,(err,result)=>{
        if(err){
            console.log(err)
            return res.status(400).send('Something went wrong with the update');
        }
        res.status(200).send('Day updated successfully');
    })
    const {title,description,author,enjoys,dislikes,learns,feelings,id} = req.body.data;
}

export const deleteBooksController = (req,res,next) =>{
    const bookId = req.params.id;

    const deleteValue = db.query('DELETE FROM books WHERE id = ? ',[bookId],(err,result)=>{
        if(err){
            return res.status(400).send('Something went wrong with the delete')
        }
        res.status(200).send('Deleted successfully')
    });
}