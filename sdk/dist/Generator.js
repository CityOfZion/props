"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const interface_1 = require("./interface");
const helpers_1 = require("./helpers");
const fs_1 = __importDefault(require("fs"));
const DEFAULT_OPTIONS = {
    network: interface_1.NetworkOption.LocalNet
};
class Generator {
    constructor(options = {}) {
        this.options = DEFAULT_OPTIONS;
        this.networkMagic = -1;
        switch (options.network) {
            case interface_1.NetworkOption.TestNet:
                this.options.node = 'https://testnet1.neo.coz.io:443';
                this.options.scriptHash = '0xdda8055789f0eb3c1d092c714a68ba3e631586c7';
                break;
            case interface_1.NetworkOption.MainNet:
                this.options.node = 'https://mainnet1.neo.coz.io:443';
                this.options.scriptHash = '0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9';
                break;
            default:
                this.options.node = 'http://localhost:50012';
                this.options.scriptHash = '0xa3e59ddc61b2d8ac42c519cee5ddaac83c7df276';
                break;
        }
        this.options = lodash_1.merge({}, this.options, options);
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
    async createGenerator(generator, signer, timeConstantMS) {
        const txids = [];
        let txid = await api_1.GeneratorAPI.createGenerator(this.node.url, this.networkMagic, this.scriptHash, generator.label, generator.baseGeneratorFee, signer);
        txids.push(txid);
        await helpers_1.sleep(timeConstantMS);
        const res = await helpers_1.txDidComplete(this.node.url, txid, false);
        for await (let trait of generator.traits) {
            trait = trait;
            txid = await api_1.GeneratorAPI.createTrait(this.node.url, this.networkMagic, this.scriptHash, res[0], trait.label, trait.slots, trait.traitLevels, signer);
            txids.push(txid);
            await helpers_1.sleep(timeConstantMS);
        }
        return txids;
    }
    async createGeneratorFromFile(path, signer, timeConstantMS) {
        const localGenerator = JSON.parse(fs_1.default.readFileSync(path).toString());
        return this.createGenerator(localGenerator, signer, timeConstantMS);
    }
    async createTrait(generatorId, trait, signer) {
        return api_1.GeneratorAPI.createTrait(this.node.url, this.networkMagic, this.scriptHash, generatorId, trait.label, trait.slots, trait.traitLevels, signer);
    }
    async getGeneratorJSON(generatorId, signer) {
        const generator = await api_1.GeneratorAPI.getGeneratorJSON(this.node.url, this.networkMagic, this.scriptHash, generatorId, signer);
        const gType = generator;
        const traits = [];
        for (let i = 0; i < gType.traits.length; i++) {
            let trait = await api_1.GeneratorAPI.getTraitJSON(this.node.url, this.networkMagic, this.scriptHash, gType.traits[i]);
            traits.push(trait);
        }
        gType.traits = traits;
        return gType;
    }
    async getGeneratorInstanceJSON(instanceId, signer) {
        return api_1.GeneratorAPI.getGeneratorInstanceJSON(this.node.url, this.networkMagic, this.scriptHash, instanceId, signer);
    }
    async createInstance(generatorId, signer) {
        return api_1.GeneratorAPI.createInstance(this.node.url, this.networkMagic, this.scriptHash, generatorId, signer);
    }
    async mintFromInstance(instanceId, signer) {
        return api_1.GeneratorAPI.mintFromInstance(this.node.url, this.networkMagic, this.scriptHash, instanceId, signer);
    }
    async setInstanceAccessMode(instanceId, accessMode, signer) {
        return api_1.GeneratorAPI.setInstanceAccessMode(this.node.url, this.networkMagic, this.scriptHash, instanceId, accessMode, signer);
    }
    async setInstanceAuthorizedUsers(instanceId, authorizedUsers, signer) {
        return api_1.GeneratorAPI.setInstanceAuthorizedUsers(this.node.url, this.networkMagic, this.scriptHash, instanceId, authorizedUsers, signer);
    }
    async setInstanceAuthorizedContracts(instanceId, authorizedContracts, signer) {
        return api_1.GeneratorAPI.setInstanceAuthorizedContracts(this.node.url, this.networkMagic, this.scriptHash, instanceId, authorizedContracts, signer);
    }
    async setInstanceFee(instanceId, fee, signer) {
        return api_1.GeneratorAPI.setInstanceFee(this.node.url, this.networkMagic, this.scriptHash, instanceId, fee, signer);
    }
    async totalGenerators(signer) {
        return api_1.GeneratorAPI.totalGenerators(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async totalGeneratorInstances(signer) {
        return api_1.GeneratorAPI.totalGeneratorInstances(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
}
exports.Generator = Generator;
//# sourceMappingURL=Generator.js.map