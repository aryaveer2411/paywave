import { config } from './config';
import configureExpressApp from './utils/setupExpress';
import { serviceRouter } from './utils/serviceRouter';
import { BASE_URL } from './constants';

const app = configureExpressApp();
const userUrl = '/api/v1/user';
const authUrl = "/api/v1/auth";
const adminUrl = "/api/v1/admin";
const userServiceUrl = `${BASE_URL}${config.USER_PORT}/user`;
const authServiceUrl = `${BASE_URL}${config.AUTH_PORT}/auth`;
const adminServiceUrl = `${BASE_URL}${config.ADMIN_PORT}/admin`;

app.use(userUrl, serviceRouter(userUrl, userServiceUrl));

app.use(authUrl, serviceRouter(authUrl, authServiceUrl));

app.use(adminUrl, serviceRouter(adminUrl, adminServiceUrl));

export default app;
