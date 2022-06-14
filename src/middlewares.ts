/* eslint-disable no-unused-vars */
import express from 'express';
import getData from './main';

/* state of globals */
let confirm: boolean = false;
(async () => {
  try {
    confirm = await getData();
  } catch (error) {
    console.log(error);
  }
})();

/* Middleware check if globals are set */
export function confirmMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (confirm === true) {
    next();
  } else {
    res.send({ response: 'pending' });
  }
}

/* Custom 404 */
export function notFound(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* Middleware Error */
export function errorHandler(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}
