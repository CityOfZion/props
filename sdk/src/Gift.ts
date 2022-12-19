import { merge } from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import {GiftAPI, NeoInterface} from './api'
import {sc} from "@cityofzion/neon-js";
import {EpochType, NetworkOption, PropConstructorOptions, GiftType} from "./interface";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  network: NetworkOption.LocalNet
}

export class Gift {
  private options: PropConstructorOptions = DEFAULT_OPTIONS
  private networkMagic: number = -1

  constructor(options: PropConstructorOptions = {}) {
    switch(options.network) {
      case NetworkOption.TestNet:
        this.options.node = 'https://testnet1.neo.coz.io:443'
        this.options.scriptHash = '0x97857c01d64f846b5fe2eca2d09d2d73928b3f43'
        break
      case NetworkOption.MainNet:
        this.options.node = 'https://mainnet1.neo.coz.io:443'
        this.options.scriptHash = '0x76a8f8a7a901b29a33013b469949f4b08db15756'
        break
      default:
        this.options.node = 'http://127.0.0.1:50012'
        this.options.scriptHash = '0x374fc3ca866761a01082186c71a6301d4ba2a363'
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

  async balanceOf(address: string, signer?: wallet.Account): Promise<number> {
    return GiftAPI.balanceOf(this.node.url, this.networkMagic, this.scriptHash, address, signer)
  }

  async createEpoch(label: string, generatorInstanceId: number, initialRollCollectionId: number, mintFee: number, sysFee: number, maxSupply: number, signer: wallet.Account): Promise<string> {
    return GiftAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, label, generatorInstanceId, initialRollCollectionId, mintFee, sysFee, maxSupply, signer)
  }

  async decimals(signer?: wallet.Account): Promise<number> {
    return GiftAPI.decimals(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async deploy(signer: wallet.Account): Promise<string> {
    return GiftAPI.deploy(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async getEpochJSON(epochId: number, signer?: wallet.Account): Promise<EpochType | string> {
    return GiftAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId, signer)
  }

  async getTokenJSON(tokenId: string, signer?: wallet.Account): Promise<GiftType | string> {
    return GiftAPI.getTokenJSON(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async getTokenRaw(tokenId: string, signer?: wallet.Account): Promise<string> {
    return GiftAPI.getTokenRaw(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async ownerOf(tokenId: string, signer?: wallet.Account): Promise<wallet.Account | string> {
    return GiftAPI.ownerOf(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async offlineMint(epochId: number, owner: string, signer: wallet.Account): Promise<string> {
    return GiftAPI.offlineMint(this.node.url, this.networkMagic, this.scriptHash, epochId, owner, signer)
  }

  async properties(tokenId: string, signer?: wallet.Account): Promise<GiftType | string> {
    return GiftAPI.properties(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async purchase(epochId: number, signer: wallet.Account): Promise<string | undefined> {
    const method = "transfer";

    const GASScriptHash = "0xd2a4cff31913016155e38e474a2c06d08be276cf"
    const epoch = await GiftAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId)
    const EpochTyped = epoch as unknown as EpochType
    if (EpochTyped.totalSupply === EpochTyped.maxSupply) {
      throw new Error(`Epoch is out of Tokens: ${EpochTyped.totalSupply} / ${EpochTyped.maxSupply}`)
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
    return GiftAPI.setMintFee(this.node.url, this.networkMagic, this.scriptHash, epochId, fee, signer)
  }

  async symbol(signer?: wallet.Account): Promise<string> {
    return GiftAPI.symbol(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async tokens(signer?: wallet.Account): Promise<number[] | string> {
    return GiftAPI.tokens(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async tokensOf(address: string, signer?: wallet.Account): Promise<string[] | string> {
    return GiftAPI.tokensOf(this.node.url, this.networkMagic, this.scriptHash, address, signer)
  }

  async totalAccounts(signer?: wallet.Account): Promise<number | string> {
    return GiftAPI.totalAccounts(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async totalEpochs(signer?: wallet.Account): Promise<number | string> {
    return GiftAPI.totalEpochs(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async totalSupply(signer?: wallet.Account): Promise<number | string> {
    return GiftAPI.totalSupply(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async transfer(to: string, tokenId: string, signer: wallet.Account, data: any): Promise<string> {
    return GiftAPI.transfer(this.node.url, this.networkMagic, this.scriptHash,to, tokenId, signer, data)
  }

  async update(script: string, manifest: string, signer: wallet.Account): Promise<string> {
    return GiftAPI.update(this.node.url, this.networkMagic, this.scriptHash, script, manifest, '', signer)
  }

}
