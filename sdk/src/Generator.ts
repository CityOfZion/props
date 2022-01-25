import { merge } from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import {GeneratorAPI} from './api'
import {GeneratorType, PropConstructorOptions} from "./interface";
import {sleep, txDidComplete} from "./helpers";
import fs from "fs";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0x47f945b1028961b539ecebbce8eaf3ef1aa9c084'
}

export class Generator {
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

  async createGenerator(generator: GeneratorType, signer: wallet.Account, timeConstantMS: number): Promise<string[]> {
    const txids = []
    let txid = await GeneratorAPI.createGenerator(this.node.url, this.networkMagic, this.scriptHash, generator.label, signer)
    txids.push(txid)
    await sleep(timeConstantMS)
    const res = await txDidComplete(this.node.url, txid, false)
    for await (let trait of generator.traits) {
      txid = await GeneratorAPI.createTrait(this.node.url, this.networkMagic, this.scriptHash, res[0], trait.label, trait.slots, trait.traitLevels, signer)
      txids.push(txid)
    }
    return txids
  }

  async createGeneratorFromFile(path: string, signer: wallet.Account, timeConstantMS: number): Promise<string[]> {
    const localGenerator = JSON.parse(fs.readFileSync(path).toString()) as GeneratorType
    return this.createGenerator(localGenerator, signer, timeConstantMS)
  }

  async getGeneratorJSON(generatorId: number, signer?: wallet.Account): Promise<GeneratorType | string> {
    return GeneratorAPI.getGeneratorJSON(this.node.url, this.networkMagic, this.scriptHash, generatorId, signer)
  }

  async getGeneratorInstanceJSON(instanceId: number, signer?: wallet.Account): Promise<any> {
   return GeneratorAPI.getGeneratorInstanceJSON(this.node.url, this.networkMagic, this.scriptHash, instanceId, signer)
  }

  async createInstance(generatorId: number, signer: wallet.Account): Promise<string> {
    return GeneratorAPI.createInstance(this.node.url, this.networkMagic, this.scriptHash, generatorId, signer)
  }

  async mintFromGenerator(generatorId: number, signer: wallet.Account): Promise<string> {
    return GeneratorAPI.mintFromGenerator(this.node.url, this.networkMagic, this.scriptHash, generatorId, signer)
  }

  async mintFromInstance(instanceId: number, signer: wallet.Account): Promise<string> {
    return GeneratorAPI.mintFromInstance(this.node.url, this.networkMagic, this.scriptHash, instanceId, signer)
  }

  async setInstanceAuthorizedUsers(instanceId: number, authorizedUsers: string[], signer: wallet.Account): Promise<string> {
    return GeneratorAPI.setInstanceAuthorizedUsers(this.node.url, this.networkMagic, this.scriptHash, instanceId, authorizedUsers, signer)
  }

  async totalGenerators(signer?: wallet.Account): Promise<number | string> {
    return GeneratorAPI.totalGenerators(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async totalGeneratorInstances(signer?: wallet.Account): Promise<number | string> {
    return GeneratorAPI.totalGeneratorInstances(this.node.url, this.networkMagic, this.scriptHash, signer)
  }
}
