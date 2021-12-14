"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpochAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const helpers_1 = require("../helpers");
class EpochAPI {
    static async totalEpochs(node, networkMagic, contractHash, signer) {
        const method = "total_epochs";
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
    static async createEpoch(node, networkMagic, contractHash, label, traits, signer) {
        const method = "create_epoch";
        const traitsFormatted = traits.map((trait) => {
            const traitLevelsFormatted = trait.traitLevels.map((traitLevel) => {
                const traitPointers = traitLevel.traits.map((pointer) => {
                    return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(pointer.collectionId), neon_js_1.sc.ContractParam.integer(pointer.index));
                });
                return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(traitLevel.dropScore), neon_js_1.sc.ContractParam.boolean(traitLevel.unique), neon_js_1.sc.ContractParam.array(...traitPointers));
            });
            return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.string(trait.label), neon_js_1.sc.ContractParam.integer(trait.slots), neon_js_1.sc.ContractParam.array(...traitLevelsFormatted));
        });
        const param = [
            neon_js_1.sc.ContractParam.string(label),
            neon_js_1.sc.ContractParam.array(...traitsFormatted)
        ];
        return await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
    }
    static async getEpochJSON(node, networkMagic, contractHash, epochId, signer) {
        const method = "get_epoch_json";
        const param = [
            neon_js_1.sc.ContractParam.integer(epochId)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return helpers_1.parseToJSON(res[0].value);
    }
    //get_epoch
    static async mintFromEpoch(node, networkMagic, contractHash, epochId, signer) {
        const method = "mint_from_epoch";
        const param = [
            neon_js_1.sc.ContractParam.integer(epochId)
        ];
        return await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
    }
}
exports.EpochAPI = EpochAPI;
//# sourceMappingURL=epoch.js.map