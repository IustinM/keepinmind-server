import express from 'express';
import { registerUserController,loginUserController,logoutUserController,updateUserProfileController,getUserProfileController, updatePasswordController } from '../controllers/userController.js';
import { verifyTokenMiddleware } from '../middleware/tokenMiddleware.js';

const userRoutes = express.Router();

userRoutes.post('/register',registerUserController);
userRoutes.post('/login',loginUserController);
userRoutes.get('/logout',logoutUserController);
userRoutes.post('/get-profile',verifyTokenMiddleware,getUserProfileController);
userRoutes.post('/update-profile',verifyTokenMiddleware,updateUserProfileController);
userRoutes.post('/update-password',updatePasswordController);
export default userRoutes;