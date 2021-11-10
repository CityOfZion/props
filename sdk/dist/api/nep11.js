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
exports.Nep11 = void 0;
const interface_1 = require("./interface");
const neon_js_1 = __importStar(require("@cityofzion/neon-js"));
class Nep11 {
    /**
     * Returns the token symbol
     * @param node
     * @param networkMagic
     * @param contractHash
     */
    static async symbol(node, networkMagic, contractHash) {
        const method = "symbol";
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
        if (res === undefined) {
            throw new Error("unrecognized response");
        }
        return neon_js_1.default.u.HexString.fromBase64(res[0].value).toAscii();
    }
    /**
     * Returns the decimals of the token
     * @param node
     * @param networkMagic
     * @param contractHash
     */
    static async decimals(node, networkMagic, contractHash) {
        const method = "decimals";
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
        if (res === undefined) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    /**
     * Returns the total supply of the token
     * @param node
     * @param networkMagic
     * @param contractHash
     */
    static async totalSupply(node, networkMagic, contractHash) {
        const method = "totalSupply";
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    /**
     * Returns the balance of an account
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param address
     */
    static async balanceOf(node, networkMagic, contractHash, address) {
        const method = "balanceOf";
        const params = [neon_js_1.sc.ContractParam.hash160(address)];
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, params);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    // TODO - finalize return type
    /**
     * Gets an array of strings(tokenId) owned by an address
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param address The string formatted address of an account
     */
    static async tokensOf(node, networkMagic, contractHash, address) {
        const method = "tokensOf";
        const params = [neon_js_1.sc.ContractParam.hash160(address)];
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, params);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        const iterator = res[0];
        if (iterator.iterator && iterator.iterator.length >= 0 && iterator.iterator[0].value) {
            const tokens = iterator.iterator.map((token) => {
                const attrs = token.value;
                return neon_js_1.u.HexString.fromBase64(attrs[1].value).toString();
            });
            return tokens;
        }
        throw new Error("unable to resolve respond format");
    }
    // TODO - change to NEP11
    /*
    static async transfer(
      node: string,
      networkMagic: number,
      contractHash: string,
      fromAddress: string,
      toAddress: string,
      amount: number,
      account: wallet.Account,
      data?: any
    ): Promise<any> {
      const method = "transfer";
      const params = [
        sc.ContractParam.hash160(fromAddress),
        sc.ContractParam.hash160(toAddress),
        amount,
        data,
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
     */
    /**
     * Gets the owner account of a tokenId
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId to return the owner of
     */
    static async ownerOf(node, networkMagic, contractHash, tokenId) {
        const method = "ownerOf";
        const params = [neon_js_1.sc.ContractParam.string(tokenId)];
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, params);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return res[0].value;
    }
    /**
     * Gets and array of strings(tokenIds) representing all the tokens associated with the contract
     * @param node
     * @param networkMagic
     * @param contractHash
     */
    static async tokens(node, networkMagic, contractHash) {
        const method = "tokens";
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        const iterator = res[0];
        if (iterator.iterator && iterator.iterator.length >= 0 && iterator.iterator[0].value) {
            const tokens = iterator.iterator.map((token) => {
                const attrs = token.value;
                return neon_js_1.u.HexString.fromBase64(attrs[0].value).toString();
            });
            return tokens;
        }
        throw new Error("unable to resolve respond format");
    }
    /**
     * Gets the properties of a token
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId of the token being requested
     */
    static async properties(node, networkMagic, contractHash, tokenId) {
        const method = "tokens";
        const params = [neon_js_1.sc.ContractParam.string(tokenId)];
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, params);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return res[0].value;
    }
    /*
    static async propertiesJson() {}
    */
    /**
     * Initializes the smart contract on first deployment (REQUIRED)
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param data A pass through variable that is currently not used
     * @param upgrade Indicates whether the deployment is an upgrade
     * @param account The signing account, which will become the first admin if upgrade == false
     */
    static async deploy(node, networkMagic, contractHash, data, //we arent using this...
    upgrade, account) {
        const method = "deploy";
        const params = [
            neon_js_1.sc.ContractParam.hash160(account.address),
            neon_js_1.sc.ContractParam.boolean(upgrade),
        ];
        return await interface_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, params, account);
    }
    /*
    static async onNEP11Payment() {}
  
    static async onNEP17Payment() {}
  
    static async burn() {}
    */
    /**
     * Creates a new NEP11 token on the contract
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param address The address to mint to.
     * @param meta The meta data for the token (properties)
     * @param royalties Are there royalties?
     * @param data: mint-required data payload
     * @param account The signing account
     */
    static async mint(node, networkMagic, contractHash, address, meta, royalties, data, account) {
        const method = "mint";
        const params = [
            neon_js_1.sc.ContractParam.hash160(address),
            neon_js_1.sc.ContractParam.string(meta),
            neon_js_1.sc.ContractParam.string(royalties),
            neon_js_1.sc.ContractParam.string(data),
        ];
        return await interface_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, params, account);
    }
}
exports.Nep11 = Nep11;
//# sourceMappingURL=nep11.js.map