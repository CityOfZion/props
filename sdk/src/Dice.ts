import { merge } from 'lodash'
import {rpc, wallet, CONST} from '@cityofzion/neon-core'
import {DiceAPI, NeoInterface} from './api'
import {sc} from "@cityofzion/neon-js";

const DEFAULT_OPTIONS: DiceOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0x68021f61e872098627da52dc82ca793575c83826'
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

  async randBetween(start: number, end: number, signer?: wallet.Account): Promise<number | string> {
    return DiceAPI.randBetween(this.node.url, this.networkMagic, this.scriptHash, start, end, signer)
  }

  async mapBytesOntoRange(start: number, end: number, entropy: string, signer?: wallet.Account): Promise<number | string> {
    return DiceAPI.mapBytesOntoRange(this.node.url, this.networkMagic, this.scriptHash, start, end, entropy, signer)
  }

  async rollDie(die: string, signer?: wallet.Account): Promise<number | string> {
    return DiceAPI.rollDie(this.node.url, this.networkMagic, this.scriptHash, die, signer)
  }

  async rollDiceWithEntropy(die: string, precision: number, entropy: string, signer?: wallet.Account): Promise<any> {
    return DiceAPI.rollDiceWithEntropy(this.node.url, this.networkMagic, this.scriptHash, die, precision, entropy, signer)
  }

}
