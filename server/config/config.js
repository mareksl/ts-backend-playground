"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = process.env.NODE_ENV || 'development';
if (exports.env === 'development' || exports.env === 'test') {
    const config = require('../../config/config.json');
    const envConfig = config[exports.env];
    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key];
    });
}
//# sourceMappingURL=config.js.map