"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pick(obj, keys) {
    const ret = {};
    keys.forEach(key => {
        if (obj[key]) {
            ret[key] = obj[key];
        }
    });
    return ret;
}
exports.pick = pick;
//# sourceMappingURL=util.js.map