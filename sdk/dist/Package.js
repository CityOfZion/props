"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const neon_js_1 = require("@cityofzion/neon-js");
const interface_1 = require("./interface");
const DEFAULT_OPTIONS = {
    network: interface_1.NetworkOption.LocalNet
};
class Package {
    constructor(options = {}) {
        this.options = DEFAULT_OPTIONS;
        this.networkMagic = -1;
        switch (options.network) {
            case interface_1.NetworkOption.TestNet:
                this.options.node = 'https://testnet1.neo.coz.io:443';
                this.options.scriptHash = '0x1f7bc3162ecb3fc77a508aa4f69b9d2e86b3add4';
                break;
            case interface_1.NetworkOption.MainNet:
                this.options.node = 'https://mainnet1.neo.coz.io:443';
                this.options.scriptHash = '0x5728017130c213cbc369c738f470d66628e5acf2';
                break;
            default:
                this.options.node = 'http://127.0.0.1:50012';
                this.options.scriptHash = '0x5cd0c2173453211441095a921bf56d0b9cb09f33';
                break;
        }
        this.options = (0, lodash_1.merge)({}, this.options, options);
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
        return api_1.PackageAPI.balanceOf(this.node.url, this.networkMagic, this.scriptHash, address, signer);
    }
    async createEpoch(label, generatorInstanceId, chestId, mintFee, sysFee, maxSupply, signer) {
        return api_1.PackageAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, label, generatorInstanceId, chestId, mintFee, sysFee, maxSupply, signer);
    }
    async decimals(signer) {
        return api_1.PackageAPI.decimals(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async deploy(signer) {
        return api_1.PackageAPI.deploy(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async getEpochJSON(epochId, signer) {
        return api_1.PackageAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId, signer);
    }
    async getTokenJSON(tokenId, signer) {
        return api_1.PackageAPI.getTokenJSON(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer);
    }
    async getTokenRaw(tokenId, signer) {
        return api_1.PackageAPI.getTokenRaw(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer);
    }
    async ownerOf(tokenId, signer) {
        return api_1.PackageAPI.ownerOf(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer);
    }
    async offlineMint(epochId, owner, signer) {
        return api_1.PackageAPI.offlineMint(this.node.url, this.networkMagic, this.scriptHash, epochId, owner, signer);
    }
    async properties(tokenId, signer) {
        return api_1.PackageAPI.properties(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer);
    }
    async purchase(epochId, signer) {
        const method = "transfer";
        const GASScriptHash = "0xd2a4cff31913016155e38e474a2c06d08be276cf";
        const epoch = await api_1.PackageAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId);
        const EpochTyped = epoch;
        if (EpochTyped.totalSupply === EpochTyped.maxSupply) {
            throw new Error(`Epoch is out of Tokens: ${EpochTyped.totalSupply} / ${EpochTyped.maxSupply}`);
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
        return api_1.PackageAPI.setMintFee(this.node.url, this.networkMagic, this.scriptHash, epochId, fee, signer);
    }
    async symbol(signer) {
        return api_1.PackageAPI.symbol(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async tokens(signer) {
        return api_1.PackageAPI.tokens(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async tokensOf(address, signer) {
        return api_1.PackageAPI.tokensOf(this.node.url, this.networkMagic, this.scriptHash, address, signer);
    }
    async totalAccounts(signer) {
        return api_1.PackageAPI.totalAccounts(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async totalEpochs(signer) {
        return api_1.PackageAPI.totalEpochs(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async totalSupply(signer) {
        return api_1.PackageAPI.totalSupply(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async transfer(to, tokenId, signer, data) {
        return api_1.PackageAPI.transfer(this.node.url, this.networkMagic, this.scriptHash, to, tokenId, signer, data);
    }
    async update(script, manifest, signer) {
        return api_1.PackageAPI.update(this.node.url, this.networkMagic, this.scriptHash, script, manifest, '', signer);
    }
}
exports.Package = Package;
//# sourceMappingURL=Package.js.map