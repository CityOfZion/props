import { wallet } from "@cityofzion/neon-core";
import { CollectionType } from "../interface";
import { ContractParamLike } from "@cityofzion/neon-core/lib/sc";
export declare class CollectionAPI {
    static createCollection(node: string, networkMagic: number, contractHash: string, description: string, collection_type: string, extra: any, values: string[], signer: wallet.Account): Promise<string>;
    static createCollectionRaw(node: string, networkMagic: number, contractHash: string, description: string, collection_type: string, extra: any, values: ContractParamLike[], signer: wallet.Account): Promise<string>;
    static getCollectionJSON(node: string, networkMagic: number, contractHash: string, collectionId: number, signer?: wallet.Account): Promise<CollectionType | string>;
    static getCollection(node: string, networkMagic: number, contractHash: string, collectionId: number, signer?: wallet.Account): Promise<string>;
    static getCollectionElement(node: string, networkMagic: number, contractHash: string, collectionId: number, index: number, signer?: wallet.Account): Promise<string>;
    static getCollectionLength(node: string, networkMagic: number, contractHash: string, collectionId: number, signer?: wallet.Account): Promise<number>;
    static getCollectionValues(node: string, networkMagic: number, contractHash: string, collectionId: number, signer?: wallet.Account): Promise<string[] | any>;
    static mapBytesOntoCollection(node: string, networkMagic: number, contractHash: string, collectionId: number, entropy: string, signer?: wallet.Account): Promise<string>;
    static sampleFromCollection(node: string, networkMagic: number, contractHash: string, collectionId: number, signer?: wallet.Account): Promise<string>;
    static totalCollections(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number>;
}
