import { rpc, wallet } from '@cityofzion/neon-core';
import { CollectionType, PropConstructorOptions } from "./interface";
export declare class Collection {
    private options;
    private networkMagic;
    constructor(options?: PropConstructorOptions);
    init(): Promise<void>;
    get node(): rpc.RPCClient;
    get scriptHash(): string;
    createCollection(description: string, collectionType: string, extra: string, values: string[], signer: wallet.Account): Promise<string>;
    createFromFile(path: string, signer: wallet.Account): Promise<string>;
    getCollectionJSON(collectionId: number, signer?: wallet.Account): Promise<CollectionType>;
    getCollection(collectionId: number, signer?: wallet.Account): Promise<string>;
    getCollectionElement(collectionId: number, index: number, signer?: wallet.Account): Promise<string>;
    getCollectionLength(collectionId: number, signer?: wallet.Account): Promise<number>;
    getCollectionValues(collectionId: number, signer?: wallet.Account): Promise<string[] | any>;
    mapBytesOntoCollection(collectionId: number, entropy: string, signer?: wallet.Account): Promise<string>;
    sampleFromCollection(collectionId: number, signer?: wallet.Account): Promise<string>;
    totalCollections(signer?: wallet.Account): Promise<number | undefined>;
}
