import { rpc, wallet } from '@cityofzion/neon-core';
import { PropConstructorOptions } from "./interface";
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
export declare class Dice {
    private options;
    private networkMagic;
    constructor(options?: PropConstructorOptions);
    /**
     * Gets the magic number for the network and configures the class instance.
     */
    init(): Promise<void>;
    /**
     * The the node that the instance is connected to.
     */
    get node(): rpc.RPCClient;
    /**
     * The contract script hash that is being interfaced with.
     */
    get scriptHash(): string;
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
    randBetween(start: number, end: number, signer?: wallet.Account): Promise<number | string>;
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
    mapBytesOntoRange(start: number, end: number, entropy: string, signer?: wallet.Account): Promise<number | string>;
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
    rollDie(die: string, signer?: wallet.Account): Promise<number | string>;
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
    rollDiceWithEntropy(die: string, precision: number, entropy: string, signer?: wallet.Account): Promise<any>;
}
