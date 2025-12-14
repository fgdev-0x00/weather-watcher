import { Router } from 'express';
import {  getCities } from '#controllers/city.controllers';

const cityRouter = Router();

cityRouter.get('/', getCities);

export default cityRouter;
