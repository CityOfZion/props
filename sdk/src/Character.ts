import { merge } from 'lodash'
import {rpc, wallet, CONST} from '@cityofzion/neon-core'
import {CharacterAPI, NeoInterface} from './api'
import {sc} from "@cityofzion/neon-js";

const DEFAULT_OPTIONS: CharacterOptions = {
  node: 'http://localhost:50012',
  scriptHash: '0x3f57010287f648889d1ce5264d4fa7839fdab000'
}

export interface CharacterOptions {
  node?: string
  scriptHash?: string
}

export class Character {
  private options: CharacterOptions
  private networkMagic: number = -1

  constructor(options: CharacterOptions = {}) {
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
    return CharacterAPI.balanceOf(this.node.url, this.networkMagic, this.scriptHash, address)
  }

  async decimals(): Promise<number> {
    return CharacterAPI.decimals(this.node.url, this.networkMagic, this.scriptHash)
  }

  async deploy(data: object, upgrade: boolean, signer: wallet.Account): Promise<any> {
    return CharacterAPI.deploy(this.node.url, this.networkMagic, this.scriptHash, data, upgrade, signer)
  }

  async getAttributeMod(attributeValue: number): Promise<any> {
    return CharacterAPI.getAttributeMod(this.node.url, this.networkMagic, this.scriptHash, attributeValue)
  }

  async getAuthorizedAddresses(): Promise<string[]> {
    return CharacterAPI.getAuthorizedAddresses(this.node.url, this.networkMagic, this.scriptHash)
  }

  async getCharacterRaw(tokenId: string): Promise<string | undefined> {
    return CharacterAPI.getCharacterRaw(this.node.url, this.networkMagic, this.scriptHash, tokenId)
  }

  async ownerOf(tokenId: number): Promise<wallet.Account | undefined> {
    return CharacterAPI.ownerOf(this.node.url, this.networkMagic, this.scriptHash, tokenId)
  }

  async mint(signer: wallet.Account): Promise<string | undefined> {
    return CharacterAPI.mint(this.node.url, this.networkMagic, this.scriptHash, signer.address, signer)
  }

  async properties(tokenId: number): Promise<any> {
    return CharacterAPI.properties(this.node.url, this.networkMagic, this.scriptHash, tokenId)
  }

  async purchase(signer: wallet.Account): Promise<string | undefined> {
    const method = "transfer";

    const GASScriptHash = "0xd2a4cff31913016155e38e474a2c06d08be276cf"
    const GASPrecision = 10**8
    const purchasePrice = 1
    const params = [
      sc.ContractParam.hash160(signer.address),
      sc.ContractParam.hash160(this.scriptHash),
      sc.ContractParam.integer(purchasePrice * GASPrecision),
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

  async rollDie(die: string): Promise<number> {
    return CharacterAPI.rollDie(this.node.url, this.networkMagic, this.scriptHash, die)
  }

  async rollDiceWithEntropy(die: string, precision: number, entropy: string): Promise<any> {
    return CharacterAPI.rollDiceWithEntropy(this.node.url, this.networkMagic, this.scriptHash, die, precision, entropy)
  }

  async rollInitialStat(): Promise<boolean> {
    return CharacterAPI.rollInitialStat(this.node.url, this.networkMagic, this.scriptHash)
  }

  async rollInitialStateWithEntropy(entropy: string): Promise<any> {
    return CharacterAPI.rollInitialStatWithEntropy(this.node.url, this.networkMagic, this.scriptHash, entropy)
  }

  async setAuthorizedAddress(address: string, authorized: boolean, signer: wallet.Account): Promise<boolean> {
    return CharacterAPI.setAuthorizedAddress(this.node.url, this.networkMagic, this.scriptHash, address,authorized, signer)
  }

  async symbol(): Promise<string> {
    return CharacterAPI.symbol(this.node.url, this.networkMagic, this.scriptHash)
  }

  async tokens(): Promise<number[]> {
    return CharacterAPI.tokens(this.node.url, this.networkMagic, this.scriptHash)
  }

  async tokensOf(address: string): Promise<number[]> {
    return CharacterAPI.tokensOf(this.node.url, this.networkMagic, this.scriptHash, address)
  }

  async transfer(to: string, tokenId: number, signer: wallet.Account, data: any ): Promise<boolean | undefined> {
    return CharacterAPI.transfer(this.node.url, this.networkMagic, this.scriptHash,to, tokenId, signer, data)
  }

  async totalSupply(): Promise<number> {
    return CharacterAPI.totalSupply(this.node.url, this.networkMagic, this.scriptHash)
  }

  async update(script: string, manifest: string, signer: wallet.Account): Promise<boolean> {
    return CharacterAPI.update(this.node.url, this.networkMagic, this.scriptHash, script, manifest, signer)
  }

}
