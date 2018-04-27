"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hbs_1 = __importDefault(require("hbs"));
const moment_1 = __importDefault(require("moment"));
hbs_1.default.registerHelper('date', timestamp => moment_1.default(timestamp).format('DD.MM.YYYY'));
hbs_1.default.registerHelper('equal', function (lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error('Handlebars Helper equal needs 2 parameters');
    if (lvalue !== rvalue) {
        return options.inverse(this);
    }
    else {
        return options.fn(this);
    }
});
hbs_1.default.registerHelper('fullName', function (person) {
    const lastName = person.lastName ? ` ${person.lastName}` : '';
    return `${person.firstName}${lastName}`;
});
//# sourceMappingURL=helpers.js.map