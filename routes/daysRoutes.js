import express from "express";
import { postDayController,getDaysController,deleteDaysController,updateDaysController } from "../controllers/daysController.js";
import { verifyTokenMiddleware } from "../middleware/tokenMiddleware.js";

const daysRouter = express.Router();

daysRouter.use(verifyTokenMiddleware);
daysRouter.post('/',postDayController);
daysRouter.put('/',updateDaysController);
daysRouter.get('/',getDaysController);
daysRouter.delete('/:id',deleteDaysController);

export default daysRouter;