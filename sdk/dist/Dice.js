"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dice = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const DEFAULT_OPTIONS = {
    node: 'http://localhost:50012',
    scriptHash: '0x68021f61e872098627da52dc82ca793575c83826'
};
class Dice {
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
    async randBetween(start, end, signer) {
        return api_1.DiceAPI.randBetween(this.node.url, this.networkMagic, this.scriptHash, start, end, signer);
    }
    async mapBytesOntoRange(start, end, entropy, signer) {
        return api_1.DiceAPI.mapBytesOntoRange(this.node.url, this.networkMagic, this.scriptHash, start, end, entropy, signer);
    }
    async rollDie(die, signer) {
        return api_1.DiceAPI.rollDie(this.node.url, this.networkMagic, this.scriptHash, die, signer);
    }
    async rollDiceWithEntropy(die, precision, entropy, signer) {
        return api_1.DiceAPI.rollDiceWithEntropy(this.node.url, this.networkMagic, this.scriptHash, die, precision, entropy, signer);
    }
}
exports.Dice = Dice;
//# sourceMappingURL=Dice.js.map