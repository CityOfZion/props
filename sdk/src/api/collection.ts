import {sc, u} from "@cityofzion/neon-js";
import {NeoInterface} from "./interface";
import {wallet} from "@cityofzion/neon-core";
import {CollectionType} from "../interface";
import {StackItemJson, StackItemMapLike} from "@cityofzion/neon-core/lib/sc";
import {ContractParamLike} from "@cityofzion/neon-core/lib/sc/ContractParam";

export class CollectionAPI {


  static async totalCollections(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<number> {
    const method = "total_collections";

    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      []
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return parseInt(res[0].value as string);
  }

  static async createCollection(
    node: string,
    networkMagic: number,
    contractHash: string,
    description: string,
    collection_type: string,
    extra: any,
    values: string[],
    signer: wallet.Account,
  ): Promise<any> {
    const method = "create_collection";

    const raw_traits = values.map( (value) => {
      return sc.ContractParam.string(value)
    })

    const params = [
      sc.ContractParam.string(description),
      sc.ContractParam.string(collection_type),
      sc.ContractParam.string(extra),
      sc.ContractParam.array(...raw_traits)
    ];

    return await NeoInterface.publishInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params,
      signer
    );
  }

  static async getCollectionElement(
    node: string,
    networkMagic: number,
    contractHash: string,
    collectionId: number,
    index: number
  ): Promise<string | undefined> {
    const method = "get_collection_element"
    const param = [
      sc.ContractParam.integer(collectionId),
      sc.ContractParam.integer(index)
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
      return u.base642hex(res[0].value as string)
    } catch(e) {
      console.log(e)
      return
    }
  }

  static async getCollection(
    node: string,
    networkMagic: number,
    contractHash: string,
    collectionId: number
  ): Promise<string | undefined> {
    const method = "get_collection"
    const param = [
      sc.ContractParam.integer(collectionId)
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

      if (res[0] && res[0].value) {
        return u.base642hex(res[0].value as string)
      }
  } catch(e) {
      console.log(e)
      return
    }
}

  static async getCollectionJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    collectionId: number
  ): Promise<CollectionType | undefined> {
    const method = "get_collection_json"
    const param = [
      sc.ContractParam.integer(collectionId)
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

      const result: CollectionType = {
        id: 0,
        description: "",
        type: "",
        values: [],
        valuesRaw: []
      }

      if (res[0] && res[0].value) {
        (res[0].value as unknown as StackItemMapLike[]).forEach((entry: StackItemMapLike) => {
          let key = u.hexstring2str(u.base642hex(entry.key.value as string))
          switch (key) {
            case "id":
              let bytes = u.base642hex(entry.value.value as string)
              result.id = parseInt(bytes, 16)
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
          result.values = result.valuesRaw.map( (value) => {
            return u.hexstring2str(u.base642hex(value.value as string))
          })
          break
        case "number":
          result.values = result.valuesRaw.map( (value) => {
            let bytes = u.base642hex(value as string)
            return parseInt(bytes, 16)
          })
          break
      }

      return result;
    } catch(e){
      console.log(e)
      return
    }
  }
}