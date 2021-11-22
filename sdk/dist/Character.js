"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const neon_js_1 = require("@cityofzion/neon-js");
const DEFAULT_OPTIONS = {
    node: 'http://localhost:50012',
    scriptHash: '0x3f57010287f648889d1ce5264d4fa7839fdab000'
};
class Character {
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
    async balanceOf(address) {
        return api_1.CharacterAPI.balanceOf(this.node.url, this.networkMagic, this.scriptHash, address);
    }
    async decimals() {
        return api_1.CharacterAPI.decimals(this.node.url, this.networkMagic, this.scriptHash);
    }
    async deploy(data, upgrade, signer) {
        return api_1.CharacterAPI.deploy(this.node.url, this.networkMagic, this.scriptHash, data, upgrade, signer);
    }
    async getAttributeMod(attributeValue) {
        return api_1.CharacterAPI.getAttributeMod(this.node.url, this.networkMagic, this.scriptHash, attributeValue);
    }
    async getAuthorizedAddresses() {
        return api_1.CharacterAPI.getAuthorizedAddresses(this.node.url, this.networkMagic, this.scriptHash);
    }
    async getCharacterRaw(tokenId) {
        return api_1.CharacterAPI.getCharacterRaw(this.node.url, this.networkMagic, this.scriptHash, tokenId);
    }
    async ownerOf(tokenId) {
        return api_1.CharacterAPI.ownerOf(this.node.url, this.networkMagic, this.scriptHash, tokenId);
    }
    async mint(signer) {
        return api_1.CharacterAPI.mint(this.node.url, this.networkMagic, this.scriptHash, signer.address, signer);
    }
    async properties(tokenId) {
        return api_1.CharacterAPI.properties(this.node.url, this.networkMagic, this.scriptHash, tokenId);
    }
    async purchase(signer) {
        const method = "transfer";
        const GASScriptHash = "0xd2a4cff31913016155e38e474a2c06d08be276cf";
        const GASPrecision = 10 ** 8;
        const purchasePrice = 1;
        const params = [
            neon_js_1.sc.ContractParam.hash160(signer.address),
            neon_js_1.sc.ContractParam.hash160(this.scriptHash),
            neon_js_1.sc.ContractParam.integer(purchasePrice * GASPrecision),
            neon_js_1.sc.ContractParam.any()
        ];
        try {
            const res = await api_1.NeoInterface.publishInvoke(this.node.url, this.networkMagic, GASScriptHash, method, params, signer);
            return res;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async rollDie(die) {
        return api_1.CharacterAPI.rollDie(this.node.url, this.networkMagic, this.scriptHash, die);
    }
    async rollDiceWithEntropy(die, precision, entropy) {
        return api_1.CharacterAPI.rollDiceWithEntropy(this.node.url, this.networkMagic, this.scriptHash, die, precision, entropy);
    }
    async rollInitialStat() {
        return api_1.CharacterAPI.rollInitialStat(this.node.url, this.networkMagic, this.scriptHash);
    }
    async rollInitialStateWithEntropy(entropy) {
        return api_1.CharacterAPI.rollInitialStatWithEntropy(this.node.url, this.networkMagic, this.scriptHash, entropy);
    }
    async setAuthorizedAddress(address, authorized, signer) {
        return api_1.CharacterAPI.setAuthorizedAddress(this.node.url, this.networkMagic, this.scriptHash, address, authorized, signer);
    }
    async symbol() {
        return api_1.CharacterAPI.symbol(this.node.url, this.networkMagic, this.scriptHash);
    }
    async tokens() {
        return api_1.CharacterAPI.tokens(this.node.url, this.networkMagic, this.scriptHash);
    }
    async tokensOf(address) {
        return api_1.CharacterAPI.tokensOf(this.node.url, this.networkMagic, this.scriptHash, address);
    }
    async transfer(to, tokenId, signer, data) {
        return api_1.CharacterAPI.transfer(this.node.url, this.networkMagic, this.scriptHash, to, tokenId, signer, data);
    }
    async totalSupply() {
        return api_1.CharacterAPI.totalSupply(this.node.url, this.networkMagic, this.scriptHash);
    }
    async update(script, manifest, signer) {
        return api_1.CharacterAPI.update(this.node.url, this.networkMagic, this.scriptHash, script, manifest, signer);
    }
}
exports.Character = Character;
//# sourceMappingURL=Character.js.map