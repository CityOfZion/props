import {InteropInterface} from "./interface";
import Neon, { sc, u } from "@cityofzion/neon-js";
import { wallet } from "@cityofzion/neon-core";
import {StackItemJson, StackItemMapLike} from "@cityofzion/neon-core/lib/sc";
import {EpochType, PuppetType} from "../interface";
import {formatter, parseToJSON, variableInvoke} from "../helpers";

export class PuppetAPI {

  /**
   * Returns the balance of an account
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param address
   * @param signer
   */
  static async balanceOf(
    node: string,
    networkMagic: number,
    contractHash: string,
    address: string,
    signer?: wallet.Account
  ): Promise<number> {
    const method = "balanceOf";

    const params = [sc.ContractParam.hash160(address)];
    const res = await variableInvoke(node, networkMagic, contractHash, method, params, signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  static async createEpoch(
    node: string,
    networkMagic: number,
    contractHash: string,
    generatorInstanceId: number,
    mintFee: number,
    sysFee: number,
    maxSupply: number,
    signer: wallet.Account,
  ): Promise<string> {
    const method = "create_epoch";
    const params = [
      sc.ContractParam.integer(generatorInstanceId),
      sc.ContractParam.integer(mintFee),
      sc.ContractParam.integer(sysFee),
      sc.ContractParam.integer(maxSupply)
    ];
    return await variableInvoke(node, networkMagic, contractHash, method, params, signer)
  }

  /**
   * Returns the decimals of the token
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param signer
   */
  static async decimals(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<number> {
    const method = "decimals";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  /**
   * Initializes the smart contract on first deployment (REQUIRED)
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param signer The signing account, which will become the first admin if upgrade == false
   */
  static async deploy(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer: wallet.Account
  ): Promise<string> {
    const method = "deploy";

    return await variableInvoke(node, networkMagic, contractHash, method, [], signer)
  }

  static async getAttributeMod(
    node: string,
    networkMagic: number,
    contractHash: string,
    attributeValue: number,
    signer?: wallet.Account
  ): Promise<number | string> {
    const method = "roll_initial_stat";
    const params = [
      sc.ContractParam.integer(attributeValue)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, params, signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  static async getPuppetJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: string,
    signer?: wallet.Account
  ): Promise<PuppetType | string> {
    const method = "get_epoch_json";
    const param = [sc.ContractParam.string(tokenId)];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }

    return parseToJSON(res[0].value) as PuppetType
  }

  static async getPuppetRaw(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: string,
    signer?: wallet.Account
  ): Promise<string> {
    const method = "get_puppet_raw";

    const params = [sc.ContractParam.string(tokenId)];
    const res = await variableInvoke(node, networkMagic, contractHash, method, params, signer)
    if (signer) {
      return res
    }
    return res[0].value;
  }

  /**
   * Gets the owner account of a tokenId
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param tokenId The tokenId to return the owner of
   * @param signer
   */
  static async ownerOf(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: string,
    signer?: wallet.Account
  ): Promise<wallet.Account | string> {
    const method = "ownerOf";

    const params = [sc.ContractParam.string(tokenId)];
    const res = await variableInvoke(node, networkMagic, contractHash, method, params, signer)
    if (signer) {
      return res
    }
    const rawValue = u.base642hex(res[0].value as string)
    return new wallet.Account(u.reverseHex(rawValue))
  }

  static async offlineMint(
    node: string,
    networkMagic: number,
    contractHash: string,
    epochId: number,
    owner: string,
    signer: wallet.Account
  ): Promise<string> {

    const method = "offline_mint";
    const params = [
      sc.ContractParam.integer(epochId),
      sc.ContractParam.hash160(owner)
    ]
    return await variableInvoke(node, networkMagic, contractHash, method, params, signer)
  }

  /**
   * Gets the properties of a token
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param tokenId The tokenId of the token being requested
   * @param signer An optional signer.  Populating this value will publish a transaction and return a txid
   */
  static async properties(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: string,
    signer?: wallet.Account
  ): Promise<PuppetType | string> {
    const method = "properties";
    const params = [sc.ContractParam.string(tokenId)];
    const res = await variableInvoke(node, networkMagic, contractHash, method, params, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  static async setMintFee(
    node: string,
    networkMagic: number,
    contractHash: string,
    epochId: number,
    fee: number,
    signer: wallet.Account,
  ): Promise<string> {
    const method = "set_mint_fee";
    const params = [
      sc.ContractParam.integer(epochId),
      sc.ContractParam.integer(fee)
    ];

    return await variableInvoke(node, networkMagic, contractHash, method, params, signer)
  }

  /**
   * Returns the token symbol
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param signer
   */
  static async symbol(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<string> {
    const method = "symbol";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return Neon.u.HexString.fromBase64(res[0].value as string).toAscii();
  }

  /**
   * Gets and array of strings(tokenIds) representing all the tokens associated with the contract
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param signer
   */
  static async tokens(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<number[] | string> {
    const method = "tokens";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }

    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    const iterator: InteropInterface = res[0] as InteropInterface
    if (iterator.iterator && iterator.iterator.length > 0 && iterator.iterator[0].value) {
      return iterator.iterator.map( (token: StackItemJson) => {
        const attrs: StackItemJson[] = token.value as StackItemJson[]
        let bytes = u.base642hex((attrs[0].value as string))
        return parseInt(u.reverseHex(bytes),16)

      })
    }
    if (iterator.iterator && iterator.iterator.length === 0) {
      return []
    }

    throw new Error("unable to resolve respond format")
  }

  /**
   * Gets an array of strings(tokenId) owned by an address
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param address The string formatted address of an account
   * @param signer
   */
  static async tokensOf(
    node: string,
    networkMagic: number,
    contractHash: string,
    address: string,
    signer?: wallet.Account
  ): Promise<string[] | string> {
    const method = "tokensOf";

    const params = [sc.ContractParam.hash160(address)];
    const res = await variableInvoke(node, networkMagic, contractHash, method, params, signer)
    if (signer) {
      return res
    }
    const iterator: InteropInterface = res[0] as InteropInterface
    if (iterator.iterator && iterator.iterator.length >= 0) {
      return iterator.iterator.map( (token: StackItemJson) => {
        const attrs: StackItemJson[] = token.value as StackItemJson[]
        return formatter(attrs[1])
      })
    }


    throw new Error("unable to resolve respond format")


  }

  /**
   * Gets the total number of accounts stored in the contract
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param signer
   */
  static async totalAccounts(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<number | string> {
    const method = "total_accounts";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  static async totalEpochs(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<number | string> {
    const method = "total_epochs";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  /**
   * Returns the total supply of the token
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param signer
   */
  static async totalSupply(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<number | string> {
    const method = "totalSupply";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  /**
   * Transfers a token to another account
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param toAddress
   * @param tokenId
   * @param signer
   * @param data
   */
  static async transfer(
    node: string,
    networkMagic: number,
    contractHash: string,
    toAddress: string,
    tokenId: string,
    signer: wallet.Account,
    data?: any
  ): Promise<string> {
    const method = "transfer";
    const params = [
      sc.ContractParam.hash160(toAddress),
      sc.ContractParam.string(tokenId),
      data,
    ];

    return await variableInvoke(node, networkMagic, contractHash, method, params, signer)
  }

  static async update(
    node: string,
    networkMagic: number,
    contractHash: string,
    script: string,
    manifest: string,
    data: any,
    signer: wallet.Account
  ): Promise<string> {
    const method = "update";
    const params = [
      sc.ContractParam.byteArray(script),
      sc.ContractParam.string(manifest),
      sc.ContractParam.any(data)
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, params, signer)
    if (signer) {
      return res
    }
    return formatter(res);
  }


  //setUserPermissions

  static async getEpochJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    epochId: number,
    signer?: wallet.Account
  ): Promise<EpochType | string> {
    const method = "get_epoch_json";
    const param = [sc.ContractParam.integer(epochId)];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }

    return parseToJSON(res[0].value) as EpochType
  }

}
