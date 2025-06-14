import { Router } from 'express';
import { registerUser, updateAccountDetails,  getAllUSers } from '../../controllers/user.controller';
import { verifyJwt } from '../../middlewares/auth.middleware';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.patch('/update', verifyJwt, updateAccountDetails);
// userRouter.delete('/delete', deleteUser);
userRouter.get('/all', getAllUSers);

export default userRouter;
 