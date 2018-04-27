import { Request, Response } from 'express';
import Member, { IMember } from '../models/member.model';

import * as eventsController from '../controllers/events.controller';
import * as membersController from '../controllers/members.controller';
import * as contactsController from '../controllers/contacts.controller';

const sortMembers = (a: IMember, b: IMember) => {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
};

export default async (req: Request, res: Response) => {
  try {
    const eventList = await eventsController.fetchAll();
    const memberList = await membersController.fetchAll();
    const contactList = await contactsController.fetchAll();
    let sortedMembers = [];
    if (memberList) {
      sortedMembers = memberList.sort(sortMembers);
      res.render('index.hbs', {
        title: 'BAND',
        eventList,
        memberList: sortedMembers,
        contactList
      });
    }
  } catch (e) {
    res.status(500).send();
  }
};
