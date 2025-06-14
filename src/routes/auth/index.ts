import { Router } from 'express';
import {
  loginUser,
  logOutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
} from '../../controllers/auth.controller';
import { verifyJwt } from '../../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/login', loginUser);
authRouter.post('/logout', verifyJwt, logOutUser);
authRouter.patch('/refresh-token',  refreshAccessToken);
authRouter.patch('/change-password', verifyJwt, changePassword);
authRouter.get('/get-current-user', verifyJwt, getCurrentUser);

export default authRouter;
