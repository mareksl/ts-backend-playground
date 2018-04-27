import { ObjectID } from 'mongodb';
import { Request, Response } from 'express';
import Member, { IMember } from '../models/member.model';
import { pick } from '../util/util';

export const post = (req: Request, res: Response) => {
  const member = new Member({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    avatar: req.body.avatar,
    order: req.body.order,
    role: req.body.role
  });

  member
    .save()
    .then(member => res.send({ member }))
    .catch(e => res.status(400).send(e));
};

export const get = (req: Request, res: Response) => {
  Member.find()
    .then(members => res.send({ members }))
    .catch(e => {
      res.status(400).send(e);
    });
};

export const getById = (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Member.findById(id)
    .then(member => {
      if (!member) {
        return res.status(404).send();
      }
      res.send({ member });
    })
    .catch(e => res.status(400).send());
};

export const deleteById = (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Member.findByIdAndRemove(id)
    .then(member => {
      if (!member) {
        return res.status(404).send();
      }
      res.send({ member });
    })
    .catch(e => res.status(400).send());
};

export const patch = (req: Request, res: Response) => {
  const id = req.params.id;
  const body = pick(req.body, [
    'firstName',
    'lastName',
    'bio',
    'avatar',
    'order',
    'role'
  ]);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Member.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true }
  )
    .then(member => {
      if (!member) {
        return res.status(404).send();
      }
      res.send({ member });
    })
    .catch(e => res.status(400).send(e));
};

export const fetchAll: () => Promise<void | IMember[]> = () => {
  return Member.find()
    .then(members => members)
    .catch(e => {
      console.log(e);
    });
};
