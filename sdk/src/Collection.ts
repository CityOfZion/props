import { merge } from 'lodash'
import {rpc, wallet, CONST} from '@cityofzion/neon-core'
import {DiceAPI, NeoInterface, PuppetAPI} from './api'
import {sc} from "@cityofzion/neon-js";
import {CollectionType} from "./interface";
import {CollectionAPI} from "./api/collection";

const DEFAULT_OPTIONS: CollectionOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0x3f57010287f648889d1ce5264d4fa7839fdab000'
}

export interface CollectionOptions {
  node?: string
  scriptHash?: string
}

export class Collection {
  private options: CollectionOptions
  private networkMagic: number = -1

  constructor(options: CollectionOptions = {}) {
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
    throw new Error('node scripthash defined')
  }

  async totalCollections(): Promise<number | undefined> {
    return CollectionAPI.totalCollections(this.node.url, this.networkMagic, this.scriptHash)
  }

  async createCollection(description: string, collectionType: string, extra: string, values: string[], signer: wallet.Account): Promise<string | undefined> {
    return CollectionAPI.createCollection(this.node.url, this.networkMagic, this.scriptHash, description, collectionType, extra,  values, signer)
  }

  async getCollection(collectionId: number): Promise<string | undefined> {
    return CollectionAPI.getCollection(this.node.url, this.networkMagic, this.scriptHash, collectionId)
  }

  async getCollectionElement(collectionId: number, index: number): Promise<string | undefined> {
    return CollectionAPI.getCollectionElement(this.node.url, this.networkMagic, this.scriptHash, collectionId, index)
  }

  async getCollectionJSON(collectionId: number): Promise<CollectionType | undefined> {
    return CollectionAPI.getCollectionJSON(this.node.url, this.networkMagic, this.scriptHash, collectionId)
  }
}
