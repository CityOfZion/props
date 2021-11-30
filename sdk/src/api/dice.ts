import {sc} from "@cityofzion/neon-js";
import {NeoInterface} from "./interface";

export class DiceAPI {

  static async rollDie(
    node: string,
    networkMagic: number,
    contractHash: string,
    die: string
  ): Promise<number> {
    const method = "roll_die";
    const param = [
      sc.ContractParam.string(die)
    ]
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      param
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return parseInt(res[0].value as string);
  }

  static async rollDiceWithEntropy(
    node: string,
    networkMagic: number,
    contractHash: string,
    die: string,
    precision: number,
    entropy: string
  ): Promise<number> {
    const method = "roll_dice_with_entropy";
    const param = [
      sc.ContractParam.string(die),
      sc.ContractParam.integer(precision),
      sc.ContractParam.string(entropy)
    ]
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      param
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return parseInt(res[0].value as string);
  }

  static async rollInitialStat(
    node: string,
    networkMagic: number,
    contractHash: string,
  ): Promise<any> {
    const method = "roll_initial_stat";
    try {
      const res = await NeoInterface.testInvoke(
        node,
        networkMagic,
        contractHash,
        method,
        [],
      );
      if (res === undefined || res.length === 0) {
        throw new Error("unrecognized response");
      }
      return res[0].value as number;
    } catch (e) {
      console.log(e)
      return
    }
  }

  static async rollInitialStatWithEntropy(
    node: string,
    networkMagic: number,
    contractHash: string,
    entropy: string
  ): Promise<any> {
    const method = "roll_initial_stat";
    const param = [
      sc.ContractParam.string(entropy)
    ]
    try {
      const res = await NeoInterface.testInvoke(
        node,
        networkMagic,
        contractHash,
        method,
        param
      );
      if (res === undefined || res.length === 0) {
        throw new Error("unrecognized response");
      }
      return res;
    } catch (e) {
      console.log(e)
      return
    }
  }
}