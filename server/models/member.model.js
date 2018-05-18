"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const memberSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    lastName: {
        type: String,
        trim: 1
    },
    bio: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true,
        validate: {
            validator: validator_1.default.isURL,
            message: '{VALUE} is not a valid URL'
        }
    },
    order: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        trim: true
    }
});
const Member = mongoose_1.default.model('Member', memberSchema);
exports.default = Member;
//# sourceMappingURL=member.model.js.map