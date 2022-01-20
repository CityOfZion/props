"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Epoch = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const helpers_1 = require("./helpers");
const fs_1 = __importDefault(require("fs"));
const DEFAULT_OPTIONS = {
    node: 'http://localhost:50012',
    scriptHash: '0xccff6257a59416028105709bc1e488a36ffeb9b2'
};
class Epoch {
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
    async createEpoch(epoch, signer, timeConstantMS) {
        const txids = [];
        let txid = await api_1.EpochAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, epoch.label, signer);
        txids.push(txid);
        await helpers_1.sleep(timeConstantMS);
        const res = await helpers_1.txDidComplete(this.node.url, txid, false);
        for await (let trait of epoch.traits) {
            txid = await api_1.EpochAPI.createTrait(this.node.url, this.networkMagic, this.scriptHash, res[0], trait.label, trait.slots, trait.traitLevels, signer);
            txids.push(txid);
        }
        return txids;
    }
    async createEpochFromFile(path, signer, timeConstantMS) {
        const localEpoch = JSON.parse(fs_1.default.readFileSync(path).toString());
        return this.createEpoch(localEpoch, signer, timeConstantMS);
    }
    async getEpochJSON(epochId, signer) {
        return api_1.EpochAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId, signer);
    }
    async getEpochInstanceJSON(instanceId, signer) {
        return api_1.EpochAPI.getEpochInstanceJSON(this.node.url, this.networkMagic, this.scriptHash, instanceId, signer);
    }
    async createInstance(epochId, signer) {
        return api_1.EpochAPI.createInstance(this.node.url, this.networkMagic, this.scriptHash, epochId, signer);
    }
    async mintFromEpoch(epochId, signer) {
        return api_1.EpochAPI.mintFromEpoch(this.node.url, this.networkMagic, this.scriptHash, epochId, signer);
    }
    async mintFromInstance(instanceId, signer) {
        return api_1.EpochAPI.mintFromInstance(this.node.url, this.networkMagic, this.scriptHash, instanceId, signer);
    }
    async setInstanceAuthorizedUsers(instanceId, authorizedUsers, signer) {
        return api_1.EpochAPI.setInstanceAuthorizedUsers(this.node.url, this.networkMagic, this.scriptHash, instanceId, authorizedUsers, signer);
    }
    async totalEpochs(signer) {
        return api_1.EpochAPI.totalEpochs(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async totalEpochInstances(signer) {
        return api_1.EpochAPI.totalEpochInstances(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
}
exports.Epoch = Epoch;
//# sourceMappingURL=Epoch.js.map