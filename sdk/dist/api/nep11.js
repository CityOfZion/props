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
const interface_1 = require("../interface");
const neon_js_1 = __importStar(require("@cityofzion/neon-js"));
class Nep11 {
    static async symbol(node, networkMagic, contractHash) {
        const method = "symbol";
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
        if (res === undefined) {
            throw new Error("unrecognized response");
        }
        return neon_js_1.default.u.HexString.fromBase64(res[0].value).toAscii();
    }
    static async decimals(node, networkMagic, contractHash) {
        const method = "decimals";
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
        if (res === undefined) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    static async totalSupply(node, networkMagic, contractHash) {
        const method = "totalSupply";
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, []);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    static async balanceOf(node, networkMagic, contractHash, address) {
        const method = "totalSupply";
        const params = [neon_js_1.sc.ContractParam.hash160(address)];
        const res = await interface_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, params);
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return parseInt(res[0].value);
    }
    static async tokensOf() { }
    static async transfer(node, networkMagic, contractHash, fromAddress, toAddress, amount, account, data) {
        const method = "transfer";
        const params = [
            neon_js_1.sc.ContractParam.hash160(fromAddress),
            neon_js_1.sc.ContractParam.hash160(toAddress),
            amount,
            data
        ];
        return await interface_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, params, account);
    }
    static async ownerOf() { }
    static async tokens() { }
    static async properties() { }
    static async propertiesJson() { }
    static async _deploy() { }
    static async onNEP11Payment() { }
    static async onNEP17Payment() { }
    static async burn() { }
    static async mint() { }
    static async getRoyalties() { }
    static async getAuthorizedAddress() { }
    static async setAuthorizedAddress() { }
    static async updatePause() { }
    static async isPaused() { }
    static async verify() { }
    static async update() { }
    static async destroy() { }
}
exports.Nep11 = Nep11;
//# sourceMappingURL=nep11.js.map