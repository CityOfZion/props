import { wallet } from "@cityofzion/neon-core";
import { ContractParamLike } from "@cityofzion/neon-core/lib/sc";
export declare enum EventTypeEnum {
    CollectionPointer = 0,
    InstanceCall = 1,
    Value = 2,
    CollectionSampleFrom = 3
}
export declare enum InstanceAccessMode {
    ContractWhitelist = 0,
    ContractWhiteListRestricted = 1,
    Global = 2
}
export declare enum NetworkOption {
    LocalNet = 0,
    TestNet = 1,
    MainNet = 2
}
export interface BaseStats {
    charisma: number;
    constitution: number;
    dexterity: number;
    intelligence: number;
    strength: number;
    wisdom: number;
}
export interface PuppetType {
    armorClass: number;
    attributes: BaseStats;
    description: string;
    epoch: number;
    hitDie: string;
    image: string;
    name: string;
    owner: wallet.Account;
    seed: string;
    traits: {};
    tokenId: number;
    tokenURI: string;
}
export interface CollectionType {
    id: number;
    author: wallet.Account;
    description: string;
    type: string;
    values: string[] | number[];
    extra: any;
    valuesRaw?: any[];
}
export interface EpochType {
    author: string;
    label: string;
    epochId: number;
    generatorInstanceId: number;
    initialRollCollectionId: number;
    mintFee: number;
    sysFee: number;
    maxSupply: number;
    totalSupply: number;
}
export interface GeneratorType {
    id?: number;
    author?: string;
    label: string;
    baseGeneratorFee: number;
    traits: TraitType[] | string[];
}
export interface GiftType {
    description: string;
    epoch: number;
    image: string;
    name: string;
    owner: wallet.Account;
    seed: string;
    traits: {};
    tokenId: number;
    tokenURI: string;
}
export interface InstanceAuthorizedContracts {
    scriptHash: string;
    code: number;
}
export interface TraitType {
    label: string;
    slots: number;
    traitLevels: TraitLevel[];
}
export interface TraitLevel {
    dropScore: number;
    mintMode: number;
    traits: EventTypeWrapper[];
}
export interface EventTypeWrapper {
    type: EventTypeEnum;
    maxMint: number;
    args: EventCollectionPointer | EventInstanceCall | EventValue | EventCollectionSampleFrom;
}
export interface EventCollectionPointer {
    collectionId: number;
    index: number;
}
export interface EventCollectionSampleFrom {
    collectionId: number;
}
export interface EventInstanceCall {
    scriptHash: string;
    method: string;
    param: ContractParamLike[];
}
export interface EventValue {
    value: string;
}
export interface PropConstructorOptions {
    network?: NetworkOption;
    node?: string;
    scriptHash?: string;
}
export interface EligibilityAttribute {
    logic: string;
    key: string;
    value: any;
}
export interface EligibilityCase {
    scriptHash: string;
    attributes: [EligibilityAttribute];
}
