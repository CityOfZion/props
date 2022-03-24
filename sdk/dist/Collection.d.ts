import { rpc, wallet } from '@cityofzion/neon-core';
import { CollectionType, PropConstructorOptions } from "./interface";
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
export declare class Collection {
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
    createCollection(description: string, collectionType: string, extra: string, values: string[], signer: wallet.Account): Promise<string>;
    /**
     * Loads a {@link CollectionType} formatted JSON file and pushes it to the smart contract.
     *
     * @param path The path to the file.
     * @param signer The signer of the transaction.
     *
     * @returns A transaction ID. Refer to {@link helper.txDidComplete} for parsing.
     */
    createFromFile(path: string, signer: wallet.Account): Promise<string>;
    /**
     * Gets a JSON formatting collection from the smart contract.
     *
     * @param collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
     * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
     * running the invocation as a test invoke.
     *
     * @returns The requested collection **OR** a txid if the signer parameter is populated.
     */
    getCollectionJSON(collectionId: number, signer?: wallet.Account): Promise<CollectionType | string>;
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
    getCollection(collectionId: number, signer?: wallet.Account): Promise<string>;
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
    getCollectionElement(collectionId: number, index: number, signer?: wallet.Account): Promise<string>;
    /**
     * Gets the array length of a requested collection.
     *
     * @param collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
     * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
     * running the invocation as a test invoke.
     *
     * @returns The length of the collection **OR** a txid if the signer parameter is populated.
     */
    getCollectionLength(collectionId: number, signer?: wallet.Account): Promise<number>;
    /**
     * Gets the values of a collection, omitting the metadata.
     *
     * @param collectionId The collectionID being requested.  Refer to {@link https://props.coz.io} for a formatted list.
     * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
     * running the invocation as a test invoke.
     *
     * @returns The values in the collection **OR** a txid if the signer parameter is populated.
     */
    getCollectionValues(collectionId: number, signer?: wallet.Account): Promise<string[] | any>;
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
    mapBytesOntoCollection(collectionId: number, entropy: string, signer?: wallet.Account): Promise<string>;
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
    sampleFromCollection(collectionId: number, samples: number, signer?: wallet.Account): Promise<string>;
    /**
     * Gets the total collections.  Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
     * planning to iterate of their collection IDs.
     *
     * @param signer An optional signer. Populating this field will publish the transaction and return a txid instead of
     * running the invocation as a test invoke.
     *
     * @returns The total number of collections stored in the contract. **OR** a txid if the signer parameter is populated.
     */
    totalCollections(signer?: wallet.Account): Promise<number | undefined>;
    update(script: string, manifest: string, signer: wallet.Account): Promise<string | undefined>;
}
