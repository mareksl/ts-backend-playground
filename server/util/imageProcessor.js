"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jimp_1 = __importDefault(require("jimp"));
const fs_1 = __importDefault(require("fs"));
exports.processImage = options => {
    return jimp_1.default
        .read(options.filePath)
        .then(image => {
        if (image.bitmap.width > options.maxWidth) {
            return image.resize(options.maxWidth, jimp_1.default.AUTO);
        }
        return image;
    })
        .then(image => {
        return image.quality(options.quality).write(options.destination);
    })
        .then(() => {
        fs_1.default.unlink(options.filePath, err => {
            if (err)
                throw err;
            return;
        });
    });
};
exports.default = {
    processImage: exports.processImage
};
//# sourceMappingURL=imageProcessor.js.map