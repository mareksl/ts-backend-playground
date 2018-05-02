"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const galleryImageSchema = new mongoose_1.Schema({
    filename: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled image',
        minlength: 1,
        trim: true
    }
});
const GalleryImage = mongoose_1.model('GalleryImage', galleryImageSchema);
exports.default = GalleryImage;
//# sourceMappingURL=gallery-image.model.js.map