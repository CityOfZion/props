import {InteropInterface, NeoInterface} from "./interface";
import Neon, { sc, u } from "@cityofzion/neon-js";
import { wallet } from "@cityofzion/neon-core";
import {StackItemJson} from "@cityofzion/neon-core/lib/sc";

export class Nep11 {

  /**
   * Returns the token symbol
   * @param node
   * @param networkMagic
   * @param contractHash
   */
  static async symbol(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<string> {
    const method = "symbol";

    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      []
    );
    if (res === undefined) {
      throw new Error("unrecognized response");
    }
    return Neon.u.HexString.fromBase64(res[0].value as string).toAscii();
  }

  /**
   * Returns the decimals of the token
   * @param node
   * @param networkMagic
   * @param contractHash
   */
  static async decimals(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<number> {
    const method = "decimals";

    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      []
    );
    if (res === undefined) {
      throw new Error("unrecognized response");
    }
    return parseInt(res[0].value as string);
  }

  /**
   * Returns the total supply of the token
   * @param node
   * @param networkMagic
   * @param contractHash
   */
  static async totalSupply(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<number> {
    const method = "totalSupply";

    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      []
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return parseInt(res[0].value as string);
  }

  /**
   * Returns the balance of an account
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param address
   */
  static async balanceOf(
    node: string,
    networkMagic: number,
    contractHash: string,
    address: string
  ): Promise<number> {
    const method = "balanceOf";

    const params = [sc.ContractParam.hash160(address)];
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return parseInt(res[0].value as string);
  }

  // TODO - finalize return type
  /**
   * Gets an array of strings(tokenId) owned by an address
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param address The string formatted address of an account
   */
  static async tokensOf(
    node: string,
    networkMagic: number,
    contractHash: string,
    address: string
  ): Promise<string[]> {
    const method = "tokensOf";

    const params = [sc.ContractParam.hash160(address)];
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }

    const iterator: InteropInterface = res[0] as InteropInterface
    if (iterator.iterator && iterator.iterator.length >= 0 && iterator.iterator![0].value) {
      const tokens: string[] = iterator.iterator.map( (token: StackItemJson) => {
          const attrs: StackItemJson[] = token.value as StackItemJson[]
          return u.HexString.fromBase64(attrs[1].value as string).toString() as string
      })
      return tokens
    }
    throw new Error("unable to resolve respond format")
  }

  // TODO - change to NEP11
  /*
  static async transfer(
    node: string,
    networkMagic: number,
    contractHash: string,
    fromAddress: string,
    toAddress: string,
    amount: number,
    account: wallet.Account,
    data?: any
  ): Promise<any> {
    const method = "transfer";
    const params = [
      sc.ContractParam.hash160(fromAddress),
      sc.ContractParam.hash160(toAddress),
      amount,
      data,
    ];

    return await NeoInterface.publishInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params,
      account
    );
  }
   */

  /**
   * Gets the owner account of a tokenId
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param tokenId The tokenId to return the owner of
   */
  static async ownerOf(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: string
  ): Promise<string> {
    const method = "ownerOf";

    const params = [sc.ContractParam.string(tokenId)];
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params
    );

    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return res[0].value as string;
  }

  /**
   * Gets and array of strings(tokenIds) representing all the tokens associated with the contract
   * @param node
   * @param networkMagic
   * @param contractHash
   */
  static async tokens(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<string[]> {
    const method = "tokens";

    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      []
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    const iterator: InteropInterface = res[0] as InteropInterface
    if (iterator.iterator && iterator.iterator.length >= 0 && iterator.iterator![0].value) {
      const tokens: string[] = iterator.iterator.map( (token: StackItemJson) => {
        const attrs: StackItemJson[] = token.value as StackItemJson[]
        return u.HexString.fromBase64(attrs[0].value as string).toString() as string
      })
      return tokens
    }
    throw new Error("unable to resolve respond format")
  }

  /**
   * Gets the properties of a token
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param tokenId The tokenId of the token being requested
   */
  static async properties(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: string
  ): Promise<any> {
    const method = "tokens";

    const params = [sc.ContractParam.string(tokenId)];
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return res[0].value;
  }

  /*
  static async propertiesJson() {}
  */

  /**
   * Initializes the smart contract on first deployment (REQUIRED)
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param data A pass through variable that is currently not used
   * @param upgrade Indicates whether the deployment is an upgrade
   * @param account The signing account, which will become the first admin if upgrade == false
   */
  static async deploy(
    node: string,
    networkMagic: number,
    contractHash: string,
    data: object, //we arent using this...
    upgrade: boolean,
    account: wallet.Account
  ): Promise<any> {
    const method = "deploy";
    const params = [
      sc.ContractParam.hash160(account.address),
      sc.ContractParam.boolean(upgrade),
    ];

    return await NeoInterface.publishInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params,
      account
    );
  }

  /*
  static async onNEP11Payment() {}

  static async onNEP17Payment() {}

  static async burn() {}
  */

  /**
   * Creates a new NEP11 token on the contract
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param address The address to mint to.
   * @param meta The meta data for the token (properties)
   * @param royalties Are there royalties?
   * @param data: mint-required data payload
   * @param account The signing account
   */
  static async mint(
    node: string,
    networkMagic: number,
    contractHash: string,
    address: string,
    meta: string,
    royalties: string,
    data: any,
    account: wallet.Account
  ): Promise<string | undefined> {
    const method = "mint";
    const params = [
      sc.ContractParam.hash160(address),
      sc.ContractParam.string(meta),
      sc.ContractParam.string(royalties),
      sc.ContractParam.string(data),
    ];

    return await NeoInterface.publishInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params,
      account
    );
  }

  /*
  static async getRoyalties() {}

  static async getAuthorizedAddress() {}

  static async setAuthorizedAddress() {}

  static async updatePause() {}

  static async isPaused() {}

  static async verify() {}

  static async update() {}

  static async destroy() {}
   */
}
