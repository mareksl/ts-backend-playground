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
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
require("./config/config");
require("./db/mongoose");
require("./util/helpers");
const eventsController = __importStar(require("./controllers/events.controller"));
const membersController = __importStar(require("./controllers/members.controller"));
const contactsController = __importStar(require("./controllers/contacts.controller"));
const staticController = __importStar(require("./controllers/static.controller"));
const app = express_1.default();
const staticDirectory = path_1.default.join(__dirname, '..', 'public');
app.use(body_parser_1.default.json());
app.use(express_1.default.static(staticDirectory));
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
exports.default = app;
//# sourceMappingURL=app.js.map