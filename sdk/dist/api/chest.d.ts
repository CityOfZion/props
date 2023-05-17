import { wallet } from "@cityofzion/neon-core";
import { EligibilityCase } from "../interface";
export declare class ChestAPI {
    static createChest(node: string, networkMagic: number, contractHash: string, name: string, chestType: number, eligibilityCases: EligibilityCase[], signer: wallet.Account): Promise<number>;
    static isEligible(node: string, networkMagic: number, contractHash: string, chestId: number, nftSriptHash: string, tokenId: string, signer?: wallet.Account): Promise<boolean>;
    static lootChest(node: string, networkMagic: number, contractHash: string, chestId: number, nftScriptHash: string, tokenId: string, signer: wallet.Account): Promise<any>;
    static lootChestAsOwner(node: string, networkMagic: number, contractHash: string, chestId: number, signer: wallet.Account): Promise<any>;
    static getChestJSON(node: string, networkMagic: number, contractHash: string, chestId: number, signer?: wallet.Account): Promise<any>;
    static totalChests(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number>;
}
