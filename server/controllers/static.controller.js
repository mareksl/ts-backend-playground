"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventsController = __importStar(require("../controllers/events.controller"));
const membersController = __importStar(require("../controllers/members.controller"));
const contactsController = __importStar(require("../controllers/contacts.controller"));
const sortMembers = (a, b) => {
    if (a.order < b.order) {
        return -1;
    }
    if (a.order > b.order) {
        return 1;
    }
    return 0;
};
exports.default = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const eventList = yield eventsController.fetchAll();
        const memberList = yield membersController.fetchAll();
        const contactList = yield contactsController.fetchAll();
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
    }
    catch (e) {
        res.status(500).send();
    }
});
//# sourceMappingURL=static.controller.js.map