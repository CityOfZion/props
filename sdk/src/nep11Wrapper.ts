import { merge } from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import { Nep11 } from './api'

const DEFAULT_OPTIONS: Nep11WrapperOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0x3f57010287f648889d1ce5264d4fa7839fdab000'
}

export interface Nep11WrapperOptions {
  node?: string
  scriptHash?: string
}

export class Nep11Wrapper {
  private options: Nep11WrapperOptions
  private networkMagic: number = -1

  constructor(options: Nep11WrapperOptions = {}) {
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

  async deploy(data: object, upgrade: boolean, account: wallet.Account): Promise<any> {
    return Nep11.deploy(this.node.url, this.networkMagic, this.scriptHash, data, upgrade, account)
  }

  async balanceOf(address: string): Promise<number> {
    return Nep11.balanceOf(this.node.url, this.networkMagic, this.scriptHash, address)
  }

  async decimals(): Promise<number> {
    return Nep11.decimals(this.node.url, this.networkMagic, this.scriptHash)
  }

  async mint(meta: string, royalties: string, data: string, account: wallet.Account): Promise<string | undefined> {
    return Nep11.mint(this.node.url, this.networkMagic, this.scriptHash, account.address, meta, royalties, data, account)
  }

  async ownerOf(tokenId: string): Promise<string> {
    return Nep11.ownerOf(this.node.url, this.networkMagic, this.scriptHash, tokenId)
  }

  async properties(tokenId: string): Promise<any> {
    return Nep11.properties(this.node.url, this.networkMagic, this.scriptHash, tokenId)
  }

  async symbol(): Promise<string> {
    return Nep11.symbol(this.node.url, this.networkMagic, this.scriptHash)
  }

  async tokens(): Promise<string[]> {
    return Nep11.tokens(this.node.url, this.networkMagic, this.scriptHash)
  }

  async tokensOf(address: string): Promise<string[]> {
    return Nep11.tokensOf(this.node.url, this.networkMagic, this.scriptHash, address)
  }

  async totalSupply(): Promise<number> {
    return Nep11.totalSupply(this.node.url, this.networkMagic, this.scriptHash)
  }

}