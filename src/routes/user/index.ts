import { Router } from 'express';
import { registerUser, updateAccountDetails, deleteUser, getAllUSers } from '../../controllers/user.controller';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.patch('/update', updateAccountDetails);
userRouter.delete('/delete', deleteUser);
userRouter.get('/all', getAllUSers);

export default userRouter;
 