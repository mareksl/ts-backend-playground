"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const gallery_image_model_1 = __importDefault(require("../models/gallery-image.model"));
const galleryDirectory = path_1.default.join(__dirname, '..', '..', 'public', 'img', 'gallery');
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
        galleryImage.save().then(galleryImage => res.send(galleryImage));
    })
        .catch(err => res.status(500).send(err));
};
//# sourceMappingURL=gallery-image.controller.js.map