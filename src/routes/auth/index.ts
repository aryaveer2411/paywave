import { Router } from 'express';
import { loginUser, logOutUser, refreshAccessToken, changePassword, getCurrentUser } from '../../controllers/auth.controller';


const authRouter = Router();


authRouter.post('/login', loginUser);
authRouter.post('/logout', logOutUser);
authRouter.patch('/refresh-token', refreshAccessToken);
authRouter.patch('/change-password', changePassword);
authRouter.get('/get-current-user', getCurrentUser);

export default authRouter;
