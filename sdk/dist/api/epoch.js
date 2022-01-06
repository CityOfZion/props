"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpochAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const interface_1 = require("../interface");
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
    static async createEpoch(node, networkMagic, contractHash, label, whiteList, signer) {
        const method = "create_epoch";
        const formattedWhitelist = whiteList.map(entry => neon_js_1.sc.ContractParam.hash160(entry));
        const param = [
            neon_js_1.sc.ContractParam.string(label),
            neon_js_1.sc.ContractParam.array(...formattedWhitelist)
        ];
        return await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
    }
    static async createTrait(node, networkMagic, contractHash, epochId, label, slots, levels, signer) {
        const method = "create_trait";
        const traitLevelsFormatted = levels.map((traitLevel) => {
            const traitPointers = traitLevel.traits.map((traitEvent) => {
                //need to also have the type in here
                switch (traitEvent.type) {
                    case interface_1.EventTypeEnum.CollectionPointer:
                        const args = traitEvent.args;
                        //console.log(traitEvent.type, args.collectionId, args.index)
                        return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(traitEvent.type), neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(args.collectionId), neon_js_1.sc.ContractParam.integer(args.index)));
                    default:
                        throw new Error("unrecognized trait event type");
                }
            });
            return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(traitLevel.dropScore), neon_js_1.sc.ContractParam.boolean(traitLevel.unique), neon_js_1.sc.ContractParam.array(...traitPointers));
        });
        const param = [
            neon_js_1.sc.ContractParam.integer(epochId),
            neon_js_1.sc.ContractParam.string(label),
            neon_js_1.sc.ContractParam.integer(slots),
            neon_js_1.sc.ContractParam.array(...traitLevelsFormatted)
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