import { wallet } from "@cityofzion/neon-core";
export declare class Nep11 {
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
    static tokensOf(node: string, networkMagic: number, contractHash: string, address: string): Promise<string[]>;
    /**
     * Gets the owner account of a tokenId
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId to return the owner of
     */
    static ownerOf(node: string, networkMagic: number, contractHash: string, tokenId: string): Promise<string>;
    /**
     * Gets and array of strings(tokenIds) representing all the tokens associated with the contract
     * @param node
     * @param networkMagic
     * @param contractHash
     */
    static tokens(node: string, networkMagic: number, contractHash: string): Promise<string[]>;
    /**
     * Gets the properties of a token
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId of the token being requested
     */
    static properties(node: string, networkMagic: number, contractHash: string, tokenId: string): Promise<any>;
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
    /**
     * Creates a new NEP11 token on the contract
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param address The address to mint to.
     * @param meta The meta data for the token (properties)
     * @param royalties Are there royalties?
     * @param data: mint-required data payload
     * @param account The signing account
     */
    static mint(node: string, networkMagic: number, contractHash: string, address: string, meta: string, royalties: string, data: any, account: wallet.Account): Promise<string | undefined>;
}
