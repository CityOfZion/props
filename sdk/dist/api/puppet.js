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
const interface_1 = require("./interface");
const neon_js_1 = __importStar(require("@cityofzion/neon-js"));
const neon_core_1 = require("@cityofzion/neon-core");
const helpers_1 = require("../helpers");
class PuppetAPI {
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
        if (iterator.iterator && iterator.iterator.length >= 0) {
            return iterator.iterator.map((token) => {
                const attrs = token.value;
                let bytes = neon_js_1.u.base642hex(attrs[1].value);
                return parseInt(neon_js_1.u.reverseHex(bytes), 16);
            });
        }
        throw new Error("unable to resolve respond format");
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
            neon_js_1.sc.ContractParam.integer(tokenId),
            data,
        ];
        return await interface_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, params, signer);
    }
    /**
     * Gets the owner account of a tokenId
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId to return the owner of
     */
    static async ownerOf(node, networkMagic, contractHash, tokenId) {
        const method = "ownerOf";
        const params = [neon_js_1.sc.ContractParam.integer(tokenId)];
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, params);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        const rawValue = neon_js_1.u.base642hex(res[0].value);
        return new neon_core_1.wallet.Account(neon_js_1.u.reverseHex(rawValue));
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
     * Gets the properties of a token
     * @param node
     * @param networkMagic
     * @param contractHash
     * @param tokenId The tokenId of the token being requested
     */
    static async properties(node, networkMagic, contractHash, tokenId) {
        const method = "properties";
        const params = [neon_js_1.sc.ContractParam.integer(tokenId)];
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, params);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        const puppet = {
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
            epoch: 0,
            name: '',
            owner: new neon_core_1.wallet.Account(),
            traits: [],
            tokenId: 0,
            tokenURI: '',
        };
        if (res[0] && res[0].value) {
            res[0].value.forEach((entry) => {
                let key = neon_js_1.u.hexstring2str(neon_js_1.u.base642hex(entry.key.value));
                let rawValue;
                switch (key) {
                    case "armorClass":
                        puppet.armorClass = parseInt(entry.value.value);
                        break;
                    case "attributes":
                        let attrs = entry.value.value;
                        attrs.forEach((attrRaw) => {
                            let attrKey = neon_js_1.u.hexstring2str(neon_js_1.u.base642hex(attrRaw.key.value));
                            switch (attrKey) {
                                case "charisma":
                                    puppet.attributes.charisma = parseInt(attrRaw.value.value);
                                    break;
                                case "constitution":
                                    puppet.attributes.constitution = parseInt(attrRaw.value.value);
                                    break;
                                case "dexterity":
                                    puppet.attributes.dexterity = parseInt(attrRaw.value.value);
                                    break;
                                case "intelligence":
                                    puppet.attributes.intelligence = parseInt(attrRaw.value.value);
                                    break;
                                case "strength":
                                    puppet.attributes.strength = parseInt(attrRaw.value.value);
                                    break;
                                case "wisdom":
                                    puppet.attributes.wisdom = parseInt(attrRaw.value.value);
                                    break;
                            }
                        });
                        break;
                    case "hitDie":
                        puppet.hitDie = neon_js_1.u.hexstring2str(neon_js_1.u.base642hex(entry.value.value));
                        break;
                    case "name":
                        puppet.name = neon_js_1.u.hexstring2str(neon_js_1.u.base642hex(entry.value.value));
                        break;
                    case "owner":
                        rawValue = neon_js_1.u.base642hex(entry.value.value);
                        puppet.owner = new neon_core_1.wallet.Account(neon_js_1.u.reverseHex(rawValue));
                        break;
                    case "traits":
                        puppet.traits = entry.value.value.map((t) => {
                            return helpers_1.formatter(t);
                        });
                        break;
                    case "tokenId":
                        puppet.tokenId = parseInt(entry.value.value);
                        break;
                    case "tokenURI":
                        puppet.tokenURI = neon_js_1.u.hexstring2str(neon_js_1.u.base642hex(entry.value.value));
                        break;
                    case "epoch":
                        puppet.epoch = parseInt(entry.value.value);
                        break;
                    default:
                        throw new Error('unrecognized property: ' + key);
                }
            });
        }
        return puppet;
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
    static async deploy(node, networkMagic, contractHash, account) {
        const method = "deploy";
        return await interface_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, [], account);
    }
    static async offlineMint(node, networkMagic, contractHash, owner, signer) {
        const method = "offline_mint";
        const params = [
            neon_js_1.sc.ContractParam.hash160(owner)
        ];
        try {
            const res = await interface_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, params, signer);
            if (res === undefined || res.length === 0) {
                throw new Error("unrecognized response");
            }
            return res;
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    static async update(node, networkMagic, contractHash, script, manifest, signer) {
        const method = "update";
        const params = [
            neon_js_1.sc.ContractParam.byteArray(script),
            neon_js_1.sc.ContractParam.byteArray(manifest)
        ];
        try {
            const res = await interface_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, params, signer);
            if (res === undefined || res.length === 0) {
                throw new Error("unrecognized response");
            }
            return res;
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    static async getPuppetRaw(node, networkMagic, contractHash, tokenId) {
        const method = "get_puppet_raw";
        const params = [neon_js_1.sc.ContractParam.string(tokenId)];
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, params);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return res[0].value;
    }
    static async getMintFee(node, networkMagic, contractHash) {
        const method = "get_mint_fee";
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    static async setMintFee(node, networkMagic, contractHash, fee, signer) {
        const method = "set_mint_fee";
        const params = [
            neon_js_1.sc.ContractParam.integer(fee)
        ];
        return await interface_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, params, signer);
    }
    static async getAttributeMod(node, networkMagic, contractHash, attributeValue) {
        const method = "roll_initial_stat";
        const param = [
            neon_js_1.sc.ContractParam.integer(attributeValue)
        ];
        try {
            const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, param);
            if (res === undefined || res.length === 0) {
                throw new Error("unrecognized response");
            }
            return res;
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    //////////////EPOCHS/////////////
    //////////////EPOCHS/////////////
    //////////////EPOCHS/////////////
    static async setCurrentEpoch(node, networkMagic, contractHash, epochId, account) {
        const method = "set_current_epoch";
        const param = [
            neon_js_1.sc.ContractParam.integer(epochId)
        ];
        return await interface_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, param, account);
    }
    static async getCurrentEpoch(node, networkMagic, contractHash) {
        const method = "get_current_epoch";
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
}
exports.PuppetAPI = PuppetAPI;
//# sourceMappingURL=puppet.js.map