export declare class DiceAPI {
    static rollDie(node: string, networkMagic: number, contractHash: string, die: string): Promise<number>;
    static rollDiceWithEntropy(node: string, networkMagic: number, contractHash: string, die: string, precision: number, entropy: string): Promise<number>;
    static rollInitialStat(node: string, networkMagic: number, contractHash: string): Promise<any>;
    static rollInitialStatWithEntropy(node: string, networkMagic: number, contractHash: string, entropy: string): Promise<any>;
}
