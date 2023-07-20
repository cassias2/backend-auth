import { config } from 'dotenv';
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

config();

const auth = (request: Request, response: Response, next: NextFunction) => {
  if (request.method === 'OPTIONS') {
    return response.sendStatus(200);
  } else {
    const token = request.headers["access-token"];
    
    if (!token) {
      return response.status(401).json({
        statusCode: 401,
        message: 'Auth token not provided!'
      });
    }

    try {
      if (typeof token === 'string') {
        jwt.verify(token, process.env.TOKEN_KEY || '');
      }
    } catch (e) {
      console.error(e);
      return response.status(401).json({
        statusCode: 401,
        message: "Invalid Token"
      });
    }
    next();
  }
}

export default auth;