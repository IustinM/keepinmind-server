import express from "express";
import { postBooksController,getBooksController,deleteBooksController,updateBooksController } from "../controllers/booksController.js";
import { verifyTokenMiddleware } from "../middleware/tokenMiddleware.js";

const booksRouter = express.Router();

booksRouter.use(verifyTokenMiddleware);
booksRouter.post('/',postBooksController);
booksRouter.put('/',updateBooksController);
booksRouter.get('/',getBooksController);
booksRouter.delete('/:id',deleteBooksController);

export default booksRouter;