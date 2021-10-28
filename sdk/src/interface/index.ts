import Neon from "@cityofzion/neon-js";
import StackItemJson, { wallet } from "@cityofzion/neon-core";

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
  ): Promise<StackItemJson.sc.StackItemJson[] | undefined> {
    const contract = new Neon.experimental.SmartContract(
      Neon.u.HexString.fromHex(scriptHash),
      {
        networkMagic,
        rpcAddress,
      }
    );
    let res = await contract.testInvoke(operation, args);

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
