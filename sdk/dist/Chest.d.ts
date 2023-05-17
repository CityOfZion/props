import { rpc, wallet } from '@cityofzion/neon-core';
import { EligibilityCase, PropConstructorOptions } from "./interface";
/**
  TEMPLATE CONTRACT CLASS
  Use this class template to build out the typescript interface for your smart contract.  If you rename this or the
  `api` equivalent, make sure to update the respective `index.ts` and rebuild.
 */
export declare class Chest {
    private options;
    private networkMagic;
    constructor(options?: PropConstructorOptions);
    /**
     * DO NOT EDIT ME
     * Gets the magic number for the network and configures the class instance.
     */
    init(): Promise<void>;
    /**
     * DO NOT EDIT ME
     * The the node that the instance is connected to.
     */
    get node(): rpc.RPCClient;
    /**
     * DO NOT EDIT ME
     * The contract script hash that is being interfaced with.
     */
    get scriptHash(): string;
    /**
     *
     * EDIT ME!!!
     *
     * This template method is designed to be a passthough so you should really only be changing the name and parameter types.
     * All the magic happens in the TemplateAPI.templateMethod.  Check there to align your sdk with your smart contract.
     * Create one of these pass throughs for each method you expose in your smart contract. The goal of this entire class is to
     * simplify the network configuration steps which can be complicated.
     */
    createChest(name: string, type: number, eligibilityCases: EligibilityCase[], signer: wallet.Account): Promise<number | string>;
    isEligible(chestId: number, nftScriptHash: string, tokenId: string, signer?: wallet.Account): Promise<boolean>;
    lootChest(chestId: number, nftScriptHash: string, tokenId: string, signer: wallet.Account): Promise<number | string>;
    lootChestVerified(chestId: number, nftScriptHash: string, tokenId: string, signer: wallet.Account): Promise<any>;
    lootChestAsOwner(chestId: number, signer: wallet.Account): Promise<number | string>;
    getChestJSON(chestId: number, signer?: wallet.Account): Promise<number | string>;
    totalChests(signer?: wallet.Account): Promise<number | string>;
    loadChestFungible(tokenScriptHash: string, chestId: number, transferAmount: number, amountPerReservoirItem: number, signer: wallet.Account): Promise<any>;
}
