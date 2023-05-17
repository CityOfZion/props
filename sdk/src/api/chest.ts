import {sc} from "@cityofzion/neon-js";
import {u, wallet} from "@cityofzion/neon-core";
import {formatter, variableInvoke} from "../helpers";
import {EligibilityCase, EligibilityAttribute} from "../interface";

export class ChestAPI {

  static async createChest(
    node: string,
    networkMagic: number,
    contractHash: string,
    name: string,
    chestType: number,
    eligibilityCases: EligibilityCase[],
    signer: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<number> {
    const method = "create_chest";

    const cases = eligibilityCases.map( (eligibilityCase: EligibilityCase) => {

      const attributes = eligibilityCase.attributes.map( (attr: EligibilityAttribute) => {
        let value = sc.ContractParam.byteArray('')
        switch (typeof attr.value) {
          case typeof "a":
            value = sc.ContractParam.string(attr.value)
            break
          case typeof 1:
            value = sc.ContractParam.integer(attr.value)
        }
        return sc.ContractParam.array(
            sc.ContractParam.string(attr.logic),
            sc.ContractParam.string(attr.key),
            value
        )
      })
      return sc.ContractParam.array(
          sc.ContractParam.hash160(eligibilityCase.scriptHash),
          sc.ContractParam.array(...attributes)
      )
    })

    const param = [
      sc.ContractParam.string(name),
      sc.ContractParam.integer(chestType),
      sc.ContractParam.array(...cases),
    ];
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  static async isEligible(
      node: string,
      networkMagic: number,
      contractHash: string,
      chestId: number,
      nftSriptHash: string,
      tokenId: string,
      signer?: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<boolean> {
    const method = "is_eligible";
    const param = [
      sc.ContractParam.integer(chestId),
      sc.ContractParam.hash160(nftSriptHash),
      sc.ContractParam.string(tokenId)
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  //TODO - Verify
  static async lootChest(
      node: string,
      networkMagic: number,
      contractHash: string,
      chestId: number,
      nftScriptHash: string,
      tokenId: string,
      signer: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "loot_chest";

    const param = [
      sc.ContractParam.integer(chestId),
      sc.ContractParam.hash160(nftScriptHash),
      sc.ContractParam.string(tokenId)
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  //TODO - Verify
  static async lootChestAsOwner(
    node: string,
    networkMagic: number,
    contractHash: string,
    chestId: number,
    signer: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "loot_chest_as_owner";

    const param = [
      sc.ContractParam.integer(chestId),
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
    chestId: number,
    signer?: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "get_chest_json";

    const param = [
      sc.ContractParam.integer(chestId),
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    let formattedRes = formatter(res[0])
    const author = u.reverseHex(u.str2hexstring(formattedRes.author))
    formattedRes.author = new wallet.Account(author)
    return formattedRes
  }

  static async totalChests(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<number> {
    const method = "total_chests";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

}