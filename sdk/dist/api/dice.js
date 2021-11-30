"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiceAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const interface_1 = require("./interface");
class DiceAPI {
    static async rollDie(node, networkMagic, contractHash, die) {
        const method = "roll_die";
        const param = [
            neon_js_1.sc.ContractParam.string(die)
        ];
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, param);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    static async rollDiceWithEntropy(node, networkMagic, contractHash, die, precision, entropy) {
        const method = "roll_dice_with_entropy";
        const param = [
            neon_js_1.sc.ContractParam.string(die),
            neon_js_1.sc.ContractParam.integer(precision),
            neon_js_1.sc.ContractParam.string(entropy)
        ];
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, param);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    static async rollInitialStat(node, networkMagic, contractHash) {
        const method = "roll_initial_stat";
        try {
            const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
            if (res === undefined || res.length === 0) {
                throw new Error("unrecognized response");
            }
            return res[0].value;
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    static async rollInitialStatWithEntropy(node, networkMagic, contractHash, entropy) {
        const method = "roll_initial_stat";
        const param = [
            neon_js_1.sc.ContractParam.string(entropy)
        ];
        try {
            const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, param);
            if (res === undefined || res.length === 0) {
                throw new Error("unrecognized response");
            }
            return res;
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
}
exports.DiceAPI = DiceAPI;
//# sourceMappingURL=dice.js.map