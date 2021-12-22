"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Epoch = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const fs_1 = __importDefault(require("fs"));
const DEFAULT_OPTIONS = {
    node: 'http://localhost:50012',
    scriptHash: '0xe938f1d44002853ffd41ff27ea890c8b5c69a204'
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
    async createEpoch(epoch, signer) {
        return api_1.EpochAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, epoch.label, epoch.traits, signer);
    }
    async createEpochFromFile(path, signer) {
        const localEpoch = JSON.parse(fs_1.default.readFileSync(path).toString());
        return api_1.EpochAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, localEpoch.label, localEpoch.traits, signer);
    }
    async getEpochJSON(epochId) {
        return api_1.EpochAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId);
    }
    async mintFromEpoch(epochId, signer) {
        return api_1.EpochAPI.mintFromEpoch(this.node.url, this.networkMagic, this.scriptHash, epochId, signer);
    }
    async totalEpochs() {
        return api_1.EpochAPI.totalEpochs(this.node.url, this.networkMagic, this.scriptHash);
    }
}
exports.Epoch = Epoch;
//# sourceMappingURL=Epoch.js.map