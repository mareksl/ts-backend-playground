"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("./config/config");
require("./db/mongoose");
const upload = __importStar(require("./middleware/upload"));
const eventsController = __importStar(require("./controllers/events.controller"));
const membersController = __importStar(require("./controllers/members.controller"));
const contactsController = __importStar(require("./controllers/contacts.controller"));
const galleryImageController = __importStar(require("./controllers/gallery-image.controller"));
const usersController = __importStar(require("./controllers/users.controller"));
const authenticate_1 = require("./middleware/authenticate");
const app = express_1.default();
app.use(body_parser_1.default.json());
// Events routes
app.get('/events', eventsController.get);
app.get('/events/:id', eventsController.getById);
app.post('/events', authenticate_1.authenticate, eventsController.post);
app.delete('/events/:id', authenticate_1.authenticate, eventsController.deleteById);
app.patch('/events/:id', authenticate_1.authenticate, eventsController.patch);
// Members routes
app.get('/members', membersController.get);
app.get('/members/:id', membersController.getById);
app.post('/members', authenticate_1.authenticate, membersController.post);
app.delete('/members/:id', authenticate_1.authenticate, membersController.deleteById);
app.patch('/members/:id', authenticate_1.authenticate, membersController.patch);
// Contacts routes
app.get('/contacts', contactsController.get);
app.get('/contacts/:id', contactsController.getById);
app.post('/contacts', authenticate_1.authenticate, contactsController.post);
app.delete('/contacts/:id', authenticate_1.authenticate, contactsController.deleteById);
app.patch('/contacts/:id', authenticate_1.authenticate, contactsController.patch);
// Gallery Images routes
app.get('/gallery', galleryImageController.get);
app.get('/gallery/:id', galleryImageController.getById);
app.post('/gallery', authenticate_1.authenticate, upload.image, galleryImageController.post);
app.delete('/gallery/:id', authenticate_1.authenticate, galleryImageController.deleteById);
app.patch('/gallery/:id', authenticate_1.authenticate, galleryImageController.patch);
// Users routes
app.post('/users', usersController.post);
app.post('/users/login', usersController.login);
app.get('/users/me', authenticate_1.authenticate, usersController.get);
app.patch('/users/me', authenticate_1.authenticate, usersController.patch);
app.delete('/users/me/token', authenticate_1.authenticate, usersController.logout);
exports.default = app;
//# sourceMappingURL=app.js.map