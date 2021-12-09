import {sc} from "@cityofzion/neon-js";
import {wallet} from "@cityofzion/neon-core";
import {NeoInterface} from "./interface";
import {variableInvoke} from "../helpers";

export class DiceAPI {

  static async rollDie(
    node: string,
    networkMagic: number,
    contractHash: string,
    die: string,
    signer?: wallet.Account
  ): Promise<number | string> {
    const method = "roll_die";
    const param = [
      sc.ContractParam.string(die)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  static async rollDiceWithEntropy(
    node: string,
    networkMagic: number,
    contractHash: string,
    die: string,
    precision: number,
    entropy: string,
    signer?: wallet.Account
  ): Promise<number[] | string> {
    const method = "roll_dice_with_entropy";
    const param = [
      sc.ContractParam.string(die),
      sc.ContractParam.integer(precision),
      sc.ContractParam.string(entropy)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return [parseInt(res[0].value as string)];
  }

  static async randBetween(
    node: string,
    networkMagic: number,
    contractHash: string,
    start: number,
    end: number,
    signer?: wallet.Account
  ): Promise<number | string> {
    const method = "rand_between";
    const param = [
      sc.ContractParam.integer(start),
      sc.ContractParam.integer(end)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  static async mapBytesOntoRange(
    node: string,
    networkMagic: number,
    contractHash: string,
    start: number,
    end: number,
    entropy: string,
    signer?: wallet.Account
  ): Promise<number | string> {
    const method = "map_bytes_onto_range";
    const param = [
      sc.ContractParam.integer(start),
      sc.ContractParam.integer(end),
      sc.ContractParam.string(entropy)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }
}