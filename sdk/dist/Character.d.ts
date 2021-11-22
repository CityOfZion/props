import { rpc, wallet } from '@cityofzion/neon-core';
export interface CharacterOptions {
    node?: string;
    scriptHash?: string;
}
export declare class Character {
    private options;
    private networkMagic;
    constructor(options?: CharacterOptions);
    init(): Promise<void>;
    get node(): rpc.RPCClient;
    get scriptHash(): string;
    balanceOf(address: string): Promise<number>;
    decimals(): Promise<number>;
    deploy(data: object, upgrade: boolean, signer: wallet.Account): Promise<any>;
    getAttributeMod(attributeValue: number): Promise<any>;
    getAuthorizedAddresses(): Promise<string[]>;
    getCharacterRaw(tokenId: string): Promise<string | undefined>;
    ownerOf(tokenId: number): Promise<wallet.Account | undefined>;
    mint(signer: wallet.Account): Promise<string | undefined>;
    properties(tokenId: number): Promise<any>;
    purchase(signer: wallet.Account): Promise<string | undefined>;
    rollDie(die: string): Promise<number>;
    rollDiceWithEntropy(die: string, precision: number, entropy: string): Promise<any>;
    rollInitialStat(): Promise<boolean>;
    rollInitialStateWithEntropy(entropy: string): Promise<any>;
    setAuthorizedAddress(address: string, authorized: boolean, signer: wallet.Account): Promise<boolean>;
    symbol(): Promise<string>;
    tokens(): Promise<number[]>;
    tokensOf(address: string): Promise<number[]>;
    transfer(to: string, tokenId: number, signer: wallet.Account, data: any): Promise<boolean | undefined>;
    totalSupply(): Promise<number>;
    update(script: string, manifest: string, signer: wallet.Account): Promise<boolean>;
}
