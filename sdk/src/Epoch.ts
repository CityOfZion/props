import { merge } from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import {EpochAPI} from './api'
import {EpochType, PropConstructorOptions, TraitLevel} from "./interface";
import {sleep, txDidComplete} from "./helpers";
import fs from "fs";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0xccff6257a59416028105709bc1e488a36ffeb9b2'
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

  async createEpoch(epoch: EpochType, signer: wallet.Account, timeConstantMS: number): Promise<string[]> {
    const txids = []
    let txid = await EpochAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, epoch.label, signer)
    txids.push(txid)
    await sleep(timeConstantMS)
    const res = await txDidComplete(this.node.url, txid, false)
    for await (let trait of epoch.traits) {
      txid = await EpochAPI.createTrait(this.node.url, this.networkMagic, this.scriptHash, res[0], trait.label, trait.slots, trait.traitLevels, signer)
      txids.push(txid)
    }
    return txids
  }

  async createEpochFromFile(path: string, signer: wallet.Account, timeConstantMS: number): Promise<string[]> {
    const localEpoch = JSON.parse(fs.readFileSync(path).toString()) as EpochType
    return this.createEpoch(localEpoch, signer, timeConstantMS)
  }

  async getEpochJSON(epochId: number, signer?: wallet.Account): Promise<EpochType | string> {
    return EpochAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId, signer)
  }

  async getEpochInstanceJSON(instanceId: number, signer?: wallet.Account): Promise<any> {
   return EpochAPI.getEpochInstanceJSON(this.node.url, this.networkMagic, this.scriptHash, instanceId, signer)
  }

  async createInstance(epochId: number, signer: wallet.Account): Promise<string> {
    return EpochAPI.createInstance(this.node.url, this.networkMagic, this.scriptHash, epochId, signer)
  }

  async mintFromEpoch(epochId: number, signer: wallet.Account): Promise<string> {
    return EpochAPI.mintFromEpoch(this.node.url, this.networkMagic, this.scriptHash, epochId, signer)
  }

  async mintFromInstance(instanceId: number, signer: wallet.Account): Promise<string> {
    return EpochAPI.mintFromInstance(this.node.url, this.networkMagic, this.scriptHash, instanceId, signer)
  }

  async setInstanceAuthorizedUsers(instanceId: number, authorizedUsers: string[], signer: wallet.Account): Promise<string> {
    return EpochAPI.setInstanceAuthorizedUsers(this.node.url, this.networkMagic, this.scriptHash, instanceId, authorizedUsers, signer)
  }

  async totalEpochs(signer?: wallet.Account): Promise<number | string> {
    return EpochAPI.totalEpochs(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async totalEpochInstances(signer?: wallet.Account): Promise<number | string> {
    return EpochAPI.totalEpochInstances(this.node.url, this.networkMagic, this.scriptHash, signer)
  }
}
