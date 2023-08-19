import express from 'express';

export interface expressParams {
  err?: any;
  req: express.Request;
  res: express.Response;
  next?: express.NextFunction;
}

export interface sendErrorParams {
    res: express.Response;
    message: string
    status: number;
}