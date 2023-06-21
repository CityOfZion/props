import { Neo3Invoker } from '@cityofzion/neo3-invoker'
import { Neo3Parser } from '@cityofzion/neo3-parser'

export type SmartContractConfig = {
  scriptHash: string
  invoker: Neo3Invoker
  parser: Neo3Parser
}

export interface CollectionType {
  id: number
  author: string
  description: string
  type: string
  values: string[] | number[]
  extra: any
  valuesRaw?: any[]
}

export enum InstanceAccessMode {
  ContractWhitelist = 0,
  ContractWhiteListRestricted = 1,
  Global = 2
}

export interface InstanceAuthorizedContracts {
  scriptHash: string,
  code: number
}


export interface GeneratorType {
  id?: number,
  author?: string
  label: string,
  baseGeneratorFee: number
  traits: TraitType[] | string[]
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
  args:
    EventCollectionPointer |
    EventInstanceCall |
    EventValue |
    EventCollectionSampleFrom
}

export interface EventCollectionPointer {
  collectionId: number,
  index: number
}

export interface EventCollectionSampleFrom {
  collectionId: number,
}

export interface EventInstanceCall {
  scriptHash: string
  method: string
  param: any[]
}

export interface EventValue {
  value: string
}

export enum EventTypeEnum {
  CollectionPointer = 0,
  InstanceCall = 1,
  Value = 2,
  CollectionSampleFrom = 3
}

export interface EpochType {
  author: string
  label: string,
  epochId: number,
  generatorInstanceId: number,
  initialRollCollectionId: number,
  mintFee: number,
  sysFee: number
  maxSupply: number,
  totalSupply: number
}

export interface PuppetType {
  armorClass: number
  attributes: BaseStats
  description: string
  epoch: number
  hitDie: string
  image: string
  name: string
  owner: string
  seed: string
  traits: {}
  tokenId: number
  tokenURI: string
}

export interface BaseStats {
  charisma: number
  constitution: number
  dexterity: number
  intelligence: number
  strength: number
  wisdom: number
}
