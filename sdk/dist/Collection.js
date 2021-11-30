"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const collection_1 = require("./api/collection");
const DEFAULT_OPTIONS = {
    node: 'http://localhost:50012',
    scriptHash: '0x3f57010287f648889d1ce5264d4fa7839fdab000'
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
        throw new Error('node scripthash defined');
    }
    async totalCollections() {
        return collection_1.CollectionAPI.totalCollections(this.node.url, this.networkMagic, this.scriptHash);
    }
    async createCollection(description, collectionType, extra, values, signer) {
        return collection_1.CollectionAPI.createCollection(this.node.url, this.networkMagic, this.scriptHash, description, collectionType, extra, values, signer);
    }
    async getCollection(collectionId) {
        return collection_1.CollectionAPI.getCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId);
    }
    async getCollectionElement(collectionId, index) {
        return collection_1.CollectionAPI.getCollectionElement(this.node.url, this.networkMagic, this.scriptHash, collectionId, index);
    }
    async getCollectionJSON(collectionId) {
        return collection_1.CollectionAPI.getCollectionJSON(this.node.url, this.networkMagic, this.scriptHash, collectionId);
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map