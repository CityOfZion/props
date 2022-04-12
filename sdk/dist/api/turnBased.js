"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnBasedAPI = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
const helpers_1 = require("../helpers");
class TurnBasedAPI {
    static async getGameJSON(node, networkMagic, contractHash, gameId, signer) {
        const method = "get_game_json";
        const param = [
            neon_js_1.sc.ContractParam.string(gameId),
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return helpers_1.formatter(res[0]);
    }
    static async totalGames(node, networkMagic, contractHash, signer) {
        const method = "total_games";
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, [], signer);
        if (signer) {
            return res;
        }
        return helpers_1.formatter(res[0]);
    }
    static async joinGame(node, networkMagic, contractHash, tokenId, signer) {
        const method = "join_game";
        const param = [
            neon_js_1.sc.ContractParam.string(tokenId),
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return helpers_1.formatter(res[0]);
    }
    static async fight(node, networkMagic, contractHash, gameId, tokenId, attribute, signer) {
        const method = "fight";
        const param = [
            neon_js_1.sc.ContractParam.string(gameId),
            neon_js_1.sc.ContractParam.string(tokenId),
            neon_js_1.sc.ContractParam.string(attribute),
        ];
        const res = await helpers_1.variableInvoke(node, networkMagic, contractHash, method, param, signer);
        if (signer) {
            return res;
        }
        return helpers_1.formatter(res[0]);
    }
}
exports.TurnBasedAPI = TurnBasedAPI;
//# sourceMappingURL=turnBased.js.map