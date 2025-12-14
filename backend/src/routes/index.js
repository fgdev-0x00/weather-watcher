import { Router } from 'express';
import { authMiddleware } from '#middlewares/auth.middleware';
import userRouter from '#routes/user.routes';
import authRouter from '#routes/auth.routes';
import cityRouter from '#routes/city.routes';

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/user', authMiddleware, userRouter);
mainRouter.use('/city', authMiddleware, cityRouter);

export default mainRouter;
