import { ObjectID } from 'mongodb';
import { Request, Response } from 'express';
import Contact from '../models/contact.model';
import { pick } from '../util/util';
import { QueryFindOneAndUpdateOptions } from 'mongoose';

export const post = (req: Request, res: Response) => {
  const contact = new Contact({
    type: req.body.type,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    title: req.body.title,
    email: req.body.email,
    phone: req.body.phone,
    link: req.body.link
  });

  contact
    .save()
    .then(contact => res.send({ contact }))
    .catch(e => res.status(400).send(e));
};

export const get = (req: Request, res: Response) => {
  Contact.find()
    .then(contacts => res.send({ contacts }))
    .catch(e => {
      res.status(400).send(e);
    });
};

export const getById = (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Contact.findById(id)
    .then(contact => {
      if (!contact) {
        return res.status(404).send();
      }
      res.send({ contact });
    })
    .catch(e => res.status(400).send());
};

export const deleteById = (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Contact.findByIdAndRemove(id)
    .then(contact => {
      if (!contact) {
        return res.status(404).send();
      }
      res.send({ contact });
    })
    .catch(e => res.status(400).send());
};

export const patch = (req: Request, res: Response) => {
  const id = req.params.id;
  const body = pick(req.body, [
    'type',
    'firstName',
    'lastName',
    'title',
    'email',
    'phone',
    'link'
  ]);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Contact.findOneAndUpdate(
    { _id: id },
    { $set: body },
    <QueryFindOneAndUpdateOptions>{
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
    .then(contact => {
      if (!contact) {
        return res.status(404).send();
      }
      res.send({ contact });
    })
    .catch(e => res.status(400).send(e));
};

export const fetchAll = () => {
  return Contact.find()
    .then(contacts => contacts)
    .catch(e => {
      console.log(e);
    });
};
