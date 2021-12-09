import {NeoInterface} from "./interface";
import {sc} from "@cityofzion/neon-js";
import { wallet } from "@cityofzion/neon-core";
import {CollectionPointer, EpochType, TraitLevel} from "../interface";
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
    maxTraits: number,
    traits: TraitLevel[],
    signer: wallet.Account
  ): Promise<any> {
    const method = "create_epoch";

    const traitArray = traits.map( (trait) => {

      const traitPointers = trait.traits.map((pointer: CollectionPointer) => {
        return sc.ContractParam.array(
          sc.ContractParam.integer(pointer.collection_id),
          sc.ContractParam.integer(pointer.index)
        )
      })

      return sc.ContractParam.array(
        sc.ContractParam.integer(trait.drop_score),
        sc.ContractParam.boolean(trait.unique),
        sc.ContractParam.array(...traitPointers)
      )
    })

    const param = [
      sc.ContractParam.string(label),
      sc.ContractParam.integer(maxTraits),
      sc.ContractParam.array(...traitArray)
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
