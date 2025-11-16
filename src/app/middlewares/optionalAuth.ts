import { NextFunction, Request, Response } from 'express';
import { jwtHelpers } from '../helper/jwtHelpers';
import config from '../config';
import { JwtPayload, Secret } from 'jsonwebtoken';

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const headers = req.headers.authorization;
    if (!headers) {
      req.user = null;
      return next();
    }
    const token = headers.split(' ')[1];
    if (!token) {
      req.user = null;
      return next();
    }
    const decode = jwtHelpers.verifyToken(
      token,
      config.jwt.accessTokenSecret as Secret,
    ) as JwtPayload;

    req.user = decode || null;
    next();
  } catch (error) {
    next(error);
  }
};

export default optionalAuth;
