import {sc} from "@cityofzion/neon-js";
import {wallet} from "@cityofzion/neon-core";
import {formatter, variableInvoke} from "../helpers";

export class ChestAPI {

  static async createChest(
    node: string,
    networkMagic: number,
    contractHash: string,
    name: string,
    type: number,
    eligibleEpochs: [number],
    puppetTraits: any,
    signer: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "create_chest";

    const epochs = eligibleEpochs.map( (value) => {
      return sc.ContractParam.integer(value)
    })

    const traits = Object.keys(puppetTraits).map( (key) => {
      return sc.ContractParam.array(
        sc.ContractParam.string(key),
        sc.ContractParam.string(puppetTraits[key])
      )
    })
    const param = [
      sc.ContractParam.string(name),
      sc.ContractParam.integer(type),
      sc.ContractParam.array(...epochs),
      sc.ContractParam.array(...traits)
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  static async isPuppetEligible(
    node: string,
    networkMagic: number,
    contractHash: string,
    chestId: string,
    puppetId: string,
    signer?: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "is_puppet_eligible";

    const param = [
      sc.ContractParam.string(chestId),
      sc.ContractParam.string(puppetId),
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  static async lootChestWithPuppet(
    node: string,
    networkMagic: number,
    contractHash: string,
    chestId: string,
    puppetId: string,
    signer: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "loot_chest_with_puppet";

    const param = [
      sc.ContractParam.string(chestId),
      sc.ContractParam.string(puppetId),
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  static async lootChestAsOwner(
    node: string,
    networkMagic: number,
    contractHash: string,
    chestId: string,
    signer: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "loot_chest_as_owner";

    const param = [
      sc.ContractParam.string(chestId),
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  static async getChestJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    chestId: string,
    signer?: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "get_chest_json";

    const param = [
      sc.ContractParam.string(chestId),
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  static async totalChests(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "total_chests";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

}