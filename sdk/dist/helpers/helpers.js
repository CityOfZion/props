"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatter = exports.parseToJSON = void 0;
const neon_core_1 = require("@cityofzion/neon-core");
function parseToJSON(entries) {
    const object = {};
    let key;
    let value;
    entries.forEach((entry) => {
        key = formatter(entry.key);
        switch (entry.value.type) {
            case "Map":
                value = parseToJSON(entry.value.value);
                break;
            case "Array":
                value = entry.value.value.map((e) => {
                    return parseToJSON(e.value);
                });
                break;
            default:
                if (key === 'token_id') {
                    value = formatter(entry.value, true);
                }
                else {
                    value = formatter(entry.value);
                }
                break;
        }
        object[key] = value;
    });
    return object;
}
exports.parseToJSON = parseToJSON;
function formatter(field, num = false) {
    switch (field.type) {
        case "ByteString":
            const rawValue = neon_core_1.u.base642hex(field.value);
            if (num) {
                return parseInt(neon_core_1.u.reverseHex(rawValue), 16);
            }
            if (rawValue.length === 40) {
                return new neon_core_1.wallet.Account(neon_core_1.u.reverseHex(rawValue));
            }
            return neon_core_1.u.hexstring2str(rawValue);
        case "Integer":
            return parseInt(field.value);
        default:
            return field.value;
    }
}
exports.formatter = formatter;
//# sourceMappingURL=helpers.js.map