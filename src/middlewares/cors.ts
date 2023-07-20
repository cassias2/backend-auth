import { RequestHandler } from "express";


const cors: RequestHandler  = (request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173' || 'http://localhost:5174');
  response.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Allow-Headers', '*');
  response.setHeader('Access-Control-Max-Age', '10');
  next();
};


export default cors;