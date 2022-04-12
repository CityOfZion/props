import { wallet } from "@cityofzion/neon-core";
import { GeneratorType, InstanceAccessMode, InstanceAuthorizedContracts, TraitLevel, TraitType } from "../interface";
export declare class GeneratorAPI {
    static createGenerator(node: string, networkMagic: number, contractHash: string, label: string, baseGeneratorFee: number, signer: wallet.Account): Promise<string>;
    static createInstance(node: string, networkMagic: number, contractHash: string, generatorId: number, signer: wallet.Account): Promise<string>;
    static createTrait(node: string, networkMagic: number, contractHash: string, generatorId: number, label: string, slots: number, levels: TraitLevel[], signer: wallet.Account): Promise<string>;
    static getGeneratorJSON(node: string, networkMagic: number, contractHash: string, generatorId: number, signer?: wallet.Account): Promise<GeneratorType | string>;
    static getTraitJSON(node: string, networkMagic: number, contractHash: string, traitId: string, signer?: wallet.Account): Promise<TraitType | string>;
    static getGeneratorInstanceJSON(node: string, networkMagic: number, contractHash: string, instanceId: number, signer?: wallet.Account): Promise<any>;
    static mintFromInstance(node: string, networkMagic: number, contractHash: string, instanceId: number, signer: wallet.Account): Promise<string>;
    static setInstanceAccessMode(node: string, networkMagic: number, contractHash: string, instanceId: number, accessMode: InstanceAccessMode, signer: wallet.Account): Promise<string>;
    static setInstanceAuthorizedUsers(node: string, networkMagic: number, contractHash: string, instanceId: number, authorizedUsers: string[], signer: wallet.Account): Promise<string>;
    static setInstanceAuthorizedContracts(node: string, networkMagic: number, contractHash: string, instanceId: number, authorizedContracts: InstanceAuthorizedContracts[], signer: wallet.Account): Promise<string>;
    static setInstanceFee(node: string, networkMagic: number, contractHash: string, instanceId: number, fee: number, signer: wallet.Account): Promise<string>;
    static totalGenerators(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number | string>;
    static totalGeneratorInstances(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<number | string>;
}
