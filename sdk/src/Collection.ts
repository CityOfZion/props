import { merge } from 'lodash'
import {u, rpc, wallet, CONST} from '@cityofzion/neon-core'
import {DiceAPI, NeoInterface, PuppetAPI} from './api'
import {sc} from "@cityofzion/neon-js";
import {CollectionType, PropConstructorOptions} from "./interface";
import {CollectionAPI} from "./api/collection";
import fs from 'fs'
import {ContractParamLike} from "@cityofzion/neon-core/lib/sc";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0xa80d045ca80e0421aa855c3a000bfbe5dddadced'
}

export class Collection {
  private options: PropConstructorOptions
  private networkMagic: number = -1

  constructor(options: PropConstructorOptions = {}) {
    this.options = merge({}, DEFAULT_OPTIONS, options)
  }

  async init() {
    const getVersionRes = await this.node.getVersion()
    this.networkMagic = getVersionRes.protocol.network
  }

  get node(): rpc.RPCClient {
    if (this.options.node) {
      return new rpc.RPCClient(this.options.node)
    }
    throw new Error('no node selected!')
  }

  get scriptHash() : string {
    if (this.options.scriptHash) {
      return this.options.scriptHash
    }
    throw new Error('scripthash defined')
  }

  async createCollection(description: string, collectionType: string, extra: string, values: string[], signer: wallet.Account): Promise<string> {
    return CollectionAPI.createCollection(this.node.url, this.networkMagic, this.scriptHash, description, collectionType, extra,  values, signer)
  }

  async createFromFile(path: string, signer: wallet.Account): Promise<string> {
    const localCollection = JSON.parse(fs.readFileSync(path).toString()) as CollectionType
    const formattedValues = (localCollection.values as any[]).map( (value: string | number) => {
      switch (localCollection.type) {
        case 'string':
          return sc.ContractParam.string(value as string)
        case 'int':
          return sc.ContractParam.integer(value as number)
      }
    }) as ContractParamLike[]
    return CollectionAPI.createCollectionRaw(this.node.url, this.networkMagic, this.scriptHash, localCollection.description, localCollection.type, localCollection.extra, formattedValues, signer)
  }

  async getCollectionJSON(collectionId: number, signer?: wallet.Account): Promise<CollectionType> {
    return CollectionAPI.getCollectionJSON(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer)
  }

  async getCollection(collectionId: number, signer?: wallet.Account): Promise<string> {
    return CollectionAPI.getCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer)
  }

  async getCollectionElement(collectionId: number, index: number, signer?: wallet.Account): Promise<string> {
    return CollectionAPI.getCollectionElement(this.node.url, this.networkMagic, this.scriptHash, collectionId, index, signer)
  }

  async getCollectionLength(collectionId: number, signer?: wallet.Account): Promise<number> {
    return CollectionAPI.getCollectionLength(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer)
  }

  async getCollectionValues(collectionId: number, signer?: wallet.Account): Promise<string[] | any> {
    return CollectionAPI.getCollectionValues(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer)
  }

  async mapBytesOntoCollection(collectionId: number, entropy: string, signer?: wallet.Account): Promise<string> {
    return CollectionAPI.mapBytesOntoCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, entropy, signer)
  }

  async sampleFromCollection(collectionId: number, signer?: wallet.Account): Promise<string> {
    return CollectionAPI.sampleFromCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId, signer)
  }

  async totalCollections(signer?: wallet.Account): Promise<number | undefined> {
    return CollectionAPI.totalCollections(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

}
