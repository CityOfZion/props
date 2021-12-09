import { wallet } from "@cityofzion/neon-core";
export declare class DiceAPI {
    static rollDie(node: string, networkMagic: number, contractHash: string, die: string, signer?: wallet.Account): Promise<number | string>;
    static rollDiceWithEntropy(node: string, networkMagic: number, contractHash: string, die: string, precision: number, entropy: string, signer?: wallet.Account): Promise<number[] | string>;
    static randBetween(node: string, networkMagic: number, contractHash: string, start: number, end: number, signer?: wallet.Account): Promise<number | string>;
    static mapBytesOntoRange(node: string, networkMagic: number, contractHash: string, start: number, end: number, entropy: string, signer?: wallet.Account): Promise<number | string>;
}
