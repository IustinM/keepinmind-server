import express from "express";
import { postMovieController,getMoviesController,deleteMoviesController,updateMoviesController } from "../controllers/moviesController.js";
import { verifyTokenMiddleware } from "../middleware/tokenMiddleware.js";

const moviesRouter = express.Router();

moviesRouter.use(verifyTokenMiddleware);
moviesRouter.post('/',postMovieController);
moviesRouter.put('/',updateMoviesController);
moviesRouter.get('/',getMoviesController);
moviesRouter.delete('/:id',deleteMoviesController);

export default moviesRouter;