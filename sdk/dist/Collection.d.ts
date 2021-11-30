import { rpc, wallet } from '@cityofzion/neon-core';
import { CollectionType } from "./interface";
export interface CollectionOptions {
    node?: string;
    scriptHash?: string;
}
export declare class Collection {
    private options;
    private networkMagic;
    constructor(options?: CollectionOptions);
    init(): Promise<void>;
    get node(): rpc.RPCClient;
    get scriptHash(): string;
    totalCollections(): Promise<number | undefined>;
    createCollection(description: string, collectionType: string, extra: string, values: string[], signer: wallet.Account): Promise<string | undefined>;
    getCollection(collectionId: number): Promise<string | undefined>;
    getCollectionElement(collectionId: number, index: number): Promise<string | undefined>;
    getCollectionJSON(collectionId: number): Promise<CollectionType | undefined>;
}
