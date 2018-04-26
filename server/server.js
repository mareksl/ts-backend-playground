"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const server = app_1.default.listen(3000, () => {
    console.log(`Server is running on port ${'3000'}`);
    console.log('Press CTRL-C to stop\n');
});
exports.default = server;
