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
require("./config/config");
require("./db/mongoose");
const eventsController = __importStar(require("./controllers/events.controller"));
const membersController = __importStar(require("./controllers/members.controller"));
const contactsController = __importStar(require("./controllers/contacts.controller"));
const app = express_1.default();
const staticDirectory = path_1.default.join(__dirname, '..', 'public');
app.use(express_1.default.static(staticDirectory));
app.get('/events', eventsController.get);
app.get('/members', membersController.get);
app.get('/contacts', contactsController.get);
exports.default = app;
