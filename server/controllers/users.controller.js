"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const util_1 = require("../util/util");
exports.post = (req, res) => {
    const body = util_1.pick(req.body, ['email', 'username', 'password']);
    const user = new user_model_1.default(body);
    user
        .save()
        .then(() => user.generateAuthToken())
        .then(token => {
        res.header('x-auth', token).send(user);
    })
        .catch(e => res.status(400).send(e));
};
exports.get = (req, res) => {
    res.send(req.user);
};
exports.login = (req, res) => {
    const body = util_1.pick(req.body, ['username', 'password']);
    user_model_1.default.findByCredentials(body.username, body.password)
        .then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });
    })
        .catch(e => {
        res.status(400).send();
    });
};
exports.logout = (req, res) => {
    if (!req.user || !req.token) {
        return res.status(400).send();
    }
    req.user
        .removeToken(req.token)
        .then(() => res.status(200).send())
        .catch(e => res.status(400).send());
};
exports.patch = (req, res) => {
    const body = util_1.pick(req.body, ['email', 'password']);
    if (!req.user) {
        return res.status(400).send();
    }
    const id = req.user._id;
    user_model_1.default.findByIdAndUpdate(id, {
        $set: body
    }, { new: true, runValidators: true })
        .then(user => {
        if (!user) {
            return res.status(400).send();
        }
        res.send(user);
    })
        .catch(e => res.status(400).send(e));
};
//# sourceMappingURL=users.controller.js.map