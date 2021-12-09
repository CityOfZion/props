import { wallet } from "@cityofzion/neon-core";
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
    epoch: number;
    hitDie: string;
    name: string;
    owner: wallet.Account;
    traits: string[];
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
export interface Epoch {
    label: string;
    maxTraits: number;
    traitLevels: TraitLevel[];
}
export interface TraitLevel {
    drop_score: number;
    unique: boolean;
    traits: CollectionPointer[];
}
export interface CollectionPointer {
    collection_id: number;
    index: number;
}
