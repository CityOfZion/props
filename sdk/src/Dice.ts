import { merge } from 'lodash'
import {rpc, wallet, CONST} from '@cityofzion/neon-core'
import {DiceAPI, NeoInterface} from './api'
import {sc} from "@cityofzion/neon-js";

const DEFAULT_OPTIONS: DiceOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0x3f57010287f648889d1ce5264d4fa7839fdab000'
}

export interface DiceOptions {
  node?: string
  scriptHash?: string
}

export class Dice {
  private options: DiceOptions
  private networkMagic: number = -1

  constructor(options: DiceOptions = {}) {
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

  async rollDie(die: string): Promise<number> {
    return DiceAPI.rollDie(this.node.url, this.networkMagic, this.scriptHash, die)
  }

  async rollDiceWithEntropy(die: string, precision: number, entropy: string): Promise<any> {
    return DiceAPI.rollDiceWithEntropy(this.node.url, this.networkMagic, this.scriptHash, die, precision, entropy)
  }

  async rollInitialStat(): Promise<boolean> {
    return DiceAPI.rollInitialStat(this.node.url, this.networkMagic, this.scriptHash)
  }

  async rollInitialStateWithEntropy(entropy: string): Promise<any> {
    return DiceAPI.rollInitialStatWithEntropy(this.node.url, this.networkMagic, this.scriptHash, entropy)
  }
}
