import { merge } from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import {PuppetAPI, NeoInterface} from './api'
import {sc} from "@cityofzion/neon-js";
import {EpochType, PropConstructorOptions, PuppetType} from "./interface";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0x832156d0fd281880b84ff0f852c1f3064aae3fc7'
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

  async balanceOf(address: string, signer?: wallet.Account): Promise<number> {
    return PuppetAPI.balanceOf(this.node.url, this.networkMagic, this.scriptHash, address, signer)
  }

  async createEpoch(generatorId: number, mintFee: number, sysFee: number, maxSupply: number, signer: wallet.Account): Promise<string> {
    return PuppetAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, generatorId, mintFee, sysFee, maxSupply, signer)
  }

  async decimals(signer?: wallet.Account): Promise<number> {
    return PuppetAPI.decimals(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async deploy(signer: wallet.Account): Promise<string> {
    return PuppetAPI.deploy(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async getAttributeMod(attributeValue: number, signer?: wallet.Account): Promise<number | string> {
    return PuppetAPI.getAttributeMod(this.node.url, this.networkMagic, this.scriptHash, attributeValue, signer)
  }

  async getEpochJSON(epochId: number, signer?: wallet.Account): Promise<EpochType | string> {
    return PuppetAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId, signer)
  }

  async getPuppetJSON(tokenId: number, signer?: wallet.Account): Promise<PuppetType | string> {
    return PuppetAPI.getPuppetJSON(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async getPuppetRaw(tokenId: string, signer?: wallet.Account): Promise<string> {
    return PuppetAPI.getPuppetRaw(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async ownerOf(tokenId: number, signer?: wallet.Account): Promise<wallet.Account | string> {
    return PuppetAPI.ownerOf(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async offlineMint(epochId: number, owner: string, signer: wallet.Account): Promise<string> {
    return PuppetAPI.offlineMint(this.node.url, this.networkMagic, this.scriptHash, epochId, owner, signer)
  }

  async properties(tokenId: number, signer?: wallet.Account): Promise<PuppetType | string> {
    return PuppetAPI.properties(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async purchase(epochId: number, signer: wallet.Account): Promise<string | undefined> {
    const method = "transfer";

    const GASScriptHash = "0xd2a4cff31913016155e38e474a2c06d08be276cf"
    const epoch = await PuppetAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId)
    const EpochTyped = epoch as unknown as EpochType
    if (EpochTyped.totalSupply === EpochTyped.maxSupply) {
      throw new Error(`Epoch is out of Puppets: ${EpochTyped.totalSupply} / ${EpochTyped.maxSupply}`)
    }

    const purchasePrice = EpochTyped.mintFee
    const params = [
      sc.ContractParam.hash160(signer.address),
      sc.ContractParam.hash160(this.scriptHash),
      sc.ContractParam.integer(purchasePrice),
      sc.ContractParam.integer(epochId)
    ]
    try {
      return await NeoInterface.publishInvoke(
        this.node.url,
        this.networkMagic,
        GASScriptHash,
        method,
        params,
        signer
      );
    } catch (e) {
      throw new Error("Something went wrong: " + (e as Error).message)
    }
  }

  async setMintFee(epochId: number, fee: number, signer: wallet.Account): Promise<string> {
    return PuppetAPI.setMintFee(this.node.url, this.networkMagic, this.scriptHash, epochId, fee, signer)
  }

  async symbol(signer?: wallet.Account): Promise<string> {
    return PuppetAPI.symbol(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async tokens(signer?: wallet.Account): Promise<number[] | string> {
    return PuppetAPI.tokens(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async tokensOf(address: string, signer?: wallet.Account): Promise<number[] | string> {
    return PuppetAPI.tokensOf(this.node.url, this.networkMagic, this.scriptHash, address, signer)
  }

  async totalAccounts(signer?: wallet.Account): Promise<number | string> {
    return PuppetAPI.totalAccounts(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async totalEpochs(signer?: wallet.Account): Promise<number | string> {
    return PuppetAPI.totalEpochs(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async totalSupply(signer?: wallet.Account): Promise<number | string> {
    return PuppetAPI.totalSupply(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async transfer(to: string, tokenId: number, signer: wallet.Account, data: any): Promise<string> {
    return PuppetAPI.transfer(this.node.url, this.networkMagic, this.scriptHash,to, tokenId, signer, data)
  }

  async update(script: string, manifest: string, signer: wallet.Account): Promise<string> {
    return PuppetAPI.update(this.node.url, this.networkMagic, this.scriptHash, script, manifest, signer)
  }

}
