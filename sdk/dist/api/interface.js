"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeoInterface = void 0;
const neon_js_1 = __importStar(require("@cityofzion/neon-js"));
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
        const res = await new neon_js_1.rpc.RPCClient(rpcAddress).invokeFunction(scriptHash, operation, args);
        if (res.exception) {
            throw new Error("Invocation Error: " + res.exception);
        }
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
            //systemFeeOverride: u.BigInteger.fromDecimal(10, 8),
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