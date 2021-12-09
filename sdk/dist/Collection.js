"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const neon_js_1 = require("@cityofzion/neon-js");
const collection_1 = require("./api/collection");
const fs_1 = __importDefault(require("fs"));
const DEFAULT_OPTIONS = {
    node: 'http://localhost:50012',
    scriptHash: '0xa80d045ca80e0421aa855c3a000bfbe5dddadced'
};
class Collection {
    constructor(options = {}) {
        this.networkMagic = -1;
        this.options = lodash_1.merge({}, DEFAULT_OPTIONS, options);
    }
    async init() {
        const getVersionRes = await this.node.getVersion();
        this.networkMagic = getVersionRes.protocol.network;
    }
    get node() {
        if (this.options.node) {
            return new neon_core_1.rpc.RPCClient(this.options.node);
        }
        throw new Error('no node selected!');
    }
    get scriptHash() {
        if (this.options.scriptHash) {
            return this.options.scriptHash;
        }
        throw new Error('scripthash defined');
    }
    async createCollection(description, collectionType, extra, values, signer) {
        return collection_1.CollectionAPI.createCollection(this.node.url, this.networkMagic, this.scriptHash, description, collectionType, extra, values, signer);
    }
    async createFromFile(path, signer) {
        const localCollection = JSON.parse(fs_1.default.readFileSync(path).toString());
        const formattedValues = localCollection.values.map((value) => {
            switch (localCollection.type) {
                case 'string':
                    return neon_js_1.sc.ContractParam.string(value);
                case 'int':
                    return neon_js_1.sc.ContractParam.integer(value);
            }
        });
        return collection_1.CollectionAPI.createCollectionRaw(this.node.url, this.networkMagic, this.scriptHash, localCollection.description, localCollection.type, localCollection.extra, formattedValues, signer);
    }
    async getCollectionJSON(collectionId, signer) {
        return collection_1.CollectionAPI.getCollectionJSON(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer);
    }
    async getCollection(collectionId, signer) {
        return collection_1.CollectionAPI.getCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer);
    }
    async getCollectionElement(collectionId, index, signer) {
        return collection_1.CollectionAPI.getCollectionElement(this.node.url, this.networkMagic, this.scriptHash, collectionId, index, signer);
    }
    async getCollectionLength(collectionId, signer) {
        return collection_1.CollectionAPI.getCollectionLength(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer);
    }
    async getCollectionValues(collectionId, signer) {
        return collection_1.CollectionAPI.getCollectionValues(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer);
    }
    async mapBytesOntoCollection(collectionId, entropy, signer) {
        return collection_1.CollectionAPI.mapBytesOntoCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, entropy, signer);
    }
    async sampleFromCollection(collectionId, signer) {
        return collection_1.CollectionAPI.sampleFromCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer);
    }
    async totalCollections(signer) {
        return collection_1.CollectionAPI.totalCollections(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map