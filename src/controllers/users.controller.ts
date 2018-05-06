import { ObjectID } from 'mongodb';
import { Request, Response } from 'express';
import User from '../models/user.model';
import { pick } from '../util/util';
import { UserRequest } from '../middleware/authenticate';

export const post = (req: Request, res: Response) => {
  const body = pick(req.body, ['email', 'username', 'password']);
  const user = new User(body);

  user
    .save()
    .then(() => user.generateAuthToken())
    .then(token => {
      res.header('x-auth', token).send(user);
    });
};

export const get = (req: UserRequest, res: Response) => {
  res.send(req.user);
};

export const login = (req: Request, res: Response) => {
  const body = pick(req.body, ['username', 'password']);

  User.findByCredentials(body.username, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('x-auth', token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send();
    });
};

export const logout = (req: UserRequest, res: Response) => {
  if (!req.user || !req.token) {
    return res.status(400).send();
  }
  req.user
    .removeToken(req.token)
    .then(() => res.status(200).send())
    .catch(e => res.status(400).send());
};

export const patch = (req: UserRequest, res: Response) => {
  const body = pick(req.body, ['email', 'password']);
  if (!req.user) {
    return res.status(400).send();
  }
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    {
      $set: body
    },
    { new: true, runValidators: true }
  )
    .then(user => {
      if (!user) {
        return res.status(400).send();
      }
      res.send({ user });
    })
    .catch(e => res.status(400).send(e));
};
