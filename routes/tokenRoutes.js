import express from 'express';
import {regenerateTokenController} from '../controllers/tokenController.js';
const tokenRoutes = express.Router();

tokenRoutes.post('/regenerate-token',regenerateTokenController);

export default tokenRoutes;