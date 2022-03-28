"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const neon_core_1 = require("@cityofzion/neon-core");
const helpers_1 = require("../helpers");
class CollectionAPI {
    static async createCollection(node, networkMagic, contractHash, description, collection_type, extra, values, signer) {
        const method = "create_collection";
        const raw_traits = values.map((value) => {
            return neon_js_1.sc.ContractParam.string(value);
        });
        const param = [
            neon_js_1.sc.ContractParam.string(description),
            neon_js_1.sc.ContractParam.string(collection_type),
            neon_js_1.sc.ContractParam.string(extra),
            neon_js_1.sc.ContractParam.array(...raw_traits)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return neon_js_1.u.base642hex(res[0].value);
    }
    static async createCollectionRaw(node, networkMagic, contractHash, description, collection_type, extra, values, signer) {
        const method = "create_collection";
        const param = [
            neon_js_1.sc.ContractParam.string(description),
            neon_js_1.sc.ContractParam.string(collection_type),
            neon_js_1.sc.ContractParam.string(extra),
            neon_js_1.sc.ContractParam.array(...values)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return neon_js_1.u.base642hex(res[0].value);
    }
    static async getCollectionJSON(node, networkMagic, contractHash, collectionId, signer) {
        const method = "get_collection_json";
        const param = [
            neon_js_1.sc.ContractParam.integer(collectionId)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        const result = {};
        if (res[0] && res[0].value) {
            res[0].value.forEach((entry) => {
                let key = neon_js_1.u.hexstring2str(neon_js_1.u.base642hex(entry.key.value));
                let bytes;
                switch (key) {
                    case "id":
                        bytes = neon_js_1.u.base642hex(entry.value.value);
                        result.id = parseInt(bytes, 16);
                        break;
                    case "author":
                        bytes = neon_js_1.u.base642hex(entry.value.value);
                        result.author = new neon_core_1.wallet.Account(bytes);
                        break;
                    case "type":
                        result.type = neon_js_1.u.hexstring2str(neon_js_1.u.base642hex(entry.value.value));
                        break;
                    case "description":
                        result.description = neon_js_1.u.hexstring2str(neon_js_1.u.base642hex(entry.value.value));
                        break;
                    case "values":
                        result.valuesRaw = entry.value.value;
                        break;
                }
            });
        }
        switch (result.type) {
            case "string":
                result.values = result.valuesRaw.map((value) => {
                    return helpers_1.formatter(value);
                });
                break;
            case "int":
                result.values = result.valuesRaw.map((value) => {
                    let bytes = helpers_1.formatter(value);
                    return parseInt(bytes, 16);
                });
                break;
        }
        return result;
    }
    static async getCollection(node, networkMagic, contractHash, collectionId, signer) {
        const method = "get_collection";
        const param = [
            neon_js_1.sc.ContractParam.integer(collectionId)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return neon_js_1.u.base642hex(res[0].value);
    }
    static async getCollectionElement(node, networkMagic, contractHash, collectionId, index, signer) {
        const method = "get_collection_element";
        const param = [
            neon_js_1.sc.ContractParam.integer(collectionId),
            neon_js_1.sc.ContractParam.integer(index)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return neon_js_1.u.base642hex(res[0].value);
    }
    static async getCollectionLength(node, networkMagic, contractHash, collectionId, signer) {
        const method = "get_collection_length";
        const param = [
            neon_js_1.sc.ContractParam.integer(collectionId)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
    static async getCollectionValues(node, networkMagic, contractHash, collectionId, signer) {
        const method = "get_collection_values";
        const param = [
            neon_js_1.sc.ContractParam.integer(collectionId)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return res[0].value.map((value) => {
            return neon_js_1.u.base642hex(value.value);
        });
    }
    static async mapBytesOntoCollection(node, networkMagic, contractHash, collectionId, entropy, signer) {
        const method = "map_bytes_onto_collection";
        const param = [
            neon_js_1.sc.ContractParam.integer(collectionId),
            neon_js_1.sc.ContractParam.string(entropy)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return neon_js_1.u.base642hex(res[0].value);
    }
    static async sampleFromCollection(node, networkMagic, contractHash, collectionId, samples, signer) {
        const method = "sample_from_collection";
        const param = [
            neon_js_1.sc.ContractParam.integer(collectionId),
            neon_js_1.sc.ContractParam.integer(samples)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return neon_js_1.u.base642hex(res[0].value);
    }
    static async sampleFromRuntimeCollection(node, networkMagic, contractHash, values, samples, pick, signer) {
        const method = "sample_from_runtime_collection";
        const raw_values = values.map((value) => {
            return neon_js_1.sc.ContractParam.string(value);
        });
        const param = [
            neon_js_1.sc.ContractParam.array(...raw_values),
            neon_js_1.sc.ContractParam.integer(samples),
            neon_js_1.sc.ContractParam.boolean(pick)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return neon_js_1.u.base642hex(res[0].value);
    }
    static async totalCollections(node, networkMagic, contractHash, signer) {
        const method = "total_collections";
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    static async update(node, networkMagic, contractHash, script, manifest, data, signer) {
        const method = "update";
        const params = [
            neon_js_1.sc.ContractParam.byteArray(script),
            neon_js_1.sc.ContractParam.string(manifest),
            neon_js_1.sc.ContractParam.any(data)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
        if (signer) {
            return res;
        }
        return helpers_1.formatter(res);
    }
}
exports.CollectionAPI = CollectionAPI;
//# sourceMappingURL=collection.js.map