import { merge } from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import {EpochAPI} from './api'
import {EpochType, PropConstructorOptions, TraitLevel} from "./interface";
import fs from "fs";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0xe938f1d44002853ffd41ff27ea890c8b5c69a204'
}

export class Epoch {
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
    throw new Error('node scripthash defined')
  }

  async createEpoch(epoch: EpochType, signer: wallet.Account): Promise<string | undefined> {
    return EpochAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, epoch.label, epoch.traits, signer)
  }

  async createEpochFromFile(path: string, signer: wallet.Account): Promise<string> {
    const localEpoch = JSON.parse(fs.readFileSync(path).toString()) as EpochType
    return EpochAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, localEpoch.label, localEpoch.traits, signer)
  }

  async getEpochJSON(epochId: number): Promise<string | undefined> {
    return EpochAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId)
  }

  async mintFromEpoch(epochId: number, signer: wallet.Account): Promise<string | undefined> {
    return EpochAPI.mintFromEpoch(this.node.url, this.networkMagic, this.scriptHash, epochId, signer)
  }

  async totalEpochs(): Promise<number | undefined> {
    return EpochAPI.totalEpochs(this.node.url, this.networkMagic, this.scriptHash)
  }
}
