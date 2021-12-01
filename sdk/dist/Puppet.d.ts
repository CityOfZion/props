import { rpc, wallet } from '@cityofzion/neon-core';
import { TraitLevel } from "./interface";
export interface PuppetOptions {
    node?: string;
    scriptHash?: string;
}
export declare class Puppet {
    private options;
    private networkMagic;
    constructor(options?: PuppetOptions);
    init(): Promise<void>;
    get node(): rpc.RPCClient;
    get scriptHash(): string;
    balanceOf(address: string): Promise<number>;
    decimals(): Promise<number>;
    deploy(data: object, upgrade: boolean, signer: wallet.Account): Promise<any>;
    getAttributeMod(attributeValue: number): Promise<any>;
    getPuppetRaw(tokenId: string): Promise<string | undefined>;
    ownerOf(tokenId: number): Promise<wallet.Account | undefined>;
    offlineMint(signer: wallet.Account): Promise<string | undefined>;
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
    totalEpochs(): Promise<number | undefined>;
    setCurrentEpoch(epoch_id: number, signer: wallet.Account): Promise<boolean | undefined>;
    getCurrentEpoch(): Promise<number | undefined>;
    createEpoch(label: string, maxTraits: number, traitLevels: TraitLevel[], signer: wallet.Account): Promise<string | undefined>;
    getEpochJSON(epochId: number): Promise<string | undefined>;
    pickTraits(signer: wallet.Account): Promise<string | undefined>;
}
