"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pick(object, properties) {
    return properties.reduce((acc, prop) => {
        acc[prop] = object[prop];
        return acc;
    }, {});
}
exports.pick = pick;
//# sourceMappingURL=util.js.map