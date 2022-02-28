"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Puppet = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const neon_js_1 = require("@cityofzion/neon-js");
const DEFAULT_OPTIONS = {
    node: 'http://localhost:50012',
    scriptHash: '0x2a0ecf3fbf820d0e1758a3b38e7936055f19d026'
};
class Puppet {
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
    async balanceOf(address, signer) {
        return api_1.PuppetAPI.balanceOf(this.node.url, this.networkMagic, this.scriptHash, address, signer);
    }
    async createEpoch(generatorId, mintFee, sysFee, maxSupply, signer) {
        return api_1.PuppetAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, generatorId, mintFee, sysFee, maxSupply, signer);
    }
    async decimals(signer) {
        return api_1.PuppetAPI.decimals(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async deploy(signer) {
        return api_1.PuppetAPI.deploy(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async getAttributeMod(attributeValue, signer) {
        return api_1.PuppetAPI.getAttributeMod(this.node.url, this.networkMagic, this.scriptHash, attributeValue, signer);
    }
    async getEpochJSON(epochId, signer) {
        return api_1.PuppetAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId, signer);
    }
    async getPuppetJSON(tokenId, signer) {
        return api_1.PuppetAPI.getPuppetJSON(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer);
    }
    async getPuppetRaw(tokenId, signer) {
        return api_1.PuppetAPI.getPuppetRaw(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer);
    }
    async ownerOf(tokenId, signer) {
        return api_1.PuppetAPI.ownerOf(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer);
    }
    async offlineMint(epochId, owner, signer) {
        return api_1.PuppetAPI.offlineMint(this.node.url, this.networkMagic, this.scriptHash, epochId, owner, signer);
    }
    async properties(tokenId, signer) {
        return api_1.PuppetAPI.properties(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer);
    }
    async purchase(epochId, signer) {
        const method = "transfer";
        const GASScriptHash = "0xd2a4cff31913016155e38e474a2c06d08be276cf";
        const epoch = await api_1.PuppetAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId);
        const EpochTyped = epoch;
        if (EpochTyped.totalSupply === EpochTyped.maxSupply) {
            throw new Error(`Epoch is out of Puppets: ${EpochTyped.totalSupply} / ${EpochTyped.maxSupply}`);
        }
        const purchasePrice = EpochTyped.mintFee;
        const params = [
            neon_js_1.sc.ContractParam.hash160(signer.address),
            neon_js_1.sc.ContractParam.hash160(this.scriptHash),
            neon_js_1.sc.ContractParam.integer(purchasePrice),
            neon_js_1.sc.ContractParam.integer(epochId)
        ];
        try {
            return await api_1.NeoInterface.publishInvoke(this.node.url, this.networkMagic, GASScriptHash, method, params, signer);
        }
        catch (e) {
            throw new Error("Something went wrong: " + e.message);
        }
    }
    async setMintFee(epochId, fee, signer) {
        return api_1.PuppetAPI.setMintFee(this.node.url, this.networkMagic, this.scriptHash, epochId, fee, signer);
    }
    async symbol(signer) {
        return api_1.PuppetAPI.symbol(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async tokens(signer) {
        return api_1.PuppetAPI.tokens(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async tokensOf(address, signer) {
        return api_1.PuppetAPI.tokensOf(this.node.url, this.networkMagic, this.scriptHash, address, signer);
    }
    async totalAccounts(signer) {
        return api_1.PuppetAPI.totalAccounts(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async totalEpochs(signer) {
        return api_1.PuppetAPI.totalEpochs(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async totalSupply(signer) {
        return api_1.PuppetAPI.totalSupply(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async transfer(to, tokenId, signer, data) {
        return api_1.PuppetAPI.transfer(this.node.url, this.networkMagic, this.scriptHash, to, tokenId, signer, data);
    }
    async update(script, manifest, signer) {
        return api_1.PuppetAPI.update(this.node.url, this.networkMagic, this.scriptHash, script, manifest, signer);
    }
}
exports.Puppet = Puppet;
//# sourceMappingURL=Puppet.js.map