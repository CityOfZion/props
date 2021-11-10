"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeoInterface = void 0;
const neon_js_1 = __importDefault(require("@cityofzion/neon-js"));
class NeoInterface {
    /**
     * A method for executing test invocations on the Neo blockchain
     * @param rpcAddress the rpc endpoint for a neo full node
     * @param networkMagic the network magic for the target network.  Query
     * @param scriptHash
     * @param operation
     * @param args
     * @constructor
     */
    static async testInvoke(rpcAddress, networkMagic, scriptHash, operation, args) {
        const contract = new neon_js_1.default.experimental.SmartContract(neon_js_1.default.u.HexString.fromHex(scriptHash), {
            networkMagic,
            rpcAddress,
        });
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
    static async publishInvoke(rpcAddress, networkMagic, scriptHash, operation, args, account) {
        const contract = new neon_js_1.default.experimental.SmartContract(neon_js_1.default.u.HexString.fromHex(scriptHash), {
            networkMagic,
            rpcAddress,
            account,
        });
        let result;
        try {
            result = await contract.invoke(operation, args);
        }
        catch (e) {
            console.log("errored here");
            console.log(e);
        }
        return result;
    }
}
exports.NeoInterface = NeoInterface;
//# sourceMappingURL=interface.js.map