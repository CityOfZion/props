"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiceAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const helpers_1 = require("../helpers");
class DiceAPI {
    static async rollDie(node, networkMagic, contractHash, die, signer) {
        const method = "roll_die";
        const param = [
            neon_js_1.sc.ContractParam.string(die)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
    static async rollDiceWithEntropy(node, networkMagic, contractHash, die, precision, entropy, signer) {
        const method = "roll_dice_with_entropy";
        const param = [
            neon_js_1.sc.ContractParam.string(die),
            neon_js_1.sc.ContractParam.integer(precision),
            neon_js_1.sc.ContractParam.string(entropy)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return [parseInt(res[0].value)];
    }
    static async randBetween(node, networkMagic, contractHash, start, end, signer) {
        const method = "rand_between";
        const param = [
            neon_js_1.sc.ContractParam.integer(start),
            neon_js_1.sc.ContractParam.integer(end)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
    static async mapBytesOntoRange(node, networkMagic, contractHash, start, end, entropy, signer) {
        const method = "map_bytes_onto_range";
        const param = [
            neon_js_1.sc.ContractParam.integer(start),
            neon_js_1.sc.ContractParam.integer(end),
            neon_js_1.sc.ContractParam.string(entropy)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
}
exports.DiceAPI = DiceAPI;
//# sourceMappingURL=dice.js.map