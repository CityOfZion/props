import {InteropInterface, NeoInterface} from "./interface";
import Neon, { sc, u } from "@cityofzion/neon-js";
import { wallet } from "@cityofzion/neon-core";
import {StackItemJson, StackItemMapLike} from "@cityofzion/neon-core/lib/sc";
import {CharacterType} from "../interface";

export class CharacterAPI {

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

    if (res[0].type === "Array") {
      const values = res[0].value as StackItemJson[]
      return values.map( (value: StackItemJson) => {
        let bytes = u.base642hex(value.value as string)
        return parseInt(u.reverseHex(bytes),16)
      })
    }

    /*
    //iterator parsing code
    const iterator: InteropInterface = res[0] as InteropInterface
    if (iterator.iterator && iterator.iterator.length >= 0 && iterator.iterator![0].value) {
      return iterator.iterator.map( (token: StackItemJson) => {
          const attrs: StackItemJson[] = token.value as StackItemJson[]
          return u.HexString.fromBase64(attrs[1].value as string).toString() as string
      })
    }

     */
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
    tokenId: number,
  ): Promise<CharacterType | undefined> {
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
    const character: CharacterType = {
      attributes: {
        charisma: 0,
        constitution: 0,
        dexterity: 0,
        intelligence: 0,
        strength: 0,
        wisdom: 0,
      },
      hitDie: '',
      titles: [],
      tokenId: 0,
      owner: new wallet.Account()
    }

    if (res[0] && res[0].value) {
      (res[0].value as unknown as StackItemMapLike[]).forEach( (entry: StackItemMapLike) => {
        let key = u.hexstring2str(u.base642hex(entry.key.value as string))

        let rawValue
        switch (key) {
          case "attributes":
            let attrs = entry.value.value as unknown as StackItemMapLike[]
            attrs.forEach( (attrRaw: StackItemMapLike) => {
              let attrKey = u.hexstring2str(u.base642hex(attrRaw.key.value as string))
              switch (attrKey) {
                case "charisma":
                  character.attributes.charisma = parseInt(attrRaw.value.value as string)
                  break
                case "constitution":
                  character.attributes.constitution = parseInt(attrRaw.value.value as string)
                  break
                case "dexterity":
                  character.attributes.dexterity = parseInt(attrRaw.value.value as string)
                  break
                case "intelligence":
                  character.attributes.intelligence = parseInt(attrRaw.value.value as string)
                  break
                case "strength":
                  character.attributes.strength = parseInt(attrRaw.value.value as string)
                  break
                case "wisdom":
                  character.attributes.wisdom = parseInt(attrRaw.value.value as string)
                  break
              }
            })
            break
          case "hit_die":
            character.hitDie = u.hexstring2str(u.base642hex(entry.value.value as string))
            break
          case "owner":
            rawValue = u.base642hex(entry.value.value as string)
            character.owner = new wallet.Account(u.reverseHex(rawValue))
          case "titles":
            break
          case "token_id":
            rawValue = u.base642hex(entry.value.value as string)
            character.tokenId = parseInt(u.reverseHex(rawValue),16)
            break
        }
      })
    }
    return character
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


  static async mint(
    node: string,
    networkMagic: number,
    contractHash: string,
    owner: string,
    signer: wallet.Account
  ): Promise<any> {
    const method = "mint";
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

  static async getAuthorizedAddresses(
    node: string,
    networkMagic: number,
    contractHash: string,
  ): Promise<any> {
    const method = "getAuthorizedAddresses";

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
    return res;
  }

  static async setAuthorizedAddress(
    node: string,
    networkMagic: number,
    contractHash: string,
    address: string,
    authorized: boolean,
    signer: wallet.Account
  ): Promise<any> {
    const method = "setAuthorizedAddress";
    const params = [
      sc.ContractParam.hash160(address),
      sc.ContractParam.boolean(authorized)
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


  static async getCharacterRaw(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: string
  ): Promise<any> {
    const method = "get_character_raw";

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

  static async rollDie(
    node: string,
    networkMagic: number,
    contractHash: string,
    die: string
  ): Promise<number> {
    const method = "roll_die";
    const param = [
      sc.ContractParam.string(die)
    ]
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
    return parseInt(res[0].value as string);
  }

  static async rollDiceWithEntropy(
    node: string,
    networkMagic: number,
    contractHash: string,
    die: string,
    precision: number,
    entropy: string
  ): Promise<number> {
    const method = "roll_dice_with_entropy";
    const param = [
      sc.ContractParam.string(die),
      sc.ContractParam.integer(precision),
      sc.ContractParam.string(entropy)
    ]
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
    return parseInt(res[0].value as string);
  }

  static async rollInitialStat(
    node: string,
    networkMagic: number,
    contractHash: string,
  ): Promise<any> {
    const method = "roll_initial_stat";
    try {
      const res = await NeoInterface.testInvoke(
        node,
        networkMagic,
        contractHash,
        method,
        [],
      );
      if (res === undefined || res.length === 0) {
        throw new Error("unrecognized response");
      }
      return res[0].value as number;
    } catch(e){
      console.log(e)
      return
    }
  }

  static async rollInitialStatWithEntropy(
    node: string,
    networkMagic: number,
    contractHash: string,
    entropy: string
  ): Promise<any> {
    const method = "roll_initial_stat";
    const param = [
      sc.ContractParam.string(entropy)
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




}
