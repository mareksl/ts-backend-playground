"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const contact_model_1 = __importDefault(require("../models/contact.model"));
const util_1 = require("../util/util");
exports.post = (req, res) => {
    const contact = new contact_model_1.default({
        type: req.body.type,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        title: req.body.title,
        email: req.body.email,
        telephone: req.body.telephone,
        link: req.body.link
    });
    contact
        .save()
        .then(contact => res.send({ contact }))
        .catch(e => res.status(400).send(e));
};
exports.get = (req, res) => {
    contact_model_1.default.find()
        .then(contacts => res.send({ contacts }))
        .catch(e => {
        res.status(400).send(e);
    });
};
exports.getById = (req, res) => {
    const id = req.params.id;
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    contact_model_1.default.findById(id)
        .then(contact => {
        if (!contact) {
            return res.status(404).send();
        }
        res.send({ contact });
    })
        .catch(e => res.status(400).send());
};
exports.deleteById = (req, res) => {
    const id = req.params.id;
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    contact_model_1.default.findByIdAndRemove(id)
        .then(contact => {
        if (!contact) {
            return res.status(404).send();
        }
        res.send({ contact });
    })
        .catch(e => res.status(400).send());
};
exports.patch = (req, res) => {
    const id = req.params.id;
    const body = util_1.pick(req.body, [
        'type',
        'firstName',
        'lastName',
        'title',
        'email',
        'telephone',
        'link'
    ]);
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    contact_model_1.default.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })
        .then(contact => {
        if (!contact) {
            return res.status(404).send();
        }
        res.send({ contact });
    })
        .catch(e => res.status(400).send());
};
exports.fetchAll = () => {
    return contact_model_1.default.find()
        .then(contacts => contacts)
        .catch(e => {
        console.log(e);
    });
};
