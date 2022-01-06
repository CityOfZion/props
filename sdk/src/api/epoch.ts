import {sc} from "@cityofzion/neon-js";
import {wallet} from "@cityofzion/neon-core";
import {EpochType, EventTypeEnum, EventTypeWrapper, TraitLevel, TraitType} from "../interface";
import {parseToJSON, variableInvoke} from "../helpers";
import {CollectionPointer} from "../interface/interface";

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
    whiteList: string[],
    signer: wallet.Account
  ): Promise<any> {
    const method = "create_epoch";

    const formattedWhitelist = whiteList.map( entry => sc.ContractParam.hash160(entry))

    const param = [
      sc.ContractParam.string(label),
      sc.ContractParam.array(...formattedWhitelist)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }

  static async createTrait(
    node: string,
    networkMagic: number,
    contractHash: string,
    epochId: number,
    label: string,
    slots: number,
    levels: TraitLevel[],
    signer: wallet.Account
  ): Promise<any> {
    const method = "create_trait";

    const traitLevelsFormatted = levels.map((traitLevel: TraitLevel ) => {
      const traitPointers = traitLevel.traits.map((traitEvent: EventTypeWrapper ) => {

        //need to also have the type in here
        switch (traitEvent.type) {
          case EventTypeEnum.CollectionPointer:
            const args: CollectionPointer = traitEvent.args as CollectionPointer
            //console.log(traitEvent.type, args.collectionId, args.index)
            return sc.ContractParam.array(
              sc.ContractParam.integer(traitEvent.type),
              sc.ContractParam.array(
                sc.ContractParam.integer(args.collectionId),
                sc.ContractParam.integer(args.index)
              ))
          default:
            throw new Error("unrecognized trait event type")
        }
      })

      return sc.ContractParam.array(
        sc.ContractParam.integer(traitLevel.dropScore),
        sc.ContractParam.boolean(traitLevel.unique),
        sc.ContractParam.array(...traitPointers)
      )
    })

    const param = [
      sc.ContractParam.integer(epochId),
      sc.ContractParam.string(label),
      sc.ContractParam.integer(slots),
      sc.ContractParam.array(...traitLevelsFormatted)
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
