import { merge } from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import {PuppetAPI, NeoInterface} from './api'
import {sc} from "@cityofzion/neon-js";
import {PropConstructorOptions} from "./interface";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0x6649331674950e1ad598dc6f0fdf8177884fd015'
}

export class Puppet {
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

  async balanceOf(address: string): Promise<number> {
    return PuppetAPI.balanceOf(this.node.url, this.networkMagic, this.scriptHash, address)
  }

  async decimals(): Promise<number> {
    return PuppetAPI.decimals(this.node.url, this.networkMagic, this.scriptHash)
  }

  async deploy(signer: wallet.Account): Promise<any> {
    return PuppetAPI.deploy(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async getAttributeMod(attributeValue: number): Promise<any> {
    return PuppetAPI.getAttributeMod(this.node.url, this.networkMagic, this.scriptHash, attributeValue)
  }

  async getPuppetRaw(tokenId: string): Promise<string | undefined> {
    return PuppetAPI.getPuppetRaw(this.node.url, this.networkMagic, this.scriptHash, tokenId)
  }

  async ownerOf(tokenId: number): Promise<wallet.Account | undefined> {
    return PuppetAPI.ownerOf(this.node.url, this.networkMagic, this.scriptHash, tokenId)
  }

  async offlineMint(target: string, signer: wallet.Account): Promise<string | undefined> {
    return PuppetAPI.offlineMint(this.node.url, this.networkMagic, this.scriptHash, target, signer)
  }

  async properties(tokenId: number): Promise<any> {
    return PuppetAPI.properties(this.node.url, this.networkMagic, this.scriptHash, tokenId)
  }

  async purchase(signer: wallet.Account): Promise<string | undefined> {
    const method = "transfer";

    const GASScriptHash = "0xd2a4cff31913016155e38e474a2c06d08be276cf"
    const purchasePrice = await PuppetAPI.getMintFee(this.node.url, this.networkMagic, this.scriptHash)
    const params = [
      sc.ContractParam.hash160(signer.address),
      sc.ContractParam.hash160(this.scriptHash),
      sc.ContractParam.integer(purchasePrice),
      sc.ContractParam.any()
    ]
    try {
      const res = await NeoInterface.publishInvoke(
        this.node.url,
        this.networkMagic,
        GASScriptHash,
        method,
        params,
        signer
      );
      return res
    } catch (e) {
      throw new Error(e)
    }
  }

  async setMintFee(fee: number, signer: wallet.Account): Promise<number> {
    return PuppetAPI.setMintFee(this.node.url, this.networkMagic, this.scriptHash,fee, signer)
  }

  async symbol(): Promise<string> {
    return PuppetAPI.symbol(this.node.url, this.networkMagic, this.scriptHash)
  }

  async getMintFee(): Promise<number> {
    return PuppetAPI.getMintFee(this.node.url, this.networkMagic, this.scriptHash)
  }

  async tokens(): Promise<number[]> {
    return PuppetAPI.tokens(this.node.url, this.networkMagic, this.scriptHash)
  }

  async tokensOf(address: string): Promise<number[]> {
    return PuppetAPI.tokensOf(this.node.url, this.networkMagic, this.scriptHash, address)
  }

  async transfer(to: string, tokenId: number, signer: wallet.Account, data: any ): Promise<boolean | undefined> {
    return PuppetAPI.transfer(this.node.url, this.networkMagic, this.scriptHash,to, tokenId, signer, data)
  }

  async totalSupply(): Promise<number> {
    return PuppetAPI.totalSupply(this.node.url, this.networkMagic, this.scriptHash)
  }

  async update(script: string, manifest: string, signer: wallet.Account): Promise<boolean> {
    return PuppetAPI.update(this.node.url, this.networkMagic, this.scriptHash, script, manifest, signer)
  }

  async setCurrentEpoch(epoch_id: number, signer: wallet.Account): Promise<boolean | undefined> {
    return PuppetAPI.setCurrentEpoch(this.node.url, this.networkMagic, this.scriptHash, epoch_id, signer)
  }

  async getCurrentEpoch(): Promise<number | undefined> {
    return PuppetAPI.getCurrentEpoch(this.node.url, this.networkMagic, this.scriptHash)
  }
}
