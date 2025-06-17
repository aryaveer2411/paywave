import configureExpressApp from '../utils/setupExpress';
const app = configureExpressApp();
import { config } from '../config';
import { connectDB } from '../database';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import userRouter from '../routes/user';

app.use('/user', userRouter);

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('err:', error);
      throw error;
    });
    app.use(errorHandler);
    app.listen(config.USER_PORT, () => {
      console.log(`User service is listining on Port ${config.USER_PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Mongo DB connection failed', error);
  });
