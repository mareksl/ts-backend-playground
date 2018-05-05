"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
exports.authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    user_model_1.default.findByToken(token)
        .then((user) => {
        if (!user) {
            return Promise.reject(new Error('User not found'));
        }
        req.user = user;
        req.token = token;
        next();
    })
        .catch((e) => {
        res.status(401).send();
    });
};
//# sourceMappingURL=authenticate.js.map