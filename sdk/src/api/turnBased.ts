import {sc} from "@cityofzion/neon-js";
import {wallet} from "@cityofzion/neon-core";
import {formatter, variableInvoke} from "../helpers";

export class TurnBasedAPI {

  static async getGameJSON(
    node: string,
    networkMagic: number,
    contractHash: string,
    gameId: string,
    signer: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "get_game_json";

    const param = [
      sc.ContractParam.string(gameId),
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  static async totalGames(
    node: string,
    networkMagic: number,
    contractHash: string,
    signer?: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "total_games";

    const res = await variableInvoke(node, networkMagic, contractHash, method, [], signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  static async joinGame(
    node: string,
    networkMagic: number,
    contractHash: string,
    tokenId: string,
    signer: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "join_game";

    const param = [
      sc.ContractParam.string(tokenId),
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

  static async fight(
    node: string,
    networkMagic: number,
    contractHash: string,
    gameId: string,
    tokenId: string,
    attribute: string,
    signer?: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "fight";

    const param = [
      sc.ContractParam.string(gameId),
      sc.ContractParam.string(tokenId),
      sc.ContractParam.string(attribute),
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

}

