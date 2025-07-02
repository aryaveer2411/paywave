import configureExpressApp from '../utils/setupExpress';
const app = configureExpressApp();
import { config } from '../config';
import { connectDB } from '../database';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import customerRouter from '../routes/customer';

app.use('/customer', customerRouter);

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('err:', error);
      throw error;
    });
    app.use(errorHandler);
    app.listen(config.CUSTOMER_PORT, () => {
      console.log(`Customer service is listining on Port ${config.CUSTOMER_PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Mongo DB connection failed', error);
  });
