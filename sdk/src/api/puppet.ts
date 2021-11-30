import {InteropInterface, NeoInterface} from "./interface";
import Neon, { sc, u } from "@cityofzion/neon-js";
import { wallet } from "@cityofzion/neon-core";
import StackItem, {StackItemJson, StackItemMapLike} from "@cityofzion/neon-core/lib/sc";
import {CollectionPointer, CollectionType, PuppetType, Trait} from "../interface";
import {ContractParamJson, ContractParamLike} from "@cityofzion/neon-core/lib/sc/ContractParam";

export class PuppetAPI {

  /**
   * Returns the token symbol
   * @param node
   * @param networkMagic
   * @param contractHash
   */
  static async symbol(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<string> {
    const method = "symbol";

    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      []
    );
    if (res === undefined) {
      throw new Error("unrecognized response");
    }
    return Neon.u.HexString.fromBase64(res[0].value as string).toAscii();
  }

  /**
   * Returns the decimals of the token
   * @param node
   * @param networkMagic
   * @param contractHash
   */
  static async decimals(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<number> {
    const method = "decimals";

    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      []
    );
    if (res === undefined) {
      throw new Error("unrecognized response");
    }
    return parseInt(res[0].value as string);
  }

  /**
   * Returns the total supply of the token
   * @param node
   * @param networkMagic
   * @param contractHash
   */
  static async totalSupply(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<number> {
    const method = "totalSupply";

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

  /**
   * Returns the balance of an account
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param address
   */
  static async balanceOf(
    node: string,
    networkMagic: number,
    contractHash: string,
    address: string
  ): Promise<number> {
    const method = "balanceOf";

    const params = [sc.ContractParam.hash160(address)];
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return parseInt(res[0].value as string);
  }


  /**
   * Gets an array of strings(tokenId) owned by an address
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param address The string formatted address of an account
   */
  static async tokensOf(
    node: string,
    networkMagic: number,
    contractHash: string,
    address: string
  ): Promise<number[]> {
    const method = "tokensOf";

    const params = [sc.ContractParam.hash160(address)];
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }

    const iterator: InteropInterface = res[0] as InteropInterface
    if (iterator.iterator && iterator.iterator.length >= 0) {
      return iterator.iterator.map( (token: StackItemJson) => {
        const attrs: StackItemJson[] = token.value as StackItemJson[]
        let bytes = u.base642hex((attrs[1].value as string))
        return parseInt(u.reverseHex(bytes),16)
      })
    }


    throw new Error("unable to resolve respond format")


  }

  /**
   * Transfers a token to another account
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param toAddress
   * @param tokenId
   * @param signer
   * @param data
   */
  static async transfer(
    node: string,
    networkMagic: number,
    contractHash: string,
    toAddress: string,
    tokenId: number,
    signer: wallet.Account,
    data?: any
  ): Promise<any> {
    const method = "transfer";
    const params = [
      sc.ContractParam.hash160(toAddress),
      sc.ContractParam.integer(tokenId),
      data,
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


  /**
   * Gets the owner account of a tokenId
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param tokenId The tokenId to return the owner of
   */
  static async ownerOf(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: number
  ): Promise<wallet.Account | undefined> {
    const method = "ownerOf";

    const params = [sc.ContractParam.integer(tokenId)];
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params
    );

    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    const rawValue = u.base642hex(res[0].value as string)
    return new wallet.Account(u.reverseHex(rawValue))
  }

  /**
   * Gets and array of strings(tokenIds) representing all the tokens associated with the contract
   * @param node
   * @param networkMagic
   * @param contractHash
   */
  static async tokens(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<number[]> {
    const method = "tokens";

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
    const iterator: InteropInterface = res[0] as InteropInterface
    if (iterator.iterator && iterator.iterator.length >= 0 && iterator.iterator![0].value) {
      return iterator.iterator.map( (token: StackItemJson) => {
        const attrs: StackItemJson[] = token.value as StackItemJson[]
        let bytes = u.base642hex((attrs[0].value as string))
        return parseInt(u.reverseHex(bytes),16)

      })
    }

    if (res[0].type === "Array") {
      const values = res[0].value as StackItemJson[]
      return values.map( (value: StackItemJson) => {
        let bytes = u.base642hex(value.value as string)
        return parseInt(u.reverseHex(bytes),16)
      })
    }

    throw new Error("unable to resolve respond format")
  }

  /**
   * Gets the properties of a token
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param tokenId The tokenId of the token being requested
   */
  static async properties(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: number
  ): Promise<PuppetType | undefined> {
    const method = "properties";
    const params = [sc.ContractParam.integer(tokenId)];
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params
    );

    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }

    const puppet: PuppetType = {
      armorClass: 0,
      attributes: {
        charisma: 0,
        constitution: 0,
        dexterity: 0,
        intelligence: 0,
        strength: 0,
        wisdom: 0,
      },
      hitDie: '',
      name: '',
      owner: new wallet.Account(),
      traits: [],
      tokenId: 0,
      tokenURI: '',
    }

    if (res[0] && res[0].value) {
      (res[0].value as unknown as StackItemMapLike[]).forEach( (entry: StackItemMapLike) => {
        let key = u.hexstring2str(u.base642hex(entry.key.value as string))
        let rawValue
        switch (key) {
          case "armorClass":
            puppet.armorClass = parseInt(entry.value.value as string)
            break
          case "attributes":
            let attrs = entry.value.value as unknown as StackItemMapLike[]
            attrs.forEach( (attrRaw: StackItemMapLike) => {
              let attrKey = u.hexstring2str(u.base642hex(attrRaw.key.value as string))
              switch (attrKey) {
                case "charisma":
                  puppet.attributes.charisma = parseInt(attrRaw.value.value as string)
                  break
                case "constitution":
                  puppet.attributes.constitution = parseInt(attrRaw.value.value as string)
                  break
                case "dexterity":
                  puppet.attributes.dexterity = parseInt(attrRaw.value.value as string)
                  break
                case "intelligence":
                  puppet.attributes.intelligence = parseInt(attrRaw.value.value as string)
                  break
                case "strength":
                  puppet.attributes.strength = parseInt(attrRaw.value.value as string)
                  break
                case "wisdom":
                  puppet.attributes.wisdom = parseInt(attrRaw.value.value as string)
                  break
              }
            })
            break
          case "hitDie":
            puppet.hitDie = u.hexstring2str(u.base642hex(entry.value.value as string))
            break
          case "name":
            puppet.name = u.hexstring2str(u.base642hex(entry.value.value as string))
            break
          case "owner":
            rawValue = u.base642hex(entry.value.value as string)
            puppet.owner = new wallet.Account(u.reverseHex(rawValue))
            break
          case "traits":
            break
          case "tokenId":
            puppet.tokenId = parseInt(entry.value.value as string)
            break
          case "tokenURI":
            puppet.tokenURI = u.hexstring2str(u.base642hex(entry.value.value as string))
            break
          default:
            throw new Error('unrecognized property: ' + key)
        }
      })
    }
    return puppet
  }


  /**
   * Initializes the smart contract on first deployment (REQUIRED)
   * @param node
   * @param networkMagic
   * @param contractHash
   * @param data A pass through variable that is currently not used
   * @param upgrade Indicates whether the deployment is an upgrade
   * @param account The signing account, which will become the first admin if upgrade == false
   */
  static async deploy(
    node: string,
    networkMagic: number,
    contractHash: string,
    data: object, //we arent using this...
    upgrade: boolean,
    account: wallet.Account
  ): Promise<any> {
    const method = "deploy";
    const params = [
      sc.ContractParam.hash160(account.address),
      sc.ContractParam.boolean(upgrade),
    ];

    return await NeoInterface.publishInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params,
      account
    );
  }

  static async offlineMint(
    node: string,
    networkMagic: number,
    contractHash: string,
    owner: string,
    signer: wallet.Account
  ): Promise<any> {
    const method = "offline_mint";
    const params = [
      sc.ContractParam.hash160(owner)
    ]
    try {
      const res = await NeoInterface.publishInvoke(
        node,
        networkMagic,
        contractHash,
        method,
        params,
        signer
      );
      if (res === undefined || res.length === 0) {
        throw new Error("unrecognized response");
      }
      return res;
    } catch(e){
      console.log(e)
      return
    }
  }

  static async update(
    node: string,
    networkMagic: number,
    contractHash: string,
    script: string,
    manifest: string,
    signer: wallet.Account
  ): Promise<any> {
    const method = "update";
    const params = [
      sc.ContractParam.byteArray(script),
      sc.ContractParam.byteArray(manifest)
    ]
    try {
      const res = await NeoInterface.publishInvoke(
        node,
        networkMagic,
        contractHash,
        method,
        params,
        signer
      );
      if (res === undefined || res.length === 0) {
        throw new Error("unrecognized response");
      }
      return res;
    } catch(e){
      console.log(e)
      return
    }
  }


  static async getPuppetRaw(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: string
  ): Promise<any> {
    const method = "get_puppet_raw";

    const params = [sc.ContractParam.string(tokenId)];
    const res = await NeoInterface.testInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      params
    );
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return res[0].value;
  }

  static async getMintFee(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<number> {
    const method = "get_mint_fee";

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

  static async setMintFee(
    node: string,
    networkMagic: number,
    contractHash: string,
    fee: number,
    signer: wallet.Account,
  ): Promise<any> {
    const method = "set_mint_fee";
    const params = [
      sc.ContractParam.integer(fee)
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

  static async getAttributeMod(
    node: string,
    networkMagic: number,
    contractHash: string,
    attributeValue: number
  ): Promise<any> {
    const method = "roll_initial_stat";
    const param = [
      sc.ContractParam.integer(attributeValue)
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
    } catch(e){
      console.log(e)
      return
    }
  }


  //////////////EPOCHS/////////////
  //////////////EPOCHS/////////////
  //////////////EPOCHS/////////////

  static async totalEpochs(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<number> {
    const method = "total_epochs";

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

  static async totalTraitLevels(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<number> {
    const method = "total_trait_levels";

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

  static async setCurrentEpoch(
    node: string,
    networkMagic: number,
    contractHash: string,
    epochId: number,
    account: wallet.Account
  ): Promise<any> {
    const method = "set_current_epoch";

    const param = [
      sc.ContractParam.integer(epochId)
    ]

    return await NeoInterface.publishInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      param,
      account
    );
  }

  static async getCurrentEpoch(
    node: string,
    networkMagic: number,
    contractHash: string
  ): Promise<number> {
    const method = "get_current_epoch";

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

  static async createEpoch(
    node: string,
    networkMagic: number,
    contractHash: string,
    label: string,
    totalSupply: number,
    maxTraits: number,
    traits:Trait[],
    account: wallet.Account
  ): Promise<any> {
    const method = "create_epoch";

    const traitArray = traits.map( (trait) => {

      const traitPointers = trait.traits.map((pointer) => {
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

    console.log(label, totalSupply, maxTraits)
    const param = [
      sc.ContractParam.string(label),
      sc.ContractParam.integer(totalSupply),
      sc.ContractParam.integer(maxTraits),
      sc.ContractParam.array(...traitArray)
    ]

    return await NeoInterface.publishInvoke(
      node,
      networkMagic,
      contractHash,
      method,
      param,
      account
    );
  }

}
