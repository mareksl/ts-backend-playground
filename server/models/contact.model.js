"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const contactSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        trim: true,
        enum: ['person', 'general']
    },
    firstName: {
        type: String,
        required: function () {
            return this.type === 'person';
        },
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true,
        required: function () {
            return this.type === 'general';
        }
    },
    email: {
        type: String,
        trim: true,
        validate: {
            validator: validator_1.default.isEmail,
            message: '{VALUE} is not a valid email'
        },
        required: function () {
            return !(this.phone || this.link);
        }
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: (val) => validator_1.default.isMobilePhone(val, 'any'),
            message: '{VALUE} is not a valid phone number'
        },
        required: function () {
            return !(this.email || this.link);
        }
    },
    link: {
        type: String,
        trim: true,
        validate: {
            validator: validator_1.default.isURL,
            message: '{VALUE} is not a valid URL'
        },
        required: function () {
            return !(this.email || this.phone);
        }
    }
});
const Contact = mongoose_1.model('Contact', contactSchema);
exports.default = Contact;
//# sourceMappingURL=contact.model.js.map