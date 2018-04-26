"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const event_model_1 = __importDefault(require("../models/event.model"));
const util_1 = require("../util/util");
exports.post = (req, res) => {
    const event = new event_model_1.default({
        location: req.body.location,
        date: req.body.date,
        description: req.body.description,
        link: req.body.link
    });
    event
        .save()
        .then(event => res.send({ event }))
        .catch(e => res.status(400).send(e));
};
exports.get = (req, res) => {
    event_model_1.default.find()
        .then(events => {
        res.send({ events });
    })
        .catch(e => {
        res.status(400).send(e);
    });
};
exports.getById = (req, res) => {
    const id = req.params.id;
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    event_model_1.default.findById(id)
        .then(event => {
        if (!event) {
            return res.status(404).send();
        }
        res.send({ event });
    })
        .catch(e => res.status(400).send(e));
};
exports.deleteById = (req, res) => {
    const id = req.params.id;
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    event_model_1.default.findByIdAndRemove(id)
        .then(event => {
        if (!event) {
            return res.status(404).send();
        }
        res.send({ event });
    })
        .catch(e => res.status(400).send(e));
};
exports.patch = (req, res) => {
    const id = req.params.id;
    const body = util_1.pick(req.body, ['location', 'date', 'description', 'link']);
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    event_model_1.default.findByIdAndUpdate(id, {
        $set: body
    }, { new: true, runValidators: true })
        .then(event => {
        if (!event) {
            res.status(404).send();
        }
        res.send({ event });
    })
        .catch(e => res.status(400).send(e));
};
exports.fetchAll = () => {
    return event_model_1.default.find()
        .then(events => events)
        .catch(e => {
        console.log(e);
    });
};
