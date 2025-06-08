import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from './config';
import configureExpressApp from './utils/setupExpress';
import { userRouter } from './routes/user.routes';
import { asyncHandler } from './utils/asyncHandler';
import axios from 'axios';
import { serviceRouter } from './utils/serviceRouter';

const app = configureExpressApp();
const userServiceUrl = `http://localhost:${config.USER_PORT}`;

app.use('/api/v1/user', serviceRouter('/api/v1/user', userServiceUrl));

export default app;
