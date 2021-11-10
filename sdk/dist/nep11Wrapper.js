"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nep11Wrapper = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const DEFAULT_OPTIONS = {
    node: 'http://localhost:50012',
    scriptHash: '0x3f57010287f648889d1ce5264d4fa7839fdab000'
};
class Nep11Wrapper {
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
    async deploy(data, upgrade, account) {
        return api_1.Nep11.deploy(this.node.url, this.networkMagic, this.scriptHash, data, upgrade, account);
    }
    async balanceOf(address) {
        return api_1.Nep11.balanceOf(this.node.url, this.networkMagic, this.scriptHash, address);
    }
    async decimals() {
        return api_1.Nep11.decimals(this.node.url, this.networkMagic, this.scriptHash);
    }
    async mint(meta, royalties, data, account) {
        return api_1.Nep11.mint(this.node.url, this.networkMagic, this.scriptHash, account.address, meta, royalties, data, account);
    }
    async ownerOf(tokenId) {
        return api_1.Nep11.ownerOf(this.node.url, this.networkMagic, this.scriptHash, tokenId);
    }
    async properties(tokenId) {
        return api_1.Nep11.properties(this.node.url, this.networkMagic, this.scriptHash, tokenId);
    }
    async symbol() {
        return api_1.Nep11.symbol(this.node.url, this.networkMagic, this.scriptHash);
    }
    async tokens() {
        return api_1.Nep11.tokens(this.node.url, this.networkMagic, this.scriptHash);
    }
    async tokensOf(address) {
        return api_1.Nep11.tokensOf(this.node.url, this.networkMagic, this.scriptHash, address);
    }
    async totalSupply() {
        return api_1.Nep11.totalSupply(this.node.url, this.networkMagic, this.scriptHash);
    }
}
exports.Nep11Wrapper = Nep11Wrapper;
//# sourceMappingURL=nep11Wrapper.js.map