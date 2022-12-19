import { wallet } from "@cityofzion/neon-core";
import { EpochType, GiftType } from "../interface";
export declare class GiftAPI {
    /**
     * Returns the balance of an account
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param address
     * @param signer
     */
    static balanceOf(node: string, networkMagic: number, contractHash: string, address: string, signer?: wallet.Account): Promise<number>;
    static createEpoch(node: string, networkMagic: number, contractHash: string, label: string, generatorInstanceId: number, initialRollCollectionId: number, mintFee: number, sysFee: number, maxSupply: number, signer: wallet.Account): Promise<string>;
    /**
     * Returns the decimals of the token
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer
     */
    static decimals(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number>;
    /**
     * Initializes the smart contract on first deployment (REQUIRED)
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer The signing account, which will become the first admin if upgrade == false
     */
    static deploy(node: string, networkMagic: number, contractHash: string, signer: wallet.Account): Promise<string>;
    static getTokenJSON(node: string, networkMagic: number, contractHash: string, tokenId: string, signer?: wallet.Account): Promise<GiftType | string>;
    static getTokenJSONFlat(node: string, networkMagic: number, contractHash: string, tokenId: string, signer?: wallet.Account): Promise<GiftType | string>;
    static getTokenRaw(node: string, networkMagic: number, contractHash: string, tokenId: string, signer?: wallet.Account): Promise<string>;
    /**
     * Gets the owner account of a tokenId
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId to return the owner of
     * @param signer
     */
    static ownerOf(node: string, networkMagic: number, contractHash: string, tokenId: string, signer?: wallet.Account): Promise<wallet.Account | string>;
    static offlineMint(node: string, networkMagic: number, contractHash: string, epochId: number, owner: string, signer: wallet.Account): Promise<string>;
    /**
     * Gets the properties of a token
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId of the token being requested
     * @param signer An optional signer.  Populating this value will publish a transaction and return a txid
     */
    static properties(node: string, networkMagic: number, contractHash: string, tokenId: string, signer?: wallet.Account): Promise<GiftType | string>;
    static setMintFee(node: string, networkMagic: number, contractHash: string, epochId: number, fee: number, signer: wallet.Account): Promise<string>;
    /**
     * Returns the token symbol
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer
     */
    static symbol(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<string>;
    /**
     * Gets and array of strings(tokenIds) representing all the tokens associated with the contract
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer
     */
    static tokens(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number[] | string>;
    /**
     * Gets an array of strings(tokenId) owned by an address
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param address The string formatted address of an account
     * @param signer
     */
    static tokensOf(node: string, networkMagic: number, contractHash: string, address: string, signer?: wallet.Account): Promise<string[] | string>;
    /**
     * Gets the total number of accounts stored in the contract
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer
     */
    static totalAccounts(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number | string>;
    static totalEpochs(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number | string>;
    /**
     * Returns the total supply of the token
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer
     */
    static totalSupply(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number | string>;
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
    static transfer(node: string, networkMagic: number, contractHash: string, toAddress: string, tokenId: string, signer: wallet.Account, data?: any): Promise<string>;
    static update(node: string, networkMagic: number, contractHash: string, script: string, manifest: string, data: any, signer: wallet.Account): Promise<string>;
    static getEpochJSON(node: string, networkMagic: number, contractHash: string, epochId: number, signer?: wallet.Account): Promise<EpochType | string>;
}
