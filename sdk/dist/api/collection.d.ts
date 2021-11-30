import { wallet } from "@cityofzion/neon-core";
import { CollectionType } from "../interface";
export declare class CollectionAPI {
    static totalCollections(node: string, networkMagic: number, contractHash: string): Promise<number>;
    static createCollection(node: string, networkMagic: number, contractHash: string, description: string, collection_type: string, extra: any, values: string[], signer: wallet.Account): Promise<any>;
    static getCollectionElement(node: string, networkMagic: number, contractHash: string, collectionId: number, index: number): Promise<string | undefined>;
    static getCollection(node: string, networkMagic: number, contractHash: string, collectionId: number): Promise<string | undefined>;
    static getCollectionJSON(node: string, networkMagic: number, contractHash: string, collectionId: number): Promise<CollectionType | undefined>;
}
