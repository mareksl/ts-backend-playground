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
import * as usersController from './controllers/users.controller';

import { authenticate } from './middleware/authenticate';

const app = express();

const staticDirectory = path.join(__dirname, '..', 'public');

app.use(bodyParser.json());
app.use(express.static(staticDirectory));

app.get('/', staticController.default);

// Events routes

app.get('/events', eventsController.get);
app.get('/events/:id', eventsController.getById);
app.post('/events', authenticate, eventsController.post);
app.delete('/events/:id', authenticate, eventsController.deleteById);
app.patch('/events/:id', authenticate, eventsController.patch);

// Members routes

app.get('/members', membersController.get);
app.get('/members/:id', membersController.getById);
app.post('/members', authenticate, membersController.post);
app.delete('/members/:id', authenticate, membersController.deleteById);
app.patch('/members/:id', authenticate, membersController.patch);

// Contacts routes

app.get('/contacts', contactsController.get);
app.get('/contacts/:id', contactsController.getById);
app.post('/contacts', authenticate, contactsController.post);
app.delete('/contacts/:id', authenticate, contactsController.deleteById);
app.patch('/contacts/:id', authenticate, contactsController.patch);

// Gallery Images routes
app.get('/gallery', galleryImageController.get);
app.get('/gallery/:id', galleryImageController.getById);
app.post('/gallery', authenticate, upload.image, galleryImageController.post);
app.delete('/gallery/:id', authenticate, galleryImageController.deleteById);
app.patch('/gallery/:id', authenticate, galleryImageController.patch);

// Users routes
app.post('/users', usersController.post);
app.get('/users/me', authenticate, usersController.get);
app.post('/users/login', usersController.login);
app.delete('/users/me', authenticate, usersController.logout);

export default app;
