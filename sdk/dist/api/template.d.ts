import { wallet } from "@cityofzion/neon-core";
export declare class TemplateAPI {
    static templateMethod(node: string, networkMagic: number, contractHash: string, paramA: string, paramB: number, paramC: string, paramD: boolean, paramE: string[], signer?: wallet.Account): Promise<any>;
}
