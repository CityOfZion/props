import Neon, { rpc, u } from "@cityofzion/neon-js";
import StackItemJson, { wallet } from "@cityofzion/neon-core";
import {BigInteger} from "@cityofzion/neon-core/lib/u";


export interface InteropInterface {
  type: string,
  iterator?: StackItemJson.sc.StackItemJson[],
  truncated: boolean
  value?: StackItemJson.sc.StackItemJson[]
}

export class NeoInterface {
  /**
   * A method for executing test invocations on the Neo blockchain
   * @param rpcAddress the rpc endpoint for a neo full node
   * @param networkMagic the network magic for the target network.  Query
   * @param scriptHash
   * @param operation
   * @param args
   * @constructor
   */
  static async testInvoke(
    rpcAddress: string,
    networkMagic: number,
    scriptHash: string,
    operation: string,
    args: any[]
  ): Promise<StackItemJson.sc.StackItemJson[] | InteropInterface[] | undefined> {

    const res = await new rpc.RPCClient(rpcAddress).invokeFunction(
      scriptHash,
      operation,
      args
    )
    return res.stack;
  }

  /**
   * A method for publishing contract invocations on the Neo Blockchain.
   * @param rpcAddress
   * @param networkMagic
   * @param scriptHash
   * @param operation
   * @param args
   * @param account
   */
  static async publishInvoke(
    rpcAddress: string,
    networkMagic: number,
    scriptHash: string,
    operation: string,
    args: any[],
    account: wallet.Account
  ): Promise<string | undefined> {

    const contract = new Neon.experimental.SmartContract(
      Neon.u.HexString.fromHex(scriptHash),
      {
        networkMagic,
        rpcAddress,
        account,
        systemFeeOverride: u.BigInteger.fromDecimal(2, 8),

      }
    );

    let result;
    try {
      result = await contract.invoke(operation, args);
    } catch (e) {
      console.log("errored here");
      console.log(e);
    }

    return result;
  }
}
