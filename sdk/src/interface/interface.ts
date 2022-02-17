import { wallet } from "@cityofzion/neon-core";
import {ContractParamLike} from "@cityofzion/neon-core/lib/sc";

export enum EventTypeEnum {
  CollectionPointer = 0,
  ContractCall = 1,
  Value = 2
}

export enum InstanceAccessMode {
  ContractWhitelist = 0,
  ContractWhiteListRestricted = 1,
  Global = 2
}

export interface BaseStats {
  charisma: number
  constitution: number
  dexterity: number
  intelligence: number
  strength: number
  wisdom: number
}

export interface PuppetType {
  armorClass: number
  attributes: BaseStats
  epoch: number
  hitDie: string
  name: string
  owner: wallet.Account
  traits: {}
  tokenId: number
  tokenURI: string
}

export interface CollectionType {
  id: number
  author: wallet.Account
  description: string
  type: string
  values: string[] | number[]
  extra: any
  valuesRaw?: any[]
}

export interface EpochType {
  author: string
  epochId: number,
  generatorInstanceId: number,
  mintFee: number,
  maxSupply: number,
  totalSupply: number
}

export interface GeneratorType {
  id?: number,
  author?: string
  label: string,
  baseGeneratorFee: number
  traits: TraitType[] | string[]
}

export interface InstanceAuthorizedContracts {
  scriptHash: string,
  code: number
}

export interface TraitType {
  label: string
  slots: number
  traitLevels: TraitLevel[]
}

export interface TraitLevel {
  dropScore: number,
  mintMode: number,
  traits: EventTypeWrapper[]
}

export interface EventTypeWrapper {
  type: EventTypeEnum,
  maxMint: number
  args: EventCollectionPointer | EventContractCall

}

export interface EventCollectionPointer {
  collectionId: number,
  index: number
}

export interface EventContractCall {
  scriptHash: string
  method: string
  param: ContractParamLike[]
}

export interface PropConstructorOptions {
  node?: string
  scriptHash?: string
}