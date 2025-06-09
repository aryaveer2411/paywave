import configureExpressApp from '../utils/setupExpress';
const app = configureExpressApp();
import { config } from '../config';
import { connectDB } from '../database';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import authRouter from '../routes/auth';

// app.post('/login', loginUser);

// app.post('/logout', logOutUser);

// app.patch('refresh-token', refreshAccessToken);

// app.patch('change-password', changePassword);

// app.get('get-current-user', getCurrentUser);

app.use('/auth', authRouter);

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('err:', error);
      throw error;
    });
    app.use(errorHandler);
    app.listen(config.AUTH_PORT, () => {
      console.log(`app is listining on Port ${config.AUTH_PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Mongo DB connection failed', error);
  });
