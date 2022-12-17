"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChestAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const neon_core_1 = require("@cityofzion/neon-core");
const helpers_1 = require("../helpers");
class ChestAPI {
    static async createChest(node, networkMagic, contractHash, name, type, eligibleEpochs, puppetTraits, signer) {
        const method = "create_chest";
        const epochs = eligibleEpochs.map((value) => {
            return neon_js_1.sc.ContractParam.integer(value);
        });
        const traits = Object.keys(puppetTraits).map((key) => {
            return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.string(key), neon_js_1.sc.ContractParam.string(puppetTraits[key]));
        });
        const param = [
            neon_js_1.sc.ContractParam.string(name),
            neon_js_1.sc.ContractParam.integer(type),
            neon_js_1.sc.ContractParam.array(...epochs),
            neon_js_1.sc.ContractParam.array(...traits)
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
    static async isPuppetEligible(node, networkMagic, contractHash, chestId, puppetId, signer) {
        const method = "is_puppet_eligible";
        const param = [
            neon_js_1.sc.ContractParam.string(chestId),
            neon_js_1.sc.ContractParam.string(puppetId),
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
    static async lootChestWithPuppet(node, networkMagic, contractHash, chestId, puppetId, signer) {
        const method = "loot_chest_with_puppet";
        const param = [
            neon_js_1.sc.ContractParam.string(chestId),
            neon_js_1.sc.ContractParam.string(puppetId),
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
    static async lootChestAsOwner(node, networkMagic, contractHash, chestId, signer) {
        const method = "loot_chest_as_owner";
        const param = [
            neon_js_1.sc.ContractParam.string(chestId),
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
    static async getChestJSON(node, networkMagic, contractHash, chestId, signer) {
        const method = "get_chest_json";
        const param = [
            neon_js_1.sc.ContractParam.string(chestId),
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        let formattedRes = (0, helpers_1.formatter)(res[0]);
        const author = neon_core_1.u.reverseHex(neon_core_1.u.str2hexstring(formattedRes.author));
        formattedRes.author = new neon_core_1.wallet.Account(author);
        return formattedRes;
    }
    static async totalChests(node, networkMagic, contractHash, signer) {
        const method = "total_chests";
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
}
exports.ChestAPI = ChestAPI;
//# sourceMappingURL=chest.js.map