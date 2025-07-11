import { config } from '../config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export default function configureExpressApp() {
  const app = express();

  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));
  app.use(cookieParser());
  app.use(express.static('public')); 

  return app;
}
