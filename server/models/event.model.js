"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const eventSchema = new mongoose_1.default.Schema({
    location: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    date: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    link: {
        type: String,
        trim: true,
        validate: {
            validator: validator_1.default.isURL,
            message: '{VALUE} is not a valid URL'
        }
    }
});
const Event = mongoose_1.default.model('Event', eventSchema);
exports.default = Event;
//# sourceMappingURL=event.model.js.map