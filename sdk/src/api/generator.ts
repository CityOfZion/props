import {sc} from "@cityofzion/neon-js";
import {wallet} from "@cityofzion/neon-core";
import {EventCollectionPointer, EventContractCall, GeneratorType, EventTypeEnum, EventTypeWrapper, TraitLevel, TraitType} from "../interface";
import {formatter, parseToJSON, variableInvoke} from "../helpers";

export class GeneratorAPI {

  static async createGenerator(
    node: string,
    networkMagic: number,
    contractHash: string,
    label: string,
    baseGeneratorFee: number,
    signer: wallet.Account
  ): Promise<string> {
    const method = "create_generator";

    const param = [
      sc.ContractParam.string(label),
      sc.ContractParam.integer(baseGeneratorFee)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }

  static async createInstance(
    node: string,
    networkMagic: number,
    contractHash: string,
    generatorId: number,
    signer: wallet.Account
  ): Promise<string> {
    const method = "create_instance";

    const param = [
      sc.ContractParam.integer(generatorId)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }

  static async createTrait(
    node: string,
    networkMagic: number,
    contractHash: string,
    generatorId: number,
    label: string,
    slots: number,
    levels: TraitLevel[],
    signer: wallet.Account
  ): Promise<string> {
    const method = "create_trait";

    const traitLevelsFormatted = levels.map((traitLevel: TraitLevel ) => {
      const traitPointers = traitLevel.traits.map((traitEvent: EventTypeWrapper ) => {

        switch (traitEvent.type) {
          case EventTypeEnum.CollectionPointer:
            const collectionPointer: EventCollectionPointer = traitEvent.args as EventCollectionPointer
            return sc.ContractParam.array(
              sc.ContractParam.integer(traitEvent.type),
              sc.ContractParam.integer(traitEvent.maxMint),
              sc.ContractParam.array(
                sc.ContractParam.integer(collectionPointer.collectionId),
                sc.ContractParam.integer(collectionPointer.index)
              ))
          case EventTypeEnum.ContractCall:
            const contractCall: EventContractCall = traitEvent.args as EventContractCall
            return sc.ContractParam.array(
              sc.ContractParam.integer(traitEvent.type),
              sc.ContractParam.integer(traitEvent.maxMint),
              sc.ContractParam.array(
                sc.ContractParam.hash160(contractCall.scriptHash),
                sc.ContractParam.string(contractCall.method),
                sc.ContractParam.array(...contractCall.param)
              )
            )

          default:
            throw new Error("unrecognized trait event type")
        }
      })

      return sc.ContractParam.array(
        sc.ContractParam.integer(traitLevel.dropScore),
        sc.ContractParam.integer(traitLevel.mintMode),
        sc.ContractParam.array(...traitPointers)
      )
    })

    const param = [
      sc.ContractParam.integer(generatorId),
      sc.ContractParam.string(label),
      sc.ContractParam.integer(slots),
      sc.ContractParam.array(...traitLevelsFormatted)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }

  //getGenerator

  static async getGeneratorJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    generatorId: number,
    signer?: wallet.Account
  ): Promise<GeneratorType | string> {
    const method = "get_generator_json";

    const param = [
      sc.ContractParam.integer(generatorId)
    ]

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0]) as GeneratorType
  }

  static async getTraitJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    traitId: string,
    signer?: wallet.Account
  ): Promise<TraitType | string> {
    const method = "get_trait_json";

    const param = [
      sc.ContractParam.string(traitId)
    ]

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return parseToJSON(res[0].value) as TraitType
  }

  //getGeneratorInstance

  static async getGeneratorInstanceJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    instanceId: number,
    signer?: wallet.Account
  ): Promise<any> {
    const method = "get_generator_instance_json";

    const param = [
      sc.ContractParam.integer(instanceId)
    ]

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
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
      sc.ContractParam.integer(instanceId),
      sc.ContractParam.array(...usersFormatted)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }

  static async setInstanceFee(
    node: string,
    networkMagic: number,
    contractHash: string,
    instanceId: number,
    fee: number,
    signer: wallet.Account
  ): Promise<string> {
    const method = "set_instance_fee";

    const param = [
      sc.ContractParam.integer(instanceId),
      sc.ContractParam.integer(fee)
    ]

    return await variableInvoke(node, networkMagic, contractHash, method, param, signer)
  }

  static async totalGenerators(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<number | string> {
    const method = "total_generators";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  static async totalGeneratorInstances(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<number | string> {
    const method = "total_generator_instances";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }
}
