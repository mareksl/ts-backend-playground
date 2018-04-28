"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const member_model_1 = __importDefault(require("../models/member.model"));
const util_1 = require("../util/util");
exports.post = (req, res) => {
    const member = new member_model_1.default({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        bio: req.body.bio,
        avatar: req.body.avatar,
        order: req.body.order,
        role: req.body.role
    });
    member
        .save()
        .then(member => res.send({ member }))
        .catch(e => res.status(400).send(e));
};
exports.get = (req, res) => {
    member_model_1.default.find()
        .then(members => res.send({ members }))
        .catch(e => {
        res.status(400).send(e);
    });
};
exports.getById = (req, res) => {
    const id = req.params.id;
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    member_model_1.default.findById(id)
        .then(member => {
        if (!member) {
            return res.status(404).send();
        }
        res.send({ member });
    })
        .catch(e => res.status(400).send());
};
exports.deleteById = (req, res) => {
    const id = req.params.id;
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    member_model_1.default.findByIdAndRemove(id)
        .then(member => {
        if (!member) {
            return res.status(404).send();
        }
        res.send({ member });
    })
        .catch(e => res.status(400).send());
};
exports.patch = (req, res) => {
    const id = req.params.id;
    const body = util_1.pick(req.body, [
        'firstName',
        'lastName',
        'bio',
        'avatar',
        'order',
        'role'
    ]);
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    member_model_1.default.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })
        .then(member => {
        if (!member) {
            return res.status(404).send();
        }
        res.send({ member });
    })
        .catch(e => res.status(400).send(e));
};
exports.fetchAll = () => {
    return member_model_1.default.find()
        .then(members => members)
        .catch(e => {
        console.log(e);
    });
};
//# sourceMappingURL=members.controller.js.map