import { wallet } from "@cityofzion/neon-core";
import { TraitLevel } from "../interface";
export declare class EpochAPI {
    static totalEpochs(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number>;
    static createEpoch(node: string, networkMagic: number, contractHash: string, label: string, maxTraits: number, traits: TraitLevel[], signer: wallet.Account): Promise<any>;
    static getEpochJSON(node: string, networkMagic: number, contractHash: string, epochId: number, signer?: wallet.Account): Promise<any>;
    static mintFromEpoch(node: string, networkMagic: number, contractHash: string, epochId: number, signer: wallet.Account): Promise<any>;
}
