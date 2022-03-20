"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const neon_js_1 = require("@cityofzion/neon-js");
const interface_1 = require("./interface");
const api_1 = require("./api");
const fs_1 = __importDefault(require("fs"));
const DEFAULT_OPTIONS = {
    network: interface_1.NetworkOption.LocalNet
};
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
 * import {Collection} from "../../dist"
 *
 * const collection: Collection = new Collection()
 * await collection.init() // interfaces with the node to resolve network magic
 *
 * const total = await collection.totalCollections()
 * console.log(total) // outputs the total collection count in the contract
 * ```
 */
class Collection {
    constructor(options = {}) {
        this.options = DEFAULT_OPTIONS;
        this.networkMagic = -1;
        switch (options.network) {
            case interface_1.NetworkOption.TestNet:
                this.options.node = 'https://testnet1.neo.coz.io:443';
                this.options.scriptHash = '0x429ba9252c761b6119ab9442d9fbe2e60f3c6f3e';
                break;
            case interface_1.NetworkOption.MainNet:
                this.options.node = 'https://mainnet1.neo.coz.io:443';
                this.options.scriptHash = ''; //not implemented
                break;
            default:
                this.options.node = 'http://localhost:50012';
                this.options.scriptHash = '0x23e27f3aeb76a65e573f5ee8842c35d42e643b70';
                break;
        }
        this.options = lodash_1.merge({}, this.options, options);
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
        throw new Error('scripthash defined');
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
    async createCollection(description, collectionType, extra, values, signer) {
        return api_1.CollectionAPI.createCollection(this.node.url, this.networkMagic, this.scriptHash, description, collectionType, extra, values, signer);
    }
    /**
     * Loads a {@link CollectionType} formatted JSON file and pushes it to the smart contract.
     *
     * @param path The path to the file.
     * @param signer The signer of the transaction.
     *
     * @returns A transaction ID. Refer to {@link helper.txDidComplete} for parsing.
     */
    async createFromFile(path, signer) {
        const localCollection = JSON.parse(fs_1.default.readFileSync(path).toString());
        const formattedValues = localCollection.values.map((value) => {
            switch (localCollection.type) {
                case 'string':
                    return neon_js_1.sc.ContractParam.string(value);
                case 'int':
                    return neon_js_1.sc.ContractParam.integer(value);
            }
        });
        return api_1.CollectionAPI.createCollectionRaw(this.node.url, this.networkMagic, this.scriptHash, localCollection.description, localCollection.type, localCollection.extra, formattedValues, signer);
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
    async getCollectionJSON(collectionId, signer) {
        return api_1.CollectionAPI.getCollectionJSON(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer);
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
    async getCollection(collectionId, signer) {
        return api_1.CollectionAPI.getCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer);
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
    async getCollectionElement(collectionId, index, signer) {
        return api_1.CollectionAPI.getCollectionElement(this.node.url, this.networkMagic, this.scriptHash, collectionId, index, signer);
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
    async getCollectionLength(collectionId, signer) {
        return api_1.CollectionAPI.getCollectionLength(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer);
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
    async getCollectionValues(collectionId, signer) {
        return api_1.CollectionAPI.getCollectionValues(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer);
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
    async mapBytesOntoCollection(collectionId, entropy, signer) {
        return api_1.CollectionAPI.mapBytesOntoCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, entropy, signer);
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
    async sampleFromCollection(collectionId, samples, signer) {
        return api_1.CollectionAPI.sampleFromCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, samples, signer);
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
    async totalCollections(signer) {
        return api_1.CollectionAPI.totalCollections(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
    async update(script, manifest, signer) {
        return api_1.CollectionAPI.update(this.node.url, this.networkMagic, this.scriptHash, script, manifest, '', signer);
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map