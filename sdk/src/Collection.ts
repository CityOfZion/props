import { CollectionType, SmartContractConfig } from './types'
import { ContractInvocation } from '@cityofzion/neo3-invoker'
import fs from 'fs'


/**
 * The Collection prop is designed to store static-immutable data for reference in other projects. Storing static data
 * in contracts is very expensive and inefficient, especially for new projects.  This contract resolves that issue by creating
 * library for static data. This class exposes the interface along with a number of helpful features to make the smart
 * contract easy to use for typescript developers.
 *
 * All of the props smart contract interface classes will need a scripthash, and a `Neo3-Invoker` and `Neo3Parser` to be initialized.  For more information on deploying
 * contract packages, refer to the [quickstart](https://props.coz.io/d/docs/sdk/ts/#quickstart).
 *
 * To use this class:
 * ```typescript
 * import { Collection } from "@cityofzion/props"
 *
 * 
 * const node = //refer to dora.coz.io/monitor for a list of nodes.
 * const scriptHash = //refer to the scriptHashes section above
 * const neo3Invoker = await NeonInvoker.init(node) // need to instantiate a Neo3Invoker, currently only NeonInvoker implements this interface
 * const neo3Parser = NeonParser // need to use a Neo3Parser, currently only NeonParser implements this interface
 * const puppet = await new Collection({
 *       scriptHash,
 *       invoker: neo3Invoker,
 *       parser: neo3Parser,
 * })
 * 
 * const total = await collection.totalCollections()
 * console.log(total) // outputs the total collection count in the contract
 * ```
 */
export class Collection {

  static MAINNET = '0xf05651bc505fd5c7d36593f6e8409932342f9085'
  static TESTNET = ''
  
  constructor(
    private config: SmartContractConfig
  ) {}

	
  /**
   * Publishes an array of immutable data to the smart contract along with some useful metadata.
   *
   * @param options.description A useful description of the collection.
   * @param options.collectionType The type of the data being store.  This is an unregulated field.  Standard NVM datatypes should
   * adhere to existing naming conventions.
   * @param options.extra An unregulated field for unplanned feature development.
   * @param options.values An array of values that represent the body of the collection.
   * @param options.signer The signer of the transaction.
   *
   * @returns The transaction id of a transaction that will return the new collection id.
   */
  async createCollection(options: {description: string, collectionType: string, extra: string, values: (string|number)[]}): Promise<string> {
    const res = await this.config.invoker.invokeFunction({
      invocations: [
        Collection.buildCreateCollectionInvocation(
					this.config.scriptHash, 
					{
            description: options.description,
            collectionType: options.collectionType,
            extra: options.extra,
            values: options.values,
          }
				)
      ],
      signers: [],
    })

    return res
  }

  /**
   * Loads a {@link CollectionType} formatted JSON file and pushes it to the smart contract.
   *
   * @param path The path to the file.
   *
   * @returns The transaction id of a transaction that will return the new collection id.
   */
  async createFromFile(path: string): Promise<string> {
    const localCollection = JSON.parse(fs.readFileSync(path).toString()) as CollectionType

    const res = await this.config.invoker.invokeFunction({
      invocations: [
        Collection.buildCreateCollectionInvocation(
					this.config.scriptHash, 
					{
            description: localCollection.description,
            collectionType: localCollection.type,
            extra: localCollection.extra,
            values: localCollection.values as string[],
          }
				)
      ],
      signers: [],
    })

    return res
  }

  /**
   * Gets a JSON formatting collection from the smart contract.
   *
   * @param options.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   *
   * @returns The requested collection.
   */
  async getCollectionJSON(options: {collectionId: number}): Promise<CollectionType> {
    const res = await this.config.invoker.testInvoke({
			invocations: [
				Collection.buildGetCollectionJSONInvocation(
					this.config.scriptHash, 
					{collectionId: options.collectionId}
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
   * Gets the bytestring representation of the collection.  This is primarilly used for inter-contract interfacing,
   * but we include it here for completeness.
   *
   * @param options.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * 
   * @returns The requested collection.
   */
  async getCollection(options: {collectionId: number}): Promise<string> {
    const res = await this.config.invoker.testInvoke({
			invocations: [
				Collection.buildGetCollectionInvocation(
					this.config.scriptHash, 
					{collectionId: options.collectionId}
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
   * Returns the value of a collection from a requested index.
   *
   * @param options.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param options.index The index of the array element being requested.
   *
   * @returns The value of the collection element.
   */
  async getCollectionElement(options: {collectionId: number, index: number}): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        Collection.buildGetCollectionElementInvocation(
          this.config.scriptHash, 
          {collectionId: options.collectionId, index: options.index}
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
   * Gets the array length of a requested collection.
   *
   * @param options.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   *
   * @returns The length of the collection.
   */
  async getCollectionLength(options: {collectionId: number}): Promise<number> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        Collection.buildGetCollectionLengthInvocation(
          this.config.scriptHash, 
          {collectionId: options.collectionId}
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
   * Gets the values of a collection, omitting the metadata.
   *
   * @param options.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   *
   * @returns The values in the collection.
   */
  async getCollectionValues(options: {collectionId: number}): Promise<(string|number)[]> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        Collection.buildGetCollectionValuesInvocation(
          this.config.scriptHash, 
          {collectionId: options.collectionId}
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
   * Maps byte entropy onto a collection's values and returns the index of the result.  The mapping is made as follows:
   *
   * [0 -> MAX(entropyBytes.length)][entropy] -> [0 -> collection.length][index]
   *
   * This method is primarily useful for computationally efficient contract interfacing. For random sampling, or
   * sampling from a distribution, use {@link getCollectionLength} in combination with {@link getCollectionElement} or
   * {@link sampleFromCollection}.
   *
   * @param options.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param options.entropy Bytes to use for the mapping.
   *
   * @returns The element from the mapping.
   */
  async mapBytesOntoCollection(options: {collectionId: number, entropy: string}): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        Collection.buildMapBytesOntoCollectionInvocation(
          this.config.scriptHash, 
          {
            collectionId: options.collectionId, 
            entropy: options.entropy
          }
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
   * Samples a uniform random value from the collection using a Contract.Call to the {@link Dice} contract.
   *
   * @param options.collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param options.samples The number of samples to return
   *
   * @returns The transaction id of a transaction that will return a uniform random sample from the collection.
   * 
   * **Note:** This method will not randomly generate unless the transaction is published so use the signer field for
   * testing.
   */
     async sampleFromCollection(options: {collectionId: number, samples: number}): Promise<string> {
      return await this.config.invoker.invokeFunction({
        invocations: [
          Collection.buildSampleFromCollectionInvocation(
            this.config.scriptHash, 
            {
              collectionId: options.collectionId, 
              samples: options.samples
            }
          )
        ],
        signers: [],
      })
  
    }
  
  /**
   * Samples uniformly from a collection provided at the time of invocation.  Users have the option to 'pick', which
   * prevents a value from being selected multiple times.  The results are published as outputs on the transaction.
   * @param options.values an array of values to sample from
   * @param options.samples the number of samples to fairly select from the values
   * @param options.pick Are selected values removed from the list of options for future samples?
   * 
   * @returns The transaction id of a transaction that will return a uniform random sample from the collection.
   * 
   * **Note:** This method will not randomly generate unless the transaction is published so use the signer field for
   * testing.
   */
  async sampleFromRuntimeCollection(options: {values: string[], samples: number, pick: boolean}): Promise<string> {    
    return await this.config.invoker.invokeFunction({
      invocations: [
        Collection.buildSampleFromRuntimeCollectionInvocation(
					this.config.scriptHash, 
					{values: options.values, samples: options.samples, pick: options.pick}
				)
      ],
      signers: [],
    })
  }

  /**
   * Gets the total collections.  Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
   * planning to iterate of their collection IDs.
   *
   * @returns The total number of collections stored in the contract.
   */
  async totalCollections(): Promise<number> {
		const res = await this.config.invoker.testInvoke({
			invocations: [
				Collection.buildTotalCollectionsInvocation(
					this.config.scriptHash
				)
			],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}

		return this.config.parser.parseRpcResponse(res.stack[0])
  }
  
  async update(options: {script: string, manifest: string, data?: any}): Promise<string> {
    options.data = options.data || ''

    return await this.config.invoker.invokeFunction({
      invocations: [
        Collection.buildUpdateInvocation(this.config.scriptHash, {
          script: options.script,
          manifest: options.manifest,
          data: options.data
        })
      ],
      signers: [],
    })
  }

  static buildCreateCollectionInvocation(scriptHash: string, params: {description: string, collectionType: string, extra: string, values: (string|number)[]}): ContractInvocation{
    return {
      scriptHash,
      operation: 'create_collection',
      args: [
        {type: 'String', value: params.description},
        {type: 'String', value: params.collectionType},
        {type: 'String', value: params.extra},
        {type: 'Array', value: params.values.map(value => ({type: params.collectionType == 'string' ? 'String' : 'Integer', value:value}))},
      ]
    }
  }
  
  static buildGetCollectionJSONInvocation(scriptHash: string, params: {collectionId: number}): ContractInvocation{
    return {
      scriptHash,
      operation: 'get_collection_json',
      args: [
        {type: 'Integer', value: params.collectionId},
      ]
    }
  }
  
  static buildGetCollectionInvocation(scriptHash: string, params: {collectionId: number}): ContractInvocation{
    return {
      scriptHash,
      operation: 'get_collection',
      args: [
        {type: 'Integer', value: params.collectionId},
      ]
    }
  }
  
  static buildGetCollectionElementInvocation(scriptHash: string, params: {collectionId: number, index: number}): ContractInvocation{
    return {
      scriptHash,
      operation: 'get_collection_element',
      args: [
        {type: 'Integer', value: params.collectionId},
        {type: 'Integer', value: params.index},
      ]
    }
  }
  
  static buildGetCollectionLengthInvocation(scriptHash: string, params: {collectionId: number}): ContractInvocation{
    return {
      scriptHash,
      operation: 'get_collection_length',
      args: [
        {type: 'Integer', value: params.collectionId},
      ]
    }
  }
  
  static buildGetCollectionValuesInvocation(scriptHash: string, params: {collectionId: number}): ContractInvocation{
    return {
      scriptHash,
      operation: 'get_collection_values',
      args: [
        {type: 'Integer', value: params.collectionId},
      ]
    }
  }
  
  static buildMapBytesOntoCollectionInvocation(scriptHash: string, params: {collectionId: number, entropy: string}): ContractInvocation{
    return {
      scriptHash,
      operation: 'map_bytes_onto_collection',
      args: [
        {type: 'Integer', value: params.collectionId},
        {type: 'String', value: params.entropy},
      ]
    }
  }
  
  static buildSampleFromCollectionInvocation(scriptHash: string, params: {collectionId: number, samples: number}): ContractInvocation{
    return {
      scriptHash,
      operation: 'sample_from_collection',
      args: [
        {type: 'Integer', value: params.collectionId},
        {type: 'Integer', value: params.samples},
      ]
    }
  }
  
  static buildSampleFromRuntimeCollectionInvocation(scriptHash: string, params: {values: string[], samples: number, pick: boolean}): ContractInvocation{
    return {
      scriptHash,
      operation: 'sample_from_runtime_collection',
      args: [
        {type: 'Array', value: params.values.map(value => ({type: 'String', value:value}))},
        {type: 'Integer', value: params.samples},
        {type: 'Boolean', value: params.pick},
      ]
    }
  }
  
  static buildTotalCollectionsInvocation(scriptHash: string): ContractInvocation{
    return {
      scriptHash,
      operation: 'total_collections',
      args: []
    }
  }
  
  static buildUpdateInvocation(scriptHash: string, params: {script: string, manifest: string, data: any}): ContractInvocation{
    return {
      scriptHash,
      operation: 'update',
      args: [
        {type: 'ByteArray', value: params.script},
        {type: 'String', value: params.manifest},
        {type: 'Any', value: params.data},
      ]
    }
  }
  
}