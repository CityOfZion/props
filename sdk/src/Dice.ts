import { SmartContractConfig } from './types'
import { ContractInvocation } from '@cityofzion/neo3-invoker'
import { Neo3Parser } from '@cityofzion/neo3-parser'




/**
 * The dice prop normalizes a lot of behaviors associated with random number generation to improve usability within
 * projects.
 *
 * All of the props smart contract interface classes will need a scripthash, and a `Neo3-Invoker` and `Neo3Parser` to be initialized.  For more information on deploying
 * contract packages, refer to the [quickstart](https://props.coz.io/d/docs/sdk/ts/#quickstart).
 *
 * To use this class:
 * ```typescript
 * import { Dice } from "@cityofzion/props"
 *
 * const node = //refer to dora.coz.io/monitor for a list of nodes.
 * const scriptHash = //refer to the scriptHashes section above
 * const account = // need to send either an wallet.Account() or undefined, testInvokes don't need an account
 * const neo3Invoker = await NeonInvoker.init(node, account) // need to instantiate a Neo3Invoker, currently only NeonInvoker implements this interface
 * const neo3Parser = NeonParser // need to use a Neo3Parser, currently only NeonParser implements this interface
 * const dice = await new Dice({
 *       scriptHash,
 *       invoker: neo3Invoker,
 *       parser: neo3Parser,
 * })
 *
 * const randomNumber = await dice.randBetween({ start: 0, end: 100 })
 * console.log(randomNumber)
 * ```
 */
export class Dice {
  static MAINNET = '0x4380f2c1de98bb267d3ea821897ec571a04fe3e0'
  static TESTNET = ''

	private config: SmartContractConfig

	constructor(configOptions: SmartContractConfig) {
			this.config = configOptions
	}
    
  
  /**
   * Gets a random number of range [start -> end] inclusive. This method supports negative integer ranges.
   *
   * **Note:**
   * This method must include a signer to produce truly random numbers.
   *
   * @param options.start the minimum value for the selection range.
   * @param options.end the maximum value for the selection range.
   *
   * @returns The transaction id of a transaction that will return the random number.
   */
	async randBetween(options: {start: number, end: number}): Promise<string> {
    const res = await this.config.invoker.invokeFunction({
      invocations: [
        Dice.buildRandBetweenInvocation(
					this.config.scriptHash, 
					{start: options.start, end: options.end}
				)
      ],
      signers: [],
    })

    return res
  }


	/**
   * Maps bytes onto a range of numbers:
   *
   * [0 -> Max(entropy.length)][entropy] --> [start, end]
   *
   * @param options.start the minimum value for the selection range.
   * @param options.end the maximum value for the selection range.
   * @param options.entropy the bytes used in the sampling.
   *
   * @returns The resulting number from the mapping.
   */
	async mapBytesOntoRange(options: {start: number, end: number, entropy: string}): Promise<number | string> {
		const res = await this.config.invoker.testInvoke({
			invocations: [
				Dice.buildRandBetweenInvocation(
					this.config.scriptHash, 
					{start: options.start, end: options.end}
				)
			],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}

		return this.config.parser.parseRpcResponse(res.stack[0])
	}

	/**
   * Rolls for a `dX` formatted random number.
   *
   * **Note:**
   * This method must include a signer to produce truly random numbers.
   *
   * @param options.die The die to roll. The input format can support arbitarilly large dice which are effectively spherical..
   * or more traditional ones. e.g. 'd6'
   *
   * @returns The transaction id of a transaction that will return the result of the die roll.
   */
	async rollDie(options: {die: string}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        Dice.buildRollDieInvocation(this.config.scriptHash, {die: options.die})
      ],
      signers: [],
    })
	}

	/**
   * Calculates dice rolls using provided entropy.  This method will return and array of length `entropy.length / precision`.
   *
   * @param options.die The die to roll. The input format can support arbitarilly large dice which are effectively spherical..
   * or more traditional ones. e.g. 'd6'
   * @param options.precision The number of bytes to use for each sample.  Sampling at a precision below the fidelity of your range
   * will succeed, but your results will be overly-discrete.
   * @param options.entropy The bytes of data used to seed the sampling.
   *
   * @returns The transaction id of a transaction that will return the result an array of dice rolls.
   */
	async rollDiceWithEntropy(options: {die: string, precision: number, entropy: string}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        Dice.buildRollDieInvocation(this.config.scriptHash, {die: options.die})
      ],
      signers: [],
    })
	}
	

  static buildRandBetweenInvocation(scriptHash: string, params: {start: number, end: number}): ContractInvocation{
    return {
      scriptHash,
      operation: 'rand_between',
      args: [
        {type: 'Integer', value: params.start},
        {type: 'Integer', value: params.end},
      ]
    }
  }
  
  static buildMapBytesOntoRangeInvocation(scriptHash: string, params: {start: number, end: number, entropy: string}): ContractInvocation{
    return {
      scriptHash,
      operation: 'map_bytes_onto_range',
      args: [
        {type: 'Integer', value: params.start},
        {type: 'Integer', value: params.end},
        {type: 'String', value: params.entropy},
      ]
    }
  }
  
  static buildRollDieInvocation(scriptHash: string, params: {die: string}): ContractInvocation{
    return {
      scriptHash,
      operation: 'roll_die',
      args: [
        {type: 'String', value: params.die},
      ]
    }
  }
  
  static buildRollDieWithEntropyInvocation(scriptHash: string, parser: Neo3Parser, params: {die: string, precision: number, }): ContractInvocation{
    return {
      scriptHash,
      operation: 'roll_die',
      args: [
        {type: 'ByteArray', value: parser.strToBase64(params.die)},
      ]
    }
  }
  
}