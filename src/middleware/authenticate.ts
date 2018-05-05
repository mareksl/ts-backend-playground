import User, { IUser } from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

export interface UserRequest extends Request {
  user?: IUser;
  token?: string | undefined;
}

export const authenticate = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('x-auth');

  User.findByToken(token)
    .then((user: IUser) => {
      if (!user) {
        return Promise.reject(new Error('User not found'));
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch((e: Error) => {
      res.status(401).send();
    });
};
