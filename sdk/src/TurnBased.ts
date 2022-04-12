import {merge} from 'lodash'
import {rpc, wallet} from '@cityofzion/neon-core'
import {TemplateAPI, TurnBasedAPI} from './api'
import {NetworkOption, PropConstructorOptions} from "./interface";

const DEFAULT_OPTIONS: PropConstructorOptions = {
  network: NetworkOption.LocalNet
}

/**
  TEMPLATE CONTRACT CLASS
  Use this class template to build out the typescript interface for your smart contract.  If you rename this or the
  `api` equivalent, make sure to update the respective `index.ts` and rebuild.
 */

export class TurnBased {
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
        this.options.scriptHash = ''
        break
      default:
        this.options.node = 'http://localhost:50012'
        this.options.scriptHash = '0x454243c0822f0c83cce089ec67762c1afc1f9ac6'
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
  async totalGames(signer?: wallet.Account): Promise<number> {
    return TurnBasedAPI.totalGames(this.node.url, this.networkMagic, this.scriptHash, signer)
  }

  async getGameJSON(gameId: string, signer: wallet.Account): Promise<any> {
    return TurnBasedAPI.getGameJSON(this.node.url, this.networkMagic, this.scriptHash, gameId, signer)
  }

  async joinGame(tokenId: string, signer: wallet.Account): Promise<string> {
    return TurnBasedAPI.joinGame(this.node.url, this.networkMagic, this.scriptHash, tokenId, signer)
  }

  async fight(gameId: string, tokenId: string, attribute: string, signer: wallet.Account): Promise<number | string> {
    return TurnBasedAPI.fight(this.node.url, this.networkMagic, this.scriptHash, gameId, tokenId, attribute, signer)
  }

}
