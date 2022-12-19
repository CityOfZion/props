"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const interface_1 = require("../interface");
const helpers_1 = require("../helpers");
class GeneratorAPI {
    static async createGenerator(node, networkMagic, contractHash, label, baseGeneratorFee, signer) {
        const method = "create_generator";
        const param = [
            neon_js_1.sc.ContractParam.string(label),
            neon_js_1.sc.ContractParam.integer(baseGeneratorFee)
        ];
        return await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
    }
    static async createInstance(node, networkMagic, contractHash, generatorId, signer) {
        const method = "create_instance";
        const param = [
            neon_js_1.sc.ContractParam.integer(generatorId)
        ];
        return await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
    }
    static async createTrait(node, networkMagic, contractHash, generatorId, label, slots, levels, signer) {
        const method = "create_trait";
        const traitLevelsFormatted = levels.map((traitLevel) => {
            const traitPointers = traitLevel.traits.map((traitEvent) => {
                switch (traitEvent.type) {
                    case interface_1.EventTypeEnum.CollectionPointer:
                        const collectionPointer = traitEvent.args;
                        return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(traitEvent.type), neon_js_1.sc.ContractParam.integer(traitEvent.maxMint), neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(collectionPointer.collectionId), neon_js_1.sc.ContractParam.integer(collectionPointer.index)));
                    case interface_1.EventTypeEnum.InstanceCall:
                        const instanceCall = traitEvent.args;
                        return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(traitEvent.type), neon_js_1.sc.ContractParam.integer(traitEvent.maxMint), neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.hash160(instanceCall.scriptHash), neon_js_1.sc.ContractParam.string(instanceCall.method), neon_js_1.sc.ContractParam.array(...instanceCall.param)));
                    case interface_1.EventTypeEnum.Value:
                        const valueCall = traitEvent.args;
                        return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(traitEvent.type), neon_js_1.sc.ContractParam.integer(traitEvent.maxMint), neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.byteArray(valueCall.value)));
                    case interface_1.EventTypeEnum.CollectionSampleFrom:
                        const collectionPtr = traitEvent.args;
                        return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(traitEvent.type), neon_js_1.sc.ContractParam.integer(traitEvent.maxMint), neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(collectionPtr.collectionId)));
                    default:
                        throw new Error("unrecognized trait event type");
                }
            });
            return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.integer(traitLevel.dropScore), neon_js_1.sc.ContractParam.integer(traitLevel.mintMode), neon_js_1.sc.ContractParam.array(...traitPointers));
        });
        const param = [
            neon_js_1.sc.ContractParam.integer(generatorId),
            neon_js_1.sc.ContractParam.string(label),
            neon_js_1.sc.ContractParam.integer(slots),
            neon_js_1.sc.ContractParam.array(...traitLevelsFormatted)
        ];
        return await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
    }
    //getGenerator
    static async getGeneratorJSON(node, networkMagic, contractHash, generatorId, signer) {
        const method = "get_generator_json";
        const param = [
            neon_js_1.sc.ContractParam.integer(generatorId)
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
    static async getTraitJSON(node, networkMagic, contractHash, traitId, signer) {
        const method = "get_trait_json";
        const param = [
            neon_js_1.sc.ContractParam.string(traitId)
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
    //getGeneratorInstance
    static async getGeneratorInstanceJSON(node, networkMagic, contractHash, instanceId, signer) {
        const method = "get_generator_instance_json";
        const param = [
            neon_js_1.sc.ContractParam.integer(instanceId)
        ];
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return (0, helpers_1.formatter)(res[0]);
    }
    static async mintFromInstance(node, networkMagic, contractHash, instanceId, signer) {
        const method = "mint_from_instance";
        const param = [
            neon_js_1.sc.ContractParam.string(''),
            neon_js_1.sc.ContractParam.integer(instanceId)
        ];
        return await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
    }
    static async setInstanceAccessMode(node, networkMagic, contractHash, instanceId, accessMode, signer) {
        const method = "set_instance_access_mode";
        const param = [
            neon_js_1.sc.ContractParam.integer(instanceId),
            neon_js_1.sc.ContractParam.integer(accessMode)
        ];
        return await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
    }
    static async setInstanceAuthorizedUsers(node, networkMagic, contractHash, instanceId, authorizedUsers, signer) {
        const method = "set_instance_authorized_users";
        const usersFormatted = authorizedUsers.map((user) => {
            return neon_js_1.sc.ContractParam.hash160(user);
        });
        const param = [
            neon_js_1.sc.ContractParam.integer(instanceId),
            neon_js_1.sc.ContractParam.array(...usersFormatted)
        ];
        return await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
    }
    static async setInstanceAuthorizedContracts(node, networkMagic, contractHash, instanceId, authorizedContracts, signer) {
        const method = "set_instance_authorized_contracts";
        const contractsFormatted = authorizedContracts.map((contract) => {
            return neon_js_1.sc.ContractParam.array(neon_js_1.sc.ContractParam.hash160(contract.scriptHash), neon_js_1.sc.ContractParam.integer(contract.code));
        });
        const param = [
            neon_js_1.sc.ContractParam.integer(instanceId),
            neon_js_1.sc.ContractParam.array(...contractsFormatted)
        ];
        return await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
    }
    static async setInstanceFee(node, networkMagic, contractHash, instanceId, fee, signer) {
        const method = "set_instance_fee";
        const param = [
            neon_js_1.sc.ContractParam.integer(instanceId),
            neon_js_1.sc.ContractParam.integer(fee)
        ];
        return await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, param, signer);
    }
    static async totalGenerators(node, networkMagic, contractHash, signer) {
        const method = "total_generators";
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
    static async totalGeneratorInstances(node, networkMagic, contractHash, signer) {
        const method = "total_generator_instances";
        const res = await (0, helpers_1.variableInvoke)(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
}
exports.GeneratorAPI = GeneratorAPI;
//# sourceMappingURL=generator.js.map