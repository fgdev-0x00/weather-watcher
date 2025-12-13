import { Router } from 'express';
import userRouter from './user.routes.js';
import authRouter from './auth.routes.js';

const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/auth', authRouter);

export default mainRouter;
