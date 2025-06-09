import configureExpressApp from '../utils/setupExpress';
const app = configureExpressApp();
import { config } from '../config';
import {
  changePassword,
  getCurrentUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
} from '../controllers/auth.controller';
import { connectDB } from '../database';
import { errorHandler } from '../middlewares/errorHandler.middleware';

app.post('/login', loginUser);

app.post('/logout', logOutUser);

app.patch('refresh-token', refreshAccessToken);

app.patch('change-password', changePassword);

app.get('get-current-user', getCurrentUser);

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
