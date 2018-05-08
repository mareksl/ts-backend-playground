"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const mime_1 = __importDefault(require("mime"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const uploadDirectory = path_1.default.join(__dirname, '..', '..', 'upload', 'tmp');
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        crypto_1.default.pseudoRandomBytes(16, (err, raw) => {
            cb(null, `${file.fieldname}-${raw.toString('hex')}-${Date.now()}.${mime_1.default.getExtension(file.mimetype)}`);
        });
    }
});
const uploadImage = multer_1.default({
    storage: storage,
    limits: {
        fileSize: 2097152
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/image\/(jpe?g|bmp|png)/)) {
            return cb(null, true);
        }
        return cb(new Error('Mime type not supported'), false);
    }
}).single('image');
exports.image = (req, res, next) => {
    uploadImage(req, res, err => {
        if (err) {
            return res.status(400).send(err.message);
        }
        next();
    });
};
//# sourceMappingURL=upload.js.map