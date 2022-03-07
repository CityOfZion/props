import {sc, u} from "@cityofzion/neon-js";
import {NeoInterface} from "./interface";
import {wallet} from "@cityofzion/neon-core";
import {CollectionType} from "../interface";
import {ContractParamLike, StackItemJson, StackItemMapLike} from "@cityofzion/neon-core/lib/sc";
import {formatter, variableInvoke} from "../helpers";

export class CollectionAPI {

  static async createCollection(
    node: string,
    networkMagic: number,
    contractHash: string,
    description: string,
    collection_type: string,
    extra: any,
    values: string[],
    signer: wallet.Account,
  ): Promise<string> {
    const method = "create_collection";

    const raw_traits = values.map( (value) => {
      return sc.ContractParam.string(value)
    })

    const param = [
      sc.ContractParam.string(description),
      sc.ContractParam.string(collection_type),
      sc.ContractParam.string(extra),
      sc.ContractParam.array(...raw_traits)
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return u.base642hex(res[0].value as string)
  }

  static async createCollectionRaw(
    node: string,
    networkMagic: number,
    contractHash: string,
    description: string,
    collection_type: string,
    extra: any,
    values: ContractParamLike[],
    signer: wallet.Account,
  ): Promise<string> {
    const method = "create_collection";

    const param = [
      sc.ContractParam.string(description),
      sc.ContractParam.string(collection_type),
      sc.ContractParam.string(extra),
      sc.ContractParam.array(...values)
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return u.base642hex(res[0].value as string)
  }

  static async getCollectionJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    collectionId: number,
    signer?: wallet.Account
  ): Promise<CollectionType | string> {
    const method = "get_collection_json"
    const param = [
      sc.ContractParam.integer(collectionId)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }

    const result: CollectionType = {} as CollectionType
    if (res[0] && res[0].value) {
      (res[0].value as unknown as StackItemMapLike[]).forEach((entry: StackItemMapLike) => {
        let key = u.hexstring2str(u.base642hex(entry.key.value as string))
        let bytes
        switch (key) {
          case "id":
            bytes = u.base642hex(entry.value.value as string)
            result.id = parseInt(bytes, 16)
            break
          case "author":
            bytes = u.base642hex(entry.value.value as string)
            result.author = new wallet.Account(bytes)
            break
          case "type":
            result.type = u.hexstring2str(u.base642hex(entry.value.value as string))
            break
          case "description":
            result.description = u.hexstring2str(u.base642hex(entry.value.value as string))
            break
          case "values":
            result.valuesRaw = entry.value.value as StackItemJson[]
            break
        }
      })
    }
    switch (result.type) {
      case "string":
        result.values = result.valuesRaw!.map( (value) => {
          return formatter(value)
        })
        break
      case "int":
        result.values = result.valuesRaw!.map( (value) => {
          let bytes = formatter(value)
          return parseInt(bytes, 16)
        })
        break
    }

    return result;
  }

  static async getCollection(
    node: string,
    networkMagic: number,
    contractHash: string,
    collectionId: number,
    signer?: wallet.Account
  ): Promise<string> {
    const method = "get_collection"
    const param = [
      sc.ContractParam.integer(collectionId)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return u.base642hex(res[0].value as string)
  }

  static async getCollectionElement(
    node: string,
    networkMagic: number,
    contractHash: string,
    collectionId: number,
    index: number,
    signer?: wallet.Account
  ): Promise<string> {
    const method = "get_collection_element"
    const param = [
      sc.ContractParam.integer(collectionId),
      sc.ContractParam.integer(index)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return u.base642hex(res[0].value as string)
  }

  static async getCollectionLength(
    node: string,
    networkMagic: number,
    contractHash: string,
    collectionId: number,
    signer?: wallet.Account
  ): Promise<number> {
    const method = "get_collection_length"
    const param = [
      sc.ContractParam.integer(collectionId)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return parseInt(res[0].value as string);
  }

  static async getCollectionValues(
    node: string,
    networkMagic: number,
    contractHash: string,
    collectionId: number,
    signer?: wallet.Account
  ): Promise<string[] | any> {
    const method = "get_collection_values"
    const param = [
      sc.ContractParam.integer(collectionId)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }

    return res[0].value.map( (value: any) => {
      return u.base642hex(value.value as string)
    })
  }

  static async mapBytesOntoCollection(
    node: string,
    networkMagic: number,
    contractHash: string,
    collectionId: number,
    entropy: string,
    signer?: wallet.Account
  ): Promise<string> {
    const method = "map_bytes_onto_collection"
    const param = [
      sc.ContractParam.integer(collectionId),
      sc.ContractParam.string(entropy)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return u.base642hex(res[0].value as string)
  }

  static async sampleFromCollection(
    node: string,
    networkMagic: number,
    contractHash: string,
    collectionId: number,
    samples: number,
    signer?: wallet.Account
  ): Promise<string> {
    const method = "sample_from_collection"
    const param = [
      sc.ContractParam.integer(collectionId),
      sc.ContractParam.integer(samples)
    ]
    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return u.base642hex(res[0].value as string)
  }

  static async totalCollections(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account
  ): Promise<number> {
    const method = "total_collections";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return parseInt(res[0].value as string);
  }

  static async update(
    node: string,
    networkMagic: number,
    contractHash: string,
    script: string,
    manifest: string,
    data: any,
    signer: wallet.Account
  ): Promise<string> {
    const method = "update";
    const params = [
      sc.ContractParam.byteArray(script),
      sc.ContractParam.string(manifest),
      sc.ContractParam.any(data)
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, params, signer)
    if (signer) {
      return res
    }
    return formatter(res);
  }

}