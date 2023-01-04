import { merge } from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import {PackageAPI, NeoInterface} from './api'
import {sc} from "@cityofzion/neon-js";
import {EpochType, NetworkOption, PropConstructorOptions, PackageType} from "./interface";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  network: NetworkOption.LocalNet
}

export class Package {
  private options: PropConstructorOptions = DEFAULT_OPTIONS
  private networkMagic: number = -1

  constructor(options: PropConstructorOptions = {}) {
    switch(options.network) {
      case NetworkOption.TestNet:
        this.options.node = 'https://testnet1.neo.coz.io:443'
        this.options.scriptHash = '0x1f7bc3162ecb3fc77a508aa4f69b9d2e86b3add4'
        break
      case NetworkOption.MainNet:
        this.options.node = 'https://mainnet1.neo.coz.io:443'
        this.options.scriptHash = '0x5728017130c213cbc369c738f470d66628e5acf2'
        break
      default:
        this.options.node = 'http://127.0.0.1:50012'
        this.options.scriptHash = '0x5cd0c2173453211441095a921bf56d0b9cb09f33'
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
    return PackageAPI.balanceOf(this.node.url, this.networkMagic, this.scriptHash, address, signer)
  }

  async createEpoch(label: string, generatorInstanceId: number, chestId: number, mintFee: number, sysFee: number, maxSupply: number, signer: wallet.Account): Promise<string> {
    return PackageAPI.createEpoch(this.node.url, this.networkMagic, this.scriptHash, label, generatorInstanceId, chestId, mintFee, sysFee, maxSupply, signer)
  }

  async decimals(signer?: wallet.Account): Promise<number> {
    return PackageAPI.decimals(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async deploy(signer: wallet.Account): Promise<string> {
    return PackageAPI.deploy(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async getEpochJSON(epochId: number, signer?: wallet.Account): Promise<EpochType | string> {
    return PackageAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId, signer)
  }

  async getTokenJSON(tokenId: string, signer?: wallet.Account): Promise<PackageType | string> {
    return PackageAPI.getTokenJSON(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async getTokenRaw(tokenId: string, signer?: wallet.Account): Promise<string> {
    return PackageAPI.getTokenRaw(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async ownerOf(tokenId: string, signer?: wallet.Account): Promise<wallet.Account | string> {
    return PackageAPI.ownerOf(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async offlineMint(epochId: number, owner: string, signer: wallet.Account): Promise<string> {
    return PackageAPI.offlineMint(this.node.url, this.networkMagic, this.scriptHash, epochId, owner, signer)
  }

  async properties(tokenId: string, signer?: wallet.Account): Promise<PackageType | string> {
    return PackageAPI.properties(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async purchase(epochId: number, signer: wallet.Account): Promise<string | undefined> {
    const method = "transfer";

    const GASScriptHash = "0xd2a4cff31913016155e38e474a2c06d08be276cf"
    const epoch = await PackageAPI.getEpochJSON(this.node.url, this.networkMagic, this.scriptHash, epochId)
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
    return PackageAPI.setMintFee(this.node.url, this.networkMagic, this.scriptHash, epochId, fee, signer)
  }

  async symbol(signer?: wallet.Account): Promise<string> {
    return PackageAPI.symbol(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async tokens(signer?: wallet.Account): Promise<number[] | string> {
    return PackageAPI.tokens(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async tokensOf(address: string, signer?: wallet.Account): Promise<string[] | string> {
    return PackageAPI.tokensOf(this.node.url, this.networkMagic, this.scriptHash, address, signer)
  }

  async totalAccounts(signer?: wallet.Account): Promise<number | string> {
    return PackageAPI.totalAccounts(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async totalEpochs(signer?: wallet.Account): Promise<number | string> {
    return PackageAPI.totalEpochs(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async totalSupply(signer?: wallet.Account): Promise<number | string> {
    return PackageAPI.totalSupply(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async transfer(to: string, tokenId: string, signer: wallet.Account, data: any): Promise<string> {
    return PackageAPI.transfer(this.node.url, this.networkMagic, this.scriptHash,to, tokenId, signer, data)
  }

  async update(script: string, manifest: string, signer: wallet.Account): Promise<string> {
    return PackageAPI.update(this.node.url, this.networkMagic, this.scriptHash, script, manifest, '', signer)
  }

}
