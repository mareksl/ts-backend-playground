"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const memberSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    lastName: {
        type: String,
        minlength: 1,
        trim: true
    },
    bio: {
        type: String,
        trim: true,
        minlength: 1
    },
    avatar: {
        type: String,
        trim: true,
    },
    order: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        trim: true,
        minlength: 1
    }
});
const Member = mongoose_1.default.model('Member', memberSchema);
exports.default = Member;
//# sourceMappingURL=member.model.js.map