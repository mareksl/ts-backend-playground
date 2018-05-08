"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const gallery_image_model_1 = __importDefault(require("../models/gallery-image.model"));
const util_1 = require("../util/util");
const galleryDirectory = path_1.default.join(__dirname, '..', '..', 'upload', 'img', 'gallery');
const jimp_1 = __importDefault(require("jimp"));
exports.post = (req, res) => {
    const fileName = req.file.filename;
    const filePath = req.file.path;
    const destination = path_1.default.join(galleryDirectory, fileName);
    jimp_1.default
        .read(filePath)
        .then(image => {
        if (image.bitmap.width > 1000) {
            return image.resize(1000, jimp_1.default.AUTO);
        }
        return image;
    })
        .then(image => {
        return image.quality(80).write(destination);
    })
        .then(() => {
        fs_1.default.unlink(filePath, err => {
            if (err)
                throw err;
            return;
        });
    })
        .then(() => {
        const galleryImage = new gallery_image_model_1.default({
            filename: fileName,
            title: req.body.title
        });
        galleryImage.save().then(image => res.send({ image }));
    })
        .catch(err => res.status(500).send(err));
};
exports.get = (req, res) => {
    gallery_image_model_1.default.find()
        .then(images => {
        res.send({ images });
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
    gallery_image_model_1.default.findById(id)
        .then(image => {
        if (!image) {
            return res.status(404).send();
        }
        res.sendFile(path_1.default.join(galleryDirectory, image.filename));
    })
        .catch(e => res.status(400).send(e));
};
exports.deleteById = (req, res) => {
    const id = req.params.id;
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    gallery_image_model_1.default.findByIdAndRemove(id)
        .then(image => {
        if (!image) {
            return res.status(404).send();
        }
        const filePath = path_1.default.join(galleryDirectory, image.filename);
        return fs_1.default.unlink(filePath, err => {
            if (err)
                return res.status(500).send(err);
            res.send({ image });
        });
    })
        .catch(e => res.status(400).send(e));
};
exports.patch = (req, res) => {
    const id = req.params.id;
    const body = util_1.pick(req.body, ['title']);
    if (!mongodb_1.ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    gallery_image_model_1.default.findByIdAndUpdate(id, {
        $set: body
    }, { new: true, runValidators: true })
        .then(image => {
        if (!image) {
            res.status(404).send();
        }
        res.send({ image });
    })
        .catch(e => res.status(400).send(e));
};
//# sourceMappingURL=gallery-image.controller.js.map