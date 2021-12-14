import {NeoInterface} from "./interface";
import {sc} from "@cityofzion/neon-js";
import { wallet } from "@cityofzion/neon-core";
import {CollectionPointer, EpochType, TraitLevel, TraitType} from "../interface";
import {parseToJSON, variableInvoke} from "../helpers";

export class EpochAPI {

  static async totalEpochs(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<number> {
    const method = "total_epochs";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  static async createEpoch(
    node: string,
    networkMagic: number,
    contractHash: string,
    label: string,
    traits: TraitType[],
    signer: wallet.Account
  ): Promise<any> {
    const method = "create_epoch";

    const traitsFormatted = traits.map( (trait) => {
      const traitLevelsFormatted = trait.traitLevels.map((traitLevel) => {
        const traitPointers = traitLevel.traits.map((pointer: CollectionPointer) => {
          return sc.ContractParam.array(
            sc.ContractParam.integer(pointer.collectionId),
            sc.ContractParam.integer(pointer.index)
          )
        })

        return sc.ContractParam.array(
          sc.ContractParam.integer(traitLevel.dropScore),
          sc.ContractParam.boolean(traitLevel.unique),
          sc.ContractParam.array(...traitPointers)
        )
      })

      return sc.ContractParam.array(
        sc.ContractParam.string(trait.label),
        sc.ContractParam.integer(trait.slots),
        sc.ContractParam.array(...traitLevelsFormatted)
      )
    })

    const param = [
      sc.ContractParam.string(label),
      sc.ContractParam.array(...traitsFormatted)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }

  static async getEpochJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    epochId: number,
    signer?: wallet.Account
  ): Promise<any> {
    const method = "get_epoch_json";

    const param = [
      sc.ContractParam.integer(epochId)
    ]

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return parseToJSON(res[0].value) as EpochType
  }

  //get_epoch

  static async mintFromEpoch(
    node: string,
    networkMagic: number,
    contractHash: string,
    epochId: number,
    signer: wallet.Account
  ): Promise<any> {
    const method = "mint_from_epoch";

    const param = [
      sc.ContractParam.integer(epochId)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }
}
