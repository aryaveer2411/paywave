import configureExpressApp from '../utils/setupExpress';
const app = configureExpressApp();
import { config } from '../config';
import { connectDB } from '../database';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import merchantRouter from '../routes/merchants';

app.use('/merchant', merchantRouter);

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('err:', error);
      throw error;
    });
    app.use(errorHandler);
    app.listen(config.MERCHANT_PORT, () => {
      console.log(`Merchant service is listining on Port ${config.MERCHANT_PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Mongo DB connection failed', error);
  });
