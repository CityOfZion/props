import { rpc, wallet } from '@cityofzion/neon-core';
export interface DiceOptions {
    node?: string;
    scriptHash?: string;
}
export declare class Dice {
    private options;
    private networkMagic;
    constructor(options?: DiceOptions);
    init(): Promise<void>;
    get node(): rpc.RPCClient;
    get scriptHash(): string;
    randBetween(start: number, end: number, signer?: wallet.Account): Promise<number | string>;
    mapBytesOntoRange(start: number, end: number, entropy: string, signer?: wallet.Account): Promise<number | string>;
    rollDie(die: string, signer?: wallet.Account): Promise<number | string>;
    rollDiceWithEntropy(die: string, precision: number, entropy: string, signer?: wallet.Account): Promise<any>;
}
