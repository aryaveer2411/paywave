import configureExpressApp from '../utils/setupExpress';
const app = configureExpressApp();
import { config } from '../config';
import { addMerchant } from '../controllers/admin.controller';
import { connectDB } from '../database';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import adminRouter from '../routes/admin';

// app.post('/add-merchant', addMerchant);

app.use('/admin', adminRouter);

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('err:', error);
      throw error;
    });
    app.use(errorHandler);
    app.listen(config.ADMIN_PORT, () => {
      console.log(`app is listining on Port ${config.ADMIN_PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Mongo DB connection failed', error);
  });
