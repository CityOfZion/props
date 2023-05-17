"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChestAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const neon_core_1 = require("@cityofzion/neon-core");
const helpers_1 = require("../helpers");
class ChestAPI {
    static async createChest(node, networkMagic, contractHash, name, chestType, eligibilityCases, signer) {
        const method = "create_chest";
        const cases = eligibilityCases.map((eligibilityCase) => {
            const attributes = eligibilityCase.attributes.map((attr) => {
                let value = neon_js_1.sc.ContractParam.byteArray('');
                switch (typeof attr.value) {
                    case typeof "a":
                        value = neon_js_1.sc.ContractParam.string(attr.value);
                        break;
                    case typeof 1:
                        value = neon_js_1.sc.ContractParam.integer(attr.value);
                }
                return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.string(attr.logic), neon_js_1.sc.ContractParam.string(attr.key), value);
            });
            return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.hash160(eligibilityCase.scriptHash), neon_js_1.sc.ContractParam.array(...attributes));
        });
        const param = [
            neon_js_1.sc.ContractParam.string(name),
            neon_js_1.sc.ContractParam.integer(chestType),
            neon_js_1.sc.ContractParam.array(...cases),
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
    static async isEligible(node, networkMagic, contractHash, chestId, nftSriptHash, tokenId, signer) {
        const method = "is_eligible";
        const param = [
            neon_js_1.sc.ContractParam.integer(chestId),
            neon_js_1.sc.ContractParam.hash160(nftSriptHash),
            neon_js_1.sc.ContractParam.string(tokenId)
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
    //TODO - Verify
    static async lootChest(node, networkMagic, contractHash, chestId, nftScriptHash, tokenId, signer) {
        const method = "loot_chest";
        const param = [
            neon_js_1.sc.ContractParam.integer(chestId),
            neon_js_1.sc.ContractParam.hash160(nftScriptHash),
            neon_js_1.sc.ContractParam.string(tokenId)
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
    //TODO - Verify
    static async lootChestAsOwner(node, networkMagic, contractHash, chestId, signer) {
        const method = "loot_chest_as_owner";
        const param = [
            neon_js_1.sc.ContractParam.integer(chestId),
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
            neon_js_1.sc.ContractParam.integer(chestId),
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