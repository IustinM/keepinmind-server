import express from 'express';
import userRoutes from './routes/userRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import booksRouter from './routes/booksRoutes.js';
import daysRouter from './routes/daysRoutes.js';
import moviesRouter from './routes/moviesRoutes.js';

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'https://iustinm.github.io',
    credentials: true
}));
dotenv.config();
app.use(express.json());
app.use('/',userRoutes);
app.use('/books',booksRouter);
app.use('/movies',moviesRouter);
app.use('/get-data',(req,res)=>{
    res.status(200).json({message:'Server is running ok'})
})
app.use('/days',daysRouter);
app.use('/',tokenRoutes);

app.listen(process.env.PORT,()=>console.log(`Server is running in port ${process.env.PORT}`));