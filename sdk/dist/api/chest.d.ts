import { wallet } from "@cityofzion/neon-core";
export declare class ChestAPI {
    static createChest(node: string, networkMagic: number, contractHash: string, name: string, type: number, eligibleEpochs: [number], puppetTraits: any, signer: wallet.Account): Promise<any>;
    static isPuppetEligible(node: string, networkMagic: number, contractHash: string, chestId: string, puppetId: string, signer?: wallet.Account): Promise<any>;
    static lootChestWithPuppet(node: string, networkMagic: number, contractHash: string, chestId: string, puppetId: string, signer: wallet.Account): Promise<any>;
    static lootChestAsOwner(node: string, networkMagic: number, contractHash: string, chestId: string, signer: wallet.Account): Promise<any>;
    static getChestJSON(node: string, networkMagic: number, contractHash: string, chestId: string, signer?: wallet.Account): Promise<any>;
    static totalChests(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<any>;
}
