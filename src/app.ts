import { config } from './config';
import configureExpressApp from './utils/setupExpress';
import { serviceRouter } from './utils/serviceRouter';
import { BASE_URL } from './constants';

const app = configureExpressApp();
const userUrl = '/api/v1/user';
const authUrl = '/api/v1/auth';
const adminUrl = '/api/v1/admin';
const customerUrl = '/api/v1/customer';
const merchantUrl = '/api/v1/merchant';
const paymentUrl = '/api/v1/payment';
const userServiceUrl = `${BASE_URL}${config.USER_PORT}/user`;
const authServiceUrl = `${BASE_URL}${config.AUTH_PORT}/auth`;
const adminServiceUrl = `${BASE_URL}${config.ADMIN_PORT}/admin`;
const customerServiceUrl = `${BASE_URL}${config.CUSTOMER_PORT}/customer`;
const merchantServiceUrl = `${BASE_URL}${config.MERCHANT_PORT}/merchant`;
const paymentServiceUrl = `${BASE_URL}${config.PAYMENT_PORT}/payment`;

app.use(userUrl, serviceRouter(userUrl, userServiceUrl));

app.use(authUrl, serviceRouter(authUrl, authServiceUrl));

app.use(adminUrl, serviceRouter(adminUrl, adminServiceUrl));

app.use(customerUrl, serviceRouter(customerUrl, customerServiceUrl));

app.use(merchantUrl, serviceRouter(merchantUrl, merchantServiceUrl));

app.use(paymentUrl, serviceRouter(paymentUrl, paymentServiceUrl));

export default app;
