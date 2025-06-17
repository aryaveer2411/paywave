import configureExpressApp from '../utils/setupExpress';
const app = configureExpressApp();
import { config } from '../config';
import { connectDB } from '../database';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import paymentRouter from '../routes/payment';

app.use('/payment', paymentRouter);

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('err:', error);
      throw error;
    });
    app.use(errorHandler);
    app.listen(config.PAYMENT_PORT, () => {
      console.log(
        `Payment service is listining on Port ${config.PAYMENT_PORT}`,
      );
    });
  })
  .catch((error: Error) => {
    console.error('Mongo DB connection failed', error);
  });
