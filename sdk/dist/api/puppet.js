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
exports.PuppetAPI = void 0;
const neon_js_1 = __importStar(require("@cityofzion/neon-js"));
const neon_core_1 = require("@cityofzion/neon-core");
const helpers_1 = require("../helpers");
class PuppetAPI {
    /**
     * Returns the balance of an account
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param address
     * @param signer
     */
    static async balanceOf(node, networkMagic, contractHash, address, signer) {
        const method = "balanceOf";
        const params = [neon_js_1.sc.ContractParam.hash160(address)];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
    static async createEpoch(node, networkMagic, contractHash, label, generatorInstanceId, mintFee, sysFee, maxSupply, signer) {
        const method = "create_epoch";
        const params = [
            neon_js_1.sc.ContractParam.string(label),
            neon_js_1.sc.ContractParam.integer(generatorInstanceId),
            neon_js_1.sc.ContractParam.integer(mintFee),
            neon_js_1.sc.ContractParam.integer(sysFee),
            neon_js_1.sc.ContractParam.integer(maxSupply)
        ];
        return await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
    }
    /**
     * Returns the decimals of the token
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer
     */
    static async decimals(node, networkMagic, contractHash, signer) {
        const method = "decimals";
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
    /**
     * Initializes the smart contract on first deployment (REQUIRED)
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer The signing account, which will become the first admin if upgrade == false
     */
    static async deploy(node, networkMagic, contractHash, signer) {
        const method = "deploy";
        return await helpers_1.variableInvoke(node, networkMagic, contractHash, method, [], signer);
    }
    static async getAttributeMod(node, networkMagic, contractHash, attributeValue, signer) {
        const method = "roll_initial_stat";
        const params = [
            neon_js_1.sc.ContractParam.integer(attributeValue)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
    static async getPuppetJSON(node, networkMagic, contractHash, tokenId, signer) {
        const method = "get_puppet_json";
        const param = [neon_js_1.sc.ContractParam.string(tokenId)];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return helpers_1.formatter(res[0]);
    }
    static async getPuppetJSONFlat(node, networkMagic, contractHash, tokenId, signer) {
        const method = "get_puppet_json_flat";
        const params = [neon_js_1.sc.ContractParam.string(tokenId)];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
        if (signer) {
            return res;
        }
        return helpers_1.formatter(res[0]);
    }
    static async getPuppetRaw(node, networkMagic, contractHash, tokenId, signer) {
        const method = "get_puppet_raw";
        const params = [neon_js_1.sc.ContractParam.string(tokenId)];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
        if (signer) {
            return res;
        }
        return res[0].value;
    }
    /**
     * Gets the owner account of a tokenId
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId to return the owner of
     * @param signer
     */
    static async ownerOf(node, networkMagic, contractHash, tokenId, signer) {
        const method = "ownerOf";
        const params = [neon_js_1.sc.ContractParam.string(tokenId)];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
        if (signer) {
            return res;
        }
        const rawValue = neon_js_1.u.base642hex(res[0].value);
        return new neon_core_1.wallet.Account(neon_js_1.u.reverseHex(rawValue));
    }
    static async offlineMint(node, networkMagic, contractHash, epochId, owner, signer) {
        const method = "offline_mint";
        const params = [
            neon_js_1.sc.ContractParam.integer(epochId),
            neon_js_1.sc.ContractParam.hash160(owner)
        ];
        return await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
    }
    /**
     * Gets the properties of a token
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId of the token being requested
     * @param signer An optional signer.  Populating this value will publish a transaction and return a txid
     */
    static async properties(node, networkMagic, contractHash, tokenId, signer) {
        const method = "properties";
        const params = [neon_js_1.sc.ContractParam.string(tokenId)];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
        if (signer) {
            return res;
        }
        return helpers_1.formatter(res[0]);
    }
    static async setMintFee(node, networkMagic, contractHash, epochId, fee, signer) {
        const method = "set_mint_fee";
        const params = [
            neon_js_1.sc.ContractParam.integer(epochId),
            neon_js_1.sc.ContractParam.integer(fee)
        ];
        return await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
    }
    /**
     * Returns the token symbol
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer
     */
    static async symbol(node, networkMagic, contractHash, signer) {
        const method = "symbol";
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        return neon_js_1.default.u.HexString.fromBase64(res[0].value).toAscii();
    }
    /**
     * Gets and array of strings(tokenIds) representing all the tokens associated with the contract
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer
     */
    static async tokens(node, networkMagic, contractHash, signer) {
        const method = "tokens";
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        const iterator = res[0];
        if (iterator.iterator && iterator.iterator.length > 0 && iterator.iterator[0].value) {
            return iterator.iterator.map((token) => {
                const attrs = token.value;
                let bytes = neon_js_1.u.base642hex(attrs[0].value);
                return parseInt(neon_js_1.u.reverseHex(bytes), 16);
            });
        }
        if (iterator.iterator && iterator.iterator.length === 0) {
            return [];
        }
        throw new Error("unable to resolve respond format");
    }
    /**
     * Gets an array of strings(tokenId) owned by an address
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param address The string formatted address of an account
     * @param signer
     */
    static async tokensOf(node, networkMagic, contractHash, address, signer) {
        const method = "tokensOf";
        const params = [neon_js_1.sc.ContractParam.hash160(address)];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
        if (signer) {
            return res;
        }
        const iterator = res[0];
        if (iterator.iterator && iterator.iterator.length >= 0) {
            return iterator.iterator.map((token) => {
                const attrs = token.value;
                return helpers_1.formatter(attrs[1]);
            });
        }
        throw new Error("unable to resolve respond format");
    }
    /**
     * Gets the total number of accounts stored in the contract
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer
     */
    static async totalAccounts(node, networkMagic, contractHash, signer) {
        const method = "total_accounts";
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
    static async totalEpochs(node, networkMagic, contractHash, signer) {
        const method = "total_epochs";
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
    }
    /**
     * Returns the total supply of the token
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param signer
     */
    static async totalSupply(node, networkMagic, contractHash, signer) {
        const method = "totalSupply";
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        return parseInt(res[0].value);
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
    static async transfer(node, networkMagic, contractHash, toAddress, tokenId, signer, data) {
        const method = "transfer";
        const params = [
            neon_js_1.sc.ContractParam.hash160(toAddress),
            neon_js_1.sc.ContractParam.string(tokenId),
            data,
        ];
        return await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
    }
    static async update(node, networkMagic, contractHash, script, manifest, data, signer) {
        const method = "update";
        const params = [
            neon_js_1.sc.ContractParam.byteArray(script),
            neon_js_1.sc.ContractParam.string(manifest),
            neon_js_1.sc.ContractParam.any(data)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, params, signer);
        if (signer) {
            return res;
        }
        return helpers_1.formatter(res);
    }
    //setUserPermissions
    static async getEpochJSON(node, networkMagic, contractHash, epochId, signer) {
        const method = "get_epoch_json";
        const param = [neon_js_1.sc.ContractParam.integer(epochId)];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return helpers_1.parseToJSON(res[0].value);
    }
}
exports.PuppetAPI = PuppetAPI;
//# sourceMappingURL=puppet.js.map