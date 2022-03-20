import { merge } from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import {GeneratorAPI} from './api'
import {
  GeneratorType,
  InstanceAccessMode,
  InstanceAuthorizedContracts, NetworkOption,
  PropConstructorOptions,
  TraitType
} from "./interface";
import {sleep, txDidComplete} from "./helpers";
import fs from "fs";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  network: NetworkOption.LocalNet
}

export class Generator {
  private options: PropConstructorOptions = DEFAULT_OPTIONS
  private networkMagic: number = -1

  constructor(options: PropConstructorOptions = {}) {
    switch(this.options.network) {
      case NetworkOption.TestNet:
        this.options.node = 'https://testnet1.neo.coz.io:443'
        this.options.scriptHash = '0xdda8055789f0eb3c1d092c714a68ba3e631586c7'
        break
      case NetworkOption.MainNet:
        this.options.node = 'https://mainnet1.neo.coz.io:443'
        this.options.scriptHash = '' //not implemented
        break
      default:
        this.options.node = 'http://localhost:50012'
        this.options.scriptHash = '0xf8cab6d2ad81e3b7b6f94ef8bb12b8611c9952ab'
        break
    }
    this.options = merge({}, this.options, options)
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
    let txid = await GeneratorAPI.createGenerator(this.node.url, this.networkMagic, this.scriptHash, generator.label, generator.baseGeneratorFee, signer)
    txids.push(txid)
    await sleep(timeConstantMS)
    const res = await txDidComplete(this.node.url, txid, false)
    for await (let trait of generator.traits) {
      trait = trait as TraitType
      txid = await GeneratorAPI.createTrait(this.node.url, this.networkMagic, this.scriptHash, res[0], trait.label, trait.slots, trait.traitLevels, signer)
      txids.push(txid)
      await sleep(timeConstantMS)
    }
    return txids
  }

  async createGeneratorFromFile(path: string, signer: wallet.Account, timeConstantMS: number): Promise<string[]> {
    const localGenerator = JSON.parse(fs.readFileSync(path).toString()) as GeneratorType
    return this.createGenerator(localGenerator, signer, timeConstantMS)
  }

  async createTrait(generatorId: number, trait: TraitType, signer: wallet.Account): Promise<string> {
    return GeneratorAPI.createTrait(this.node.url, this.networkMagic, this.scriptHash, generatorId, trait.label, trait.slots, trait.traitLevels, signer)
  }

  async getGeneratorJSON(generatorId: number, signer?: wallet.Account): Promise<GeneratorType | string> {
    const generator = await GeneratorAPI.getGeneratorJSON(this.node.url, this.networkMagic, this.scriptHash, generatorId, signer)
    const gType = generator as GeneratorType

    const traits: TraitType[] = []
    for (let i = 0; i < gType.traits.length; i++) {
      let trait = await GeneratorAPI.getTraitJSON(this.node.url, this.networkMagic, this.scriptHash, gType.traits[i] as string)
      traits.push(trait as TraitType)
    }
    gType.traits = traits
    return gType
  }

  async getGeneratorInstanceJSON(instanceId: number, signer?: wallet.Account): Promise<any> {
   return GeneratorAPI.getGeneratorInstanceJSON(this.node.url, this.networkMagic, this.scriptHash, instanceId, signer)
  }

  async createInstance(generatorId: number, signer: wallet.Account): Promise<string> {
    return GeneratorAPI.createInstance(this.node.url, this.networkMagic, this.scriptHash, generatorId, signer)
  }

  async mintFromInstance(instanceId: number, signer: wallet.Account): Promise<string> {
    return GeneratorAPI.mintFromInstance(this.node.url, this.networkMagic, this.scriptHash, instanceId, signer)
  }

  async setInstanceAccessMode(instanceId: number, accessMode: InstanceAccessMode, signer: wallet.Account): Promise<string> {
    return GeneratorAPI.setInstanceAccessMode(this.node.url, this.networkMagic, this.scriptHash, instanceId, accessMode, signer)
  }

  async setInstanceAuthorizedUsers(instanceId: number, authorizedUsers: string[], signer: wallet.Account): Promise<string> {
    return GeneratorAPI.setInstanceAuthorizedUsers(this.node.url, this.networkMagic, this.scriptHash, instanceId, authorizedUsers, signer)
  }

  async setInstanceAuthorizedContracts(instanceId: number, authorizedContracts: InstanceAuthorizedContracts[], signer: wallet.Account): Promise<string> {
    return GeneratorAPI.setInstanceAuthorizedContracts(this.node.url, this.networkMagic, this.scriptHash, instanceId, authorizedContracts, signer)
  }

  async setInstanceFee(instanceId: number, fee: number, signer: wallet.Account): Promise<string> {
    return GeneratorAPI.setInstanceFee(this.node.url, this.networkMagic, this.scriptHash, instanceId, fee, signer)
  }

  async totalGenerators(signer?: wallet.Account): Promise<number | string> {
    return GeneratorAPI.totalGenerators(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async totalGeneratorInstances(signer?: wallet.Account): Promise<number | string> {
    return GeneratorAPI.totalGeneratorInstances(this.node.url, this.networkMagic, this.scriptHash, signer)
  }
}
