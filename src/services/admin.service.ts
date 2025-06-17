import configureExpressApp from '../utils/setupExpress';
const app = configureExpressApp();
import { config } from '../config';
import { connectDB } from '../database';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import adminRouter from '../routes/admin';

app.use('/admin', adminRouter);

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('err:', error);
      throw error;
    });
    app.use(errorHandler);
    app.listen(config.ADMIN_PORT, () => {
      console.log(`Admin service is listining on Port ${config.ADMIN_PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Mongo DB connection failed', error);
  });
