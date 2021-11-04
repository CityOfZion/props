import { wallet } from "@cityofzion/neon-core";
export declare class Nep11 {
    static symbol(node: string, networkMagic: number, contractHash: string): Promise<string>;
    static decimals(node: string, networkMagic: number, contractHash: string): Promise<number>;
    static totalSupply(node: string, networkMagic: number, contractHash: string): Promise<number>;
    static balanceOf(node: string, networkMagic: number, contractHash: string, address: string): Promise<number>;
    static tokensOf(): Promise<void>;
    static transfer(node: string, networkMagic: number, contractHash: string, fromAddress: string, toAddress: string, amount: number, account: wallet.Account, data?: any): Promise<any>;
    static ownerOf(): Promise<void>;
    static tokens(): Promise<void>;
    static properties(): Promise<void>;
    static propertiesJson(): Promise<void>;
    static _deploy(): Promise<void>;
    static onNEP11Payment(): Promise<void>;
    static onNEP17Payment(): Promise<void>;
    static burn(): Promise<void>;
    static mint(): Promise<void>;
    static getRoyalties(): Promise<void>;
    static getAuthorizedAddress(): Promise<void>;
    static setAuthorizedAddress(): Promise<void>;
    static updatePause(): Promise<void>;
    static isPaused(): Promise<void>;
    static verify(): Promise<void>;
    static update(): Promise<void>;
    static destroy(): Promise<void>;
}
