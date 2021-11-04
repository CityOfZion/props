import StackItemJson, { wallet } from "@cityofzion/neon-core";
export declare class NeoInterface {
    /**
     * A method for executing test invocations on the Neo blockchain
     * @param rpcAddress the rpc endpoint for a neo full node
     * @param networkMagic the network magic for the target network.  Query
     * @param scriptHash
     * @param operation
     * @param args
     * @constructor
     */
    static testInvoke(rpcAddress: string, networkMagic: number, scriptHash: string, operation: string, args: any[]): Promise<StackItemJson.sc.StackItemJson[] | undefined>;
    /**
     * A method for publishing contract invocations on the Neo Blockchain.
     * @param rpcAddress
     * @param networkMagic
     * @param scriptHash
     * @param operation
     * @param args
     * @param account
     */
    static publishInvoke(rpcAddress: string, networkMagic: number, scriptHash: string, operation: string, args: any[], account: wallet.Account): Promise<string | undefined>;
}
