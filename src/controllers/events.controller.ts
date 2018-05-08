import { ObjectID } from 'mongodb';
import { Request, Response } from 'express';
import Event from '../models/event.model';
import { pick } from '../util/util';

export const post = (req: Request, res: Response) => {
  const event = new Event({
    location: req.body.location,
    date: req.body.date,
    description: req.body.description,
    link: req.body.link
  });

  event
    .save()
    .then(event => res.send({ event }))
    .catch(e => res.status(400).send(e));
};

export const get = (req: Request, res: Response) => {
  Event.find()
    .then(events => {
      res.send({ events });
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

export const getById = (req: Request, res: Response) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Event.findById(id)
    .then(event => {
      if (!event) {
        return res.status(404).send();
      }
      res.send({ event });
    })
    .catch(e => res.status(400).send(e));
};

export const deleteById = (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Event.findByIdAndRemove(id)
    .then(event => {
      if (!event) {
        return res.status(404).send();
      }
      res.send({ event });
    })
    .catch(e => res.status(400).send(e));
};

export const patch = (req: Request, res: Response) => {
  const id = req.params.id;
  const body = pick(req.body, ['location', 'date', 'description', 'link']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Event.findByIdAndUpdate(
    id,
    {
      $set: body
    },
    { new: true, runValidators: true }
  )
    .then(event => {
      if (!event) {
        res.status(404).send();
      }
      res.send({ event });
    })
    .catch(e => res.status(400).send(e));
};