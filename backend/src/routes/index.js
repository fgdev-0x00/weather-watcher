import { Router } from 'express';
import { authMiddleware } from '#middlewares/auth.middleware';
import userRouter from '#routes/user.routes';
import authRouter from '#routes/auth.routes';

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/user', authMiddleware, userRouter);

export default mainRouter;
