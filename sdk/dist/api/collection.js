"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const interface_1 = require("./interface");
class CollectionAPI {
    static async totalCollections(node, networkMagic, contractHash) {
        const method = "total_collections";
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    static async createCollection(node, networkMagic, contractHash, description, collection_type, extra, values, signer) {
        const method = "create_collection";
        const raw_traits = values.map((value) => {
            return neon_js_1.sc.ContractParam.string(value);
        });
        const params = [
            neon_js_1.sc.ContractParam.string(description),
            neon_js_1.sc.ContractParam.string(collection_type),
            neon_js_1.sc.ContractParam.string(extra),
            neon_js_1.sc.ContractParam.array(...raw_traits)
        ];
        return await interface_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, params, signer);
    }
    static async getCollectionElement(node, networkMagic, contractHash, collectionId, index) {
        const method = "get_collection_element";
        const param = [
            neon_js_1.sc.ContractParam.integer(collectionId),
            neon_js_1.sc.ContractParam.integer(index)
        ];
        try {
            const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, param);
            if (res === undefined || res.length === 0) {
                throw new Error("unrecognized response");
            }
            return neon_js_1.u.base642hex(res[0].value);
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    static async getCollection(node, networkMagic, contractHash, collectionId) {
        const method = "get_collection";
        const param = [
            neon_js_1.sc.ContractParam.integer(collectionId)
        ];
        try {
            const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, param);
            if (res === undefined || res.length === 0) {
                throw new Error("unrecognized response");
            }
            if (res[0] && res[0].value) {
                return neon_js_1.u.base642hex(res[0].value);
            }
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    static async getCollectionJSON(node, networkMagic, contractHash, collectionId) {
        const method = "get_collection_json";
        const param = [
            neon_js_1.sc.ContractParam.integer(collectionId)
        ];
        try {
            const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, param);
            if (res === undefined || res.length === 0) {
                throw new Error("unrecognized response");
            }
            const result = {
                id: 0,
                description: "",
                type: "",
                values: [],
                valuesRaw: []
            };
            if (res[0] && res[0].value) {
                res[0].value.forEach((entry) => {
                    let key = neon_js_1.u.hexstring2str(neon_js_1.u.base642hex(entry.key.value));
                    switch (key) {
                        case "id":
                            let bytes = neon_js_1.u.base642hex(entry.value.value);
                            result.id = parseInt(bytes, 16);
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
                        return neon_js_1.u.hexstring2str(neon_js_1.u.base642hex(value.value));
                    });
                    break;
                case "number":
                    result.values = result.valuesRaw.map((value) => {
                        let bytes = neon_js_1.u.base642hex(value);
                        return parseInt(bytes, 16);
                    });
                    break;
            }
            return result;
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
}
exports.CollectionAPI = CollectionAPI;
//# sourceMappingURL=collection.js.map