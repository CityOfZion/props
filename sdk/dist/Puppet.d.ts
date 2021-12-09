import { rpc, wallet } from '@cityofzion/neon-core';
import { PropConstructorOptions } from "./interface";
export declare class Puppet {
    private options;
    private networkMagic;
    constructor(options?: PropConstructorOptions);
    init(): Promise<void>;
    get node(): rpc.RPCClient;
    get scriptHash(): string;
    balanceOf(address: string): Promise<number>;
    decimals(): Promise<number>;
    deploy(signer: wallet.Account): Promise<any>;
    getAttributeMod(attributeValue: number): Promise<any>;
    getPuppetRaw(tokenId: string): Promise<string | undefined>;
    ownerOf(tokenId: number): Promise<wallet.Account | undefined>;
    offlineMint(target: string, signer: wallet.Account): Promise<string | undefined>;
    properties(tokenId: number): Promise<any>;
    purchase(signer: wallet.Account): Promise<string | undefined>;
    setMintFee(fee: number, signer: wallet.Account): Promise<number>;
    symbol(): Promise<string>;
    getMintFee(): Promise<number>;
    tokens(): Promise<number[]>;
    tokensOf(address: string): Promise<number[]>;
    transfer(to: string, tokenId: number, signer: wallet.Account, data: any): Promise<boolean | undefined>;
    totalSupply(): Promise<number>;
    update(script: string, manifest: string, signer: wallet.Account): Promise<boolean>;
    setCurrentEpoch(epoch_id: number, signer: wallet.Account): Promise<boolean | undefined>;
    getCurrentEpoch(): Promise<number | undefined>;
}
