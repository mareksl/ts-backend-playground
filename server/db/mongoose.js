"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.Promise = global.Promise;
mongoose_1.default
    .connect(process.env.MONGODB_URI || '')
    .then(() => console.log('Connected to database'))
    .catch(e => console.log('Connection to database failed'));
//# sourceMappingURL=mongoose.js.map