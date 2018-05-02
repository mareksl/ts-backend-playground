import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import './config/config';
import './db/mongoose';
import './util/helpers';

import * as upload from './middleware/upload';

import * as eventsController from './controllers/events.controller';
import * as membersController from './controllers/members.controller';
import * as contactsController from './controllers/contacts.controller';
import * as staticController from './controllers/static.controller';
import * as galleryImageController from './controllers/gallery-image.controller';

const app = express();

const staticDirectory = path.join(__dirname, '..', 'public');

app.use(bodyParser.json());
app.use(express.static(staticDirectory));

app.get('/', staticController.default);

// Events routes

app.get('/events', eventsController.get);
app.get('/events/:id', eventsController.getById);
app.post('/events', eventsController.post);
app.delete('/events/:id', eventsController.deleteById);
app.patch('/events/:id', eventsController.patch);

// Members routes

app.get('/members', membersController.get);
app.get('/members/:id', membersController.getById);
app.post('/members', membersController.post);
app.delete('/members/:id', membersController.deleteById);
app.patch('/members/:id', membersController.patch);

// Contacts routes

app.get('/contacts', contactsController.get);
app.get('/contacts/:id', contactsController.getById);
app.post('/contacts', contactsController.post);
app.delete('/contacts/:id', contactsController.deleteById);
app.patch('/contacts/:id', contactsController.patch);

// Gallery Images routes
app.post('/gallery', upload.image, galleryImageController.post);

export default app;
