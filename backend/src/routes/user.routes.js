import { Router } from 'express';
import { getUserController } from '#controllers/user.controller';

const userRouter = Router();

userRouter.get('/', getUserController);

export default userRouter;
