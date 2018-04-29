"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = process.env.NODE_ENV || 'development';
if (exports.env === 'development') {
    process.env.PORT = '3000';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/BackendPlayground';
}
else if (exports.env === 'test') {
    process.env.PORT = '3000';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/BackendPlaygroundTest';
}
//# sourceMappingURL=config.js.map