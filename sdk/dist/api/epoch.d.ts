import { wallet } from "@cityofzion/neon-core";
import { EpochType, TraitLevel } from "../interface";
export declare class EpochAPI {
    static createEpoch(node: string, networkMagic: number, contractHash: string, label: string, signer: wallet.Account): Promise<string>;
    static createInstance(node: string, networkMagic: number, contractHash: string, epochId: number, signer: wallet.Account): Promise<string>;
    static createTrait(node: string, networkMagic: number, contractHash: string, epochId: number, label: string, slots: number, levels: TraitLevel[], signer: wallet.Account): Promise<string>;
    static getEpochJSON(node: string, networkMagic: number, contractHash: string, epochId: number, signer?: wallet.Account): Promise<EpochType | string>;
    static getEpochInstanceJSON(node: string, networkMagic: number, contractHash: string, instanceId: number, signer?: wallet.Account): Promise<any>;
    static mintFromEpoch(node: string, networkMagic: number, contractHash: string, epochId: number, signer: wallet.Account): Promise<string>;
    static mintFromInstance(node: string, networkMagic: number, contractHash: string, instanceId: number, signer: wallet.Account): Promise<string>;
    static setInstanceAuthorizedUsers(node: string, networkMagic: number, contractHash: string, instanceId: number, authorizedUsers: string[], signer: wallet.Account): Promise<string>;
    static totalEpochs(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number | string>;
    static totalEpochInstances(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number | string>;
}
