import { rpc } from '@cityofzion/neon-core';
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
    rollDie(die: string): Promise<number>;
    rollDiceWithEntropy(die: string, precision: number, entropy: string): Promise<any>;
    rollInitialStat(): Promise<boolean>;
    rollInitialStateWithEntropy(entropy: string): Promise<any>;
}
