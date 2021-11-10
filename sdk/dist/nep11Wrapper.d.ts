import { rpc, wallet } from '@cityofzion/neon-core';
export interface Nep11WrapperOptions {
    node?: string;
    scriptHash?: string;
}
export declare class Nep11Wrapper {
    private options;
    private networkMagic;
    constructor(options?: Nep11WrapperOptions);
    init(): Promise<void>;
    get node(): rpc.RPCClient;
    get scriptHash(): string;
    deploy(data: object, upgrade: boolean, account: wallet.Account): Promise<any>;
    balanceOf(address: string): Promise<number>;
    decimals(): Promise<number>;
    mint(meta: string, royalties: string, data: string, account: wallet.Account): Promise<string | undefined>;
    ownerOf(tokenId: string): Promise<string>;
    properties(tokenId: string): Promise<any>;
    symbol(): Promise<string>;
    tokens(): Promise<string[]>;
    tokensOf(address: string): Promise<string[]>;
    totalSupply(): Promise<number>;
}
