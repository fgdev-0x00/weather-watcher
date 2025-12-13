import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getUserController } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', authMiddleware, getUserController);

export default userRouter;
