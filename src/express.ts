/* eslint-disable import/first */
// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();
import api from './api';
import { errorHandler, notFound, confirmMiddleware } from './middlewares';

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200
};

const app: express.Application = express();
// base middlewares
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
// router
app.use('/', confirmMiddleware, api);
// error handle
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${process.env.PORT}`
  );
});
