import express from 'express';
import { registerUserController,loginUserController,logoutUserController,getUserProfileController } from '../controllers/userController.js';
import { verifyTokenMiddleware } from '../middleware/tokenMiddleware.js';

const userRoutes = express.Router();

userRoutes.post('/register',registerUserController);
userRoutes.post('/login',loginUserController);
userRoutes.get('/logout',logoutUserController);
userRoutes.post('/get-profile',verifyTokenMiddleware,getUserProfileController);
export default userRoutes;