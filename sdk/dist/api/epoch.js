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
    static async createEpoch(node, networkMagic, contractHash, label, maxTraits, traits, signer) {
        const method = "create_epoch";
        const traitArray = traits.map((trait) => {
            const traitPointers = trait.traits.map((pointer) => {
                return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(pointer.collection_id), neon_js_1.sc.ContractParam.integer(pointer.index));
            });
            return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(trait.drop_score), neon_js_1.sc.ContractParam.boolean(trait.unique), neon_js_1.sc.ContractParam.array(...traitPointers));
        });
        const param = [
            neon_js_1.sc.ContractParam.string(label),
            neon_js_1.sc.ContractParam.integer(maxTraits),
            neon_js_1.sc.ContractParam.array(...traitArray)
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