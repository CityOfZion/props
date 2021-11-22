import { rpc, wallet } from '@cityofzion/neon-core';
import { Character } from "./interface";
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
    getCharacter(uid: number): Promise<Character | undefined>;
    mintCharacter(owner: string, account: wallet.Account): Promise<boolean>;
    rollDie(type: string): Promise<number>;
    rollInitialStat(): Promise<boolean>;
    ownerOf(tokenId: string): Promise<string>;
    properties(tokenId: string): Promise<any>;
    symbol(): Promise<string>;
    tokens(): Promise<string[]>;
    tokensOf(address: string): Promise<string[]>;
    totalSupply(): Promise<number>;
}
