import { wallet } from "@cityofzion/neon-core";
import { PuppetType, Trait } from "../interface";
export declare class PuppetAPI {
    /**
     * Returns the token symbol
     * @param node
     * @param networkMagic
     * @param contractHash
     */
    static symbol(node: string, networkMagic: number, contractHash: string): Promise<string>;
    /**
     * Returns the decimals of the token
     * @param node
     * @param networkMagic
     * @param contractHash
     */
    static decimals(node: string, networkMagic: number, contractHash: string): Promise<number>;
    /**
     * Returns the total supply of the token
     * @param node
     * @param networkMagic
     * @param contractHash
     */
    static totalSupply(node: string, networkMagic: number, contractHash: string): Promise<number>;
    /**
     * Returns the balance of an account
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param address
     */
    static balanceOf(node: string, networkMagic: number, contractHash: string, address: string): Promise<number>;
    /**
     * Gets an array of strings(tokenId) owned by an address
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param address The string formatted address of an account
     */
    static tokensOf(node: string, networkMagic: number, contractHash: string, address: string): Promise<number[]>;
    /**
     * Transfers a token to another account
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param toAddress
     * @param tokenId
     * @param signer
     * @param data
     */
    static transfer(node: string, networkMagic: number, contractHash: string, toAddress: string, tokenId: number, signer: wallet.Account, data?: any): Promise<any>;
    /**
     * Gets the owner account of a tokenId
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId to return the owner of
     */
    static ownerOf(node: string, networkMagic: number, contractHash: string, tokenId: number): Promise<wallet.Account | undefined>;
    /**
     * Gets and array of strings(tokenIds) representing all the tokens associated with the contract
     * @param node
     * @param networkMagic
     * @param contractHash
     */
    static tokens(node: string, networkMagic: number, contractHash: string): Promise<number[]>;
    /**
     * Gets the properties of a token
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId of the token being requested
     */
    static properties(node: string, networkMagic: number, contractHash: string, tokenId: number): Promise<PuppetType | undefined>;
    /**
     * Initializes the smart contract on first deployment (REQUIRED)
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param data A pass through variable that is currently not used
     * @param upgrade Indicates whether the deployment is an upgrade
     * @param account The signing account, which will become the first admin if upgrade == false
     */
    static deploy(node: string, networkMagic: number, contractHash: string, data: object, //we arent using this...
    upgrade: boolean, account: wallet.Account): Promise<any>;
    static offlineMint(node: string, networkMagic: number, contractHash: string, owner: string, signer: wallet.Account): Promise<any>;
    static update(node: string, networkMagic: number, contractHash: string, script: string, manifest: string, signer: wallet.Account): Promise<any>;
    static getPuppetRaw(node: string, networkMagic: number, contractHash: string, tokenId: string): Promise<any>;
    static getMintFee(node: string, networkMagic: number, contractHash: string): Promise<number>;
    static setMintFee(node: string, networkMagic: number, contractHash: string, fee: number, signer: wallet.Account): Promise<any>;
    static getAttributeMod(node: string, networkMagic: number, contractHash: string, attributeValue: number): Promise<any>;
    static totalEpochs(node: string, networkMagic: number, contractHash: string): Promise<number>;
    static totalTraitLevels(node: string, networkMagic: number, contractHash: string): Promise<number>;
    static setCurrentEpoch(node: string, networkMagic: number, contractHash: string, epochId: number, account: wallet.Account): Promise<any>;
    static getCurrentEpoch(node: string, networkMagic: number, contractHash: string): Promise<number>;
    static createEpoch(node: string, networkMagic: number, contractHash: string, label: string, totalSupply: number, maxTraits: number, traits: Trait[], account: wallet.Account): Promise<any>;
}
