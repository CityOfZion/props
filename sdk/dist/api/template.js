"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const helpers_1 = require("../helpers");
class TemplateAPI {
    static async templateMethod(node, networkMagic, contractHash, paramA, paramB, paramC, paramD, paramE, signer) {
        const method = "{{YOUR_METHOD_NAME_HERE}}";
        const paramEFormatted = paramE.map((param) => {
            return neon_js_1.sc.ContractParam.string(param);
        });
        const param = [
            neon_js_1.sc.ContractParam.string(paramA),
            neon_js_1.sc.ContractParam.integer(paramB),
            neon_js_1.sc.ContractParam.byteArray(paramC),
            neon_js_1.sc.ContractParam.boolean(paramD),
            neon_js_1.sc.ContractParam.array(...paramEFormatted)
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return helpers_1.formatter(res[0]);
    }
}
exports.TemplateAPI = TemplateAPI;
//# sourceMappingURL=template.js.map