"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dice = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const interface_1 = require("./interface");
const DEFAULT_OPTIONS = {
    network: interface_1.NetworkOption.LocalNet
};
/**
 * The dice prop normalizes a lot of behaviors associated with random number generation to improve usability within
 * projects.
 *
 * All of the prop helper classes will auto-configure your network settings.  The default configuration will interface with
 * the contract compiled with this project and deployed locally at http://localhost:50012.  For more information on deploying
 * contract packages, refer to the quickstart.
 *
 * All methods support a signer.  If the method can be run as a test-invoke, optionally populating the signer parameter
 * will publish the invocation and return the txid instead of the method response.
 *
 * To use this class:
 * ```typescript
 * import {Dice} from "../../dist" //import {Dice} from "@cityofzion/props
 *
 * const dice: Dice = new Dice()
 * await dice.init() // interfaces with the node to resolve network magic
 *
 * const randomNumber = await dice.randBetween(0, 100)
 * console.log(randomNumber) // outputs the random number. You should include a signer to the method above
 * for a truly random number.
 * ```
 */
class Dice {
    constructor(options = {}) {
        this.options = DEFAULT_OPTIONS;
        this.networkMagic = -1;
        switch (options.network) {
            case interface_1.NetworkOption.TestNet:
                this.options.node = 'https://testnet1.neo.coz.io:443';
                this.options.scriptHash = '0x4380f2c1de98bb267d3ea821897ec571a04fe3e0';
                break;
            case interface_1.NetworkOption.MainNet:
                this.options.node = 'https://mainnet1.neo.coz.io:443';
                this.options.scriptHash = '0x4380f2c1de98bb267d3ea821897ec571a04fe3e0';
                break;
            case interface_1.NetworkOption.LocalNet:
                this.options.node = 'http://127.0.0.1:50012';
                this.options.scriptHash = '0x16d6a0be0506b26e0826dd352724cda0defa7131';
                break;
        }
        this.options = (0, lodash_1.merge)({}, this.options, options);
    }
    /**
     * Gets the magic number for the network and configures the class instance.
     */
    async init() {
        const getVersionRes = await this.node.getVersion();
        this.networkMagic = getVersionRes.protocol.network;
    }
    /**
     * The the node that the instance is connected to.
     */
    get node() {
        if (this.options.node) {
            return new neon_core_1.rpc.RPCClient(this.options.node);
        }
        throw new Error('no node selected!');
    }
    /**
     * The contract script hash that is being interfaced with.
     */
    get scriptHash() {
        if (this.options.scriptHash) {
            return this.options.scriptHash;
        }
        throw new Error('node scripthash defined');
    }
    /**
     * Gets a random number of range [start -> end] inclusive. This method supports negative integer ranges.
     *
     * **Note:**
     * This method must include a  signer to produce truly random numbers.
     *
     * @param start the minimum value for the selection range.
     * @param end the maximum value for the selection range.
     * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
     * running the invocation as a test invoke.
     *
     * @returns The pseudo-random number. **OR** a txid if the signer parameter is populated.
     */
    async randBetween(start, end, signer) {
        return api_1.DiceAPI.randBetween(this.node.url, this.networkMagic, this.scriptHash, start, end, signer);
    }
    /**
     * Maps bytes onto a range of numbers:
     *
     * [0 -> Max(entropy.length)][entropy] --> [start, end]
     *
     * @param start the minimum value for the selection range.
     * @param end the maximum value for the selection range.
     * @param entropy the bytes used in the sampling.
     * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
     * running the invocation as a test invoke.
     *
     * @returns The resulting number from the mapping. **OR** a txid if the signer parameter is populated.
     */
    async mapBytesOntoRange(start, end, entropy, signer) {
        return api_1.DiceAPI.mapBytesOntoRange(this.node.url, this.networkMagic, this.scriptHash, start, end, entropy, signer);
    }
    /**
     * Rolls for a `dX` formatted random number.
     *
     * **Note:**
     * This method must include a  signer to produce truly random numbers.
     *
     * @param die The die to roll. The input format can support arbitarilly large dice which are effectively spherical..
     * or more traditional ones. e.g. 'd6'
     * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
     * running the invocation as a test invoke.
     *
     * @returns The result of the die roll **OR** a txid if the signer parameter is populated.
     */
    async rollDie(die, signer) {
        return api_1.DiceAPI.rollDie(this.node.url, this.networkMagic, this.scriptHash, die, signer);
    }
    /**
     * Calculates dice rolls using provided entropy.  This method will return and array of length `entropy.length / precision`.
     *
     * @param die The die to roll. The input format can support arbitarilly large dice which are effectively spherical..
     * or more traditional ones. e.g. 'd6'
     * @param precision The number of bytes to use for each sample.  Sampling at a precision below the fidelity of your range
     * will succeed, but your results will be overly-discrete.
     * @param entropy The bytes of data used to seed the sampling.
     * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
     * running the invocation as a test invoke.
     *
     * @returns An array of dice rolls. **OR** a txid if the signer parameter is populated.
     */
    async rollDiceWithEntropy(die, precision, entropy, signer) {
        return api_1.DiceAPI.rollDiceWithEntropy(this.node.url, this.networkMagic, this.scriptHash, die, precision, entropy, signer);
    }
}
exports.Dice = Dice;
//# sourceMappingURL=Dice.js.map