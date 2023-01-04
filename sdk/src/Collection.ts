import {merge} from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import {sc} from "@cityofzion/neon-js";
import {CollectionType, NetworkOption, PropConstructorOptions} from "./interface";
import {CollectionAPI} from "./api";
import fs from 'fs'
import {ContractParamLike} from "@cityofzion/neon-core/lib/sc";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  network: NetworkOption.LocalNet
}

/**
 * The Collection prop is designed to store static-immutable data for reference in other projects. Storing static data
 * in contracts is very expensive and inefficient, especially for new projects.  This contract resolves that issue by creating
 * library for static data. This class exposes the interface along with a number of helpful features to make the smart
 * contract easy to use for typescript developers.
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
 * import {Collection} from "../../dist" //import {Collection} from "@cityofzion/props
 *
 * const collection: Collection = new Collection()
 * await collection.init() // interfaces with the node to resolve network magic
 *
 * const total = await collection.totalCollections()
 * console.log(total) // outputs the total collection count in the contract
 * ```
 */
export class Collection {
  private options: PropConstructorOptions = DEFAULT_OPTIONS
  private networkMagic: number = -1

  constructor(options: PropConstructorOptions = {}) {
    switch(options.network) {
      case NetworkOption.TestNet:
        this.options.node = 'https://testnet1.neo.coz.io:443'
        this.options.scriptHash = '0xe246d4c03d4d8c3fb529add124289e81a8eb6b6a'
        break
      case NetworkOption.MainNet:
        this.options.node = 'https://mainnet1.neo.coz.io:443'
        this.options.scriptHash = '0xf05651bc505fd5c7d36593f6e8409932342f9085'
        break
      default:
        this.options.node = 'http://127.0.0.1:50012'
        this.options.scriptHash = '0xffa8d18f1feec460d301bd755fabab793be4b7cb'
        break
    }
    this.options = merge({}, this.options, options)
  }

  /**
   * Gets the magic number for the network and configures the class instance.
   */
  async init() {
    const getVersionRes = await this.node.getVersion()
    this.networkMagic = getVersionRes.protocol.network
  }

  /**
   * The the node that the instance is connected to.
   */
  get node(): rpc.RPCClient {
    if (this.options.node) {
      return new rpc.RPCClient(this.options.node)
    }
    throw new Error('no node selected!')
  }

  /**
   * The contract script hash that is being interfaced with.
   */
  get scriptHash() : string {
    if (this.options.scriptHash) {
      return this.options.scriptHash
    }
    throw new Error('scripthash defined')
  }

  /**
   * Publishes an array of immutable data to the smart contract along with some useful metadata.
   *
   * @param description A useful description of the collection.
   * @param collectionType The type of the data being store.  This is an unregulated field.  Standard NVM datatypes should
   * adhere to existing naming conventions.
   * @param extra An unregulated field for unplanned feature development.
   * @param values An array of values that represent the body of the collection.
   * @param signer The signer of the transaction.
   *
   * @returns A transaction ID.  Refer to {@link helpers.txDidComplete} for parsing.
   */
  async createCollection(description: string, collectionType: string, extra: string, values: string[], signer: wallet.Account): Promise<string> {
    return CollectionAPI.createCollection(this.node.url, this.networkMagic, this.scriptHash, description, collectionType, extra,  values, signer)
  }

  /**
   * Loads a {@link CollectionType} formatted JSON file and pushes it to the smart contract.
   *
   * @param path The path to the file.
   * @param signer The signer of the transaction.
   *
   * @returns A transaction ID. Refer to {@link helper.txDidComplete} for parsing.
   */
  async createFromFile(path: string, signer: wallet.Account): Promise<string> {
    const localCollection = JSON.parse(fs.readFileSync(path).toString()) as CollectionType
    const formattedValues = (localCollection.values as any[]).map( (value: string | number) => {
      switch (localCollection.type) {
        case 'string':
          return sc.ContractParam.string(value as string)
        case 'int':
          return sc.ContractParam.integer(value as number)
      }
    }) as ContractParamLike[]
    return CollectionAPI.createCollectionRaw(this.node.url, this.networkMagic, this.scriptHash, localCollection.description, localCollection.type, localCollection.extra, formattedValues, signer)
  }

  /**
   * Gets a JSON formatting collection from the smart contract.
   *
   * @param collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
   * running the invocation as a test invoke.
   *
   * @returns The requested collection **OR** a txid if the signer parameter is populated.
   */
  async getCollectionJSON(collectionId: number, signer?: wallet.Account): Promise<CollectionType | string> {
    return CollectionAPI.getCollectionJSON(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer)
  }

  /**
   * Gets the bytestring representation of the collection.  This is primarilly used for inter-contract interfacing,
   * but we include it here for completeness.
   *
   * @param collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
   * running the invocation as a test invoke.
   *
   * @returns The bytestring representation of the collection. **OR** a txid if the signer parameter is populated.
   */
  async getCollection(collectionId: number, signer?: wallet.Account): Promise<string> {
    return CollectionAPI.getCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer)
  }

  /**
   * Returns the value of a collection from a requested index.
   *
   * @param collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param index The index of the array element being requested.
   * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
   * running the invocation as a test invoke.
   *
   * @returns The value of the collection element **OR** a txid if the signer parameter is populated.
   */
  async getCollectionElement(collectionId: number, index: number, signer?: wallet.Account): Promise<string> {
    return CollectionAPI.getCollectionElement(this.node.url, this.networkMagic, this.scriptHash, collectionId, index, signer)
  }

  /**
   * Gets the array length of a requested collection.
   *
   * @param collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
   * running the invocation as a test invoke.
   *
   * @returns The length of the collection **OR** a txid if the signer parameter is populated.
   */
  async getCollectionLength(collectionId: number, signer?: wallet.Account): Promise<number> {
    return CollectionAPI.getCollectionLength(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer)
  }

  /**
   * Gets the values of a collection, omitting the metadata.
   *
   * @param collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
   * running the invocation as a test invoke.
   *
   * @returns The values in the collection **OR** a txid if the signer parameter is populated.
   */
  async getCollectionValues(collectionId: number, signer?: wallet.Account): Promise<string[] | any> {
    return CollectionAPI.getCollectionValues(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer)
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
   * @param collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param entropy Bytes to use for the mapping.
   * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
   * running the invocation as a test invoke.
   *
   * @returns The element from the mapping **OR** a txid if the signer parameter is populated.
   */
  async mapBytesOntoCollection(collectionId: number, entropy: string, signer?: wallet.Account): Promise<string> {
    return CollectionAPI.mapBytesOntoCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, entropy, signer)
  }

  /**
   * Samples a uniform random value from the collection using a Contract.Call to the {@link Dice} contract.
   *
   * @param collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
   * @param samples The number of samples to return
   * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
   * running the invocation as a test invoke.
   *
   * @returns A uniform random sample from the collection. **OR** a txid if the signer parameter is populated.
   * **Note:** This method will not randomly generate unless the transaction is published so use the signer field for
   * testing.
   */
  async sampleFromCollection(collectionId: number, samples: number, signer?: wallet.Account): Promise<string> {
    return CollectionAPI.sampleFromCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, samples, signer)
  }

  /**
   * Samples uniformly from a collection provided at the time of invocation.  Users have the option to 'pick', which
   * prevents a value from being selected multiple times.  The results are published as outputs on the transaction.
   * @param values an array of values to sample from
   * @param samples the number of samples to fairly select from the values
   * @param pick Are selected values removed from the list of options for future samples?
   * @param signer The signer of the transaction.
   */
  async sampleFromRuntimeCollection(values: string[], samples: number, pick: boolean, signer: wallet.Account): Promise<string> {
    return CollectionAPI.sampleFromRuntimeCollection(this.node.url, this.networkMagic, this.scriptHash, values, samples, pick, signer)
  }

  /**
   * Gets the total collections.  Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
   * planning to iterate of their collection IDs.
   *
   * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
   * running the invocation as a test invoke.
   *
   * @returns The total number of collections stored in the contract. **OR** a txid if the signer parameter is populated.
   */
  async totalCollections(signer?: wallet.Account): Promise<number | undefined> {
    return CollectionAPI.totalCollections(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async update(script: string, manifest: string, signer: wallet.Account): Promise<string | undefined> {
    return CollectionAPI.update(this.node.url, this.networkMagic, this.scriptHash, script, manifest, '', signer)
  }

}
