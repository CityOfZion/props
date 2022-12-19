import {merge} from 'lodash'
import {rpc, u, wallet} from '@cityofzion/neon-core'
import {ChestAPI, TemplateAPI} from './api'
import {EligibilityCase, NetworkOption, PropConstructorOptions} from "./interface";
import {formatter, sleep, txDidComplete} from "./helpers";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  network: NetworkOption.LocalNet
}

/**
  TEMPLATE CONTRACT CLASS
  Use this class template to build out the typescript interface for your smart contract.  If you rename this or the
  `api` equivalent, make sure to update the respective `index.ts` and rebuild.
 */

export class Chest {
  private options: PropConstructorOptions = DEFAULT_OPTIONS
  private networkMagic: number = -1

  // Once you get a scriptHash from deploying your smart contract via `npm run deploy`, update the `this.options.scriptHash` value.
  // The default is analogous to localnet (neo-express) so you will most likely want to be updating that value.  Remember to
  // compile the sdk before use or your change wont take effect.  Do that by running `tsc` in the sdk directory.
  constructor(options: PropConstructorOptions = {}) {
    switch(options.network) {
      case NetworkOption.TestNet:
        this.options.node = 'https://testnet1.neo.coz.io:443'
        this.options.scriptHash = ''
        break
      case NetworkOption.MainNet:
        this.options.node = 'https://mainnet1.neo.coz.io:443'
        this.options.scriptHash = '0xb94e721f5425ba1d8830ad752e50e0474f989da5'
        break
      default:
        this.options.node = 'http://127.0.0.1:50012'
        this.options.scriptHash = '0x343a49b4e39fc826f5ad6bdc64cc198a973511d3'
        break
    }
    this.options = merge({}, this.options, options)
  }

  /**
   * DO NOT EDIT ME
   * Gets the magic number for the network and configures the class instance.
   */
  async init() {
    const getVersionRes = await this.node.getVersion()
    this.networkMagic = getVersionRes.protocol.network
  }

  /**
   * DO NOT EDIT ME
   * The the node that the instance is connected to.
   */
  get node(): rpc.RPCClient {
    if (this.options.node) {
      return new rpc.RPCClient(this.options.node)
    }
    throw new Error('no node selected!')
  }

  /**
   * DO NOT EDIT ME
   * The contract script hash that is being interfaced with.
   */
  get scriptHash() : string {
    if (this.options.scriptHash) {
      return this.options.scriptHash
    }
    throw new Error('node scripthash defined')
  }

  /**
   *
   * EDIT ME!!!
   *
   * This template method is designed to be a passthough so you should really only be changing the name and parameter types.
   * All the magic happens in the TemplateAPI.templateMethod.  Check there to align your sdk with your smart contract.
   * Create one of these pass throughs for each method you expose in your smart contract. The goal of this entire class is to
   * simplify the network configuration steps which can be complicated.
   */
  async createChest(name: string, type: number, eligibilityCases: [EligibilityCase], signer: wallet.Account): Promise<number | string> {
    return ChestAPI.createChest(this.node.url, this.networkMagic, this.scriptHash, name, type, eligibilityCases, signer)
  }

  async isEligible(chestId: number, nftScriptHash: string, tokenId: string, signer?: wallet.Account): Promise<boolean> {
    return ChestAPI.isEligible(this.node.url, this.networkMagic, this.scriptHash, chestId, nftScriptHash, tokenId, signer)
  }

  async lootChest(chestId: number, nftScriptHash: string, tokenId: string, signer: wallet.Account): Promise<number | string> {
    return ChestAPI.lootChest(this.node.url, this.networkMagic, this.scriptHash, chestId, nftScriptHash, tokenId, signer)
  }

  async lootChestVerified(chestId: number, nftScriptHash: string, tokenId: string, signer: wallet.Account): Promise<any> {
    const timeout = 60000
    let age = 0
    const txid = await ChestAPI.lootChest(this.node.url, this.networkMagic, this.scriptHash, chestId, nftScriptHash, tokenId, signer)
    while (timeout >= age) {
      try {
        let res = await txDidComplete(this.node.url, txid, false)
        res[0].scriptHash = u.reverseHex(u.str2hexstring(res[0].scriptHash))
        return res
      } catch (e) {
        await sleep(1000)
        age += 1000
      }
    }
    throw new Error("timeout exceeded")
  }

  async lootChestAsOwner(chestId: number, signer: wallet.Account): Promise<number | string> {
    return ChestAPI.lootChestAsOwner(this.node.url, this.networkMagic, this.scriptHash, chestId, signer)
  }

  async getChestJSON(chestId: number, signer?: wallet.Account): Promise<number | string> {
    return ChestAPI.getChestJSON(this.node.url, this.networkMagic, this.scriptHash, chestId, signer)
  }

  async totalChests(name: string, type: number, signer?: wallet.Account): Promise<number | string> {
    return ChestAPI.totalChests(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

}
