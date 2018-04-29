"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config/config");
const port = process.env.PORT;
const server = app_1.default.listen(port, () => {
    console.log(`Server is running on port ${port} in ${config_1.env} mode...`);
    console.log('Press CTRL-C to stop\n');
});
exports.default = server;
//# sourceMappingURL=server.js.map