import express from 'express';
import path from 'path';

import mongoose from './db/mongoose';
import'./config/config';

import * as eventsController from './controllers/events.controller';
import * as membersController from './controllers/members.controller';
import * as contactsController from './controllers/contacts.controller';

const app = express();

const staticDirectory = path.join(__dirname, '..', 'public');

app.use(express.static(staticDirectory));

app.get('/events', eventsController.get);

app.get('/members', membersController.get);

app.get('/contacts', contactsController.get);

export default app;
