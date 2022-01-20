import {sc} from "@cityofzion/neon-js";
import {wallet} from "@cityofzion/neon-core";
import {EpochType, EventTypeEnum, EventTypeWrapper, TraitLevel, TraitType} from "../interface";
import {parseToJSON, variableInvoke} from "../helpers";
import {CollectionPointer} from "../interface/interface";

export class EpochAPI {

  static async createEpoch(
    node: string,
    networkMagic: number,
    contractHash: string,
    label: string,
    signer: wallet.Account
  ): Promise<string> {
    const method = "create_epoch";

    const param = [
      sc.ContractParam.string(label)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }

  static async createInstance(
    node: string,
    networkMagic: number,
    contractHash: string,
    epochId: number,
    signer: wallet.Account
  ): Promise<string> {
    const method = "create_instance";

    const param = [
      sc.ContractParam.integer(epochId)
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
  ): Promise<string> {
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
              sc.ContractParam.integer(traitEvent.maxMint),
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

  //getEpoch

  static async getEpochJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    epochId: number,
    signer?: wallet.Account
  ): Promise<EpochType | string> {
    const method = "get_epoch_json";

    const param = [
      sc.ContractParam.integer(epochId)
    ]

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    console.log(JSON.stringify(res[0].value))
    return parseToJSON(res[0].value) as EpochType
  }

  //getEpochInstance

  static async getEpochInstanceJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    instanceId: number,
    signer?: wallet.Account
  ): Promise<any> {
    const method = "get_epoch_instance_json";

    const param = [
      sc.ContractParam.integer(instanceId)
    ]

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return parseToJSON(res[0].value)
  }

  static async mintFromEpoch(
    node: string,
    networkMagic: number,
    contractHash: string,
    epochId: number,
    signer: wallet.Account
  ): Promise<string> {
    const method = "mint_from_epoch";

    const param = [
      sc.ContractParam.integer(epochId)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }

  static async mintFromInstance(
    node: string,
    networkMagic: number,
    contractHash: string,
    instanceId: number,
    signer: wallet.Account
  ): Promise<string> {
    const method = "mint_from_instance";

    const param = [
      sc.ContractParam.integer(instanceId)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }

  static async setInstanceAuthorizedUsers(
    node: string,
    networkMagic: number,
    contractHash: string,
    instanceId: number,
    authorizedUsers: string[],
    signer: wallet.Account
  ): Promise<string> {
    const method = "set_instance_authorized_users";

    const usersFormatted = authorizedUsers.map((user: string ) => {
      return sc.ContractParam.hash160(user)
    })

    const param = [
      sc.ContractParam.array(...usersFormatted)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
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

  static async totalEpochInstances(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<number | string> {
    const method = "total_epoch_instances";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }
}
