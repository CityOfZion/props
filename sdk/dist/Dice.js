"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dice = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const DEFAULT_OPTIONS = {
    node: 'http://localhost:50012',
    scriptHash: '0x3f57010287f648889d1ce5264d4fa7839fdab000'
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
    async rollDie(die) {
        return api_1.DiceAPI.rollDie(this.node.url, this.networkMagic, this.scriptHash, die);
    }
    async rollDiceWithEntropy(die, precision, entropy) {
        return api_1.DiceAPI.rollDiceWithEntropy(this.node.url, this.networkMagic, this.scriptHash, die, precision, entropy);
    }
    async rollInitialStat() {
        return api_1.DiceAPI.rollInitialStat(this.node.url, this.networkMagic, this.scriptHash);
    }
    async rollInitialStateWithEntropy(entropy) {
        return api_1.DiceAPI.rollInitialStatWithEntropy(this.node.url, this.networkMagic, this.scriptHash, entropy);
    }
}
exports.Dice = Dice;
//# sourceMappingURL=Dice.js.map