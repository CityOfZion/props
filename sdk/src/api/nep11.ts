import { NeoInterface } from "../interface";
import Neon, {sc, u} from "@cityofzion/neon-js";
import {wallet} from "@cityofzion/neon-core";

export class Nep11 {
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

  static async balanceOf(
    node: string,
    networkMagic: number,
    contractHash: string,
    address: string
  ): Promise<number> {
    const method = "totalSupply";

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

  static async tokensOf() {}

  static async transfer(node: string, networkMagic: number, contractHash: string, fromAddress: string, toAddress: string, amount: number, account: wallet.Account, data?: any): Promise<any> {
    const method = "transfer"
    const params = [
      sc.ContractParam.hash160(fromAddress),
      sc.ContractParam.hash160(toAddress),
      amount,
      data
    ]

    return await NeoInterface.publishInvoke(node, networkMagic, contractHash, method, params, account )
  }

  static async ownerOf() {}

  static async tokens() {}

  static async properties() {}

  static async propertiesJson() {}

  static async _deploy() {}

  static async onNEP11Payment() {}

  static async onNEP17Payment() {}

  static async burn() {}

  static async mint() {}

  static async getRoyalties() {}

  static async getAuthorizedAddress() {}

  static async setAuthorizedAddress() {}

  static async updatePause() {}

  static async isPaused() {}

  static async verify() {}

  static async update() {}

  static async destroy() {}
}
