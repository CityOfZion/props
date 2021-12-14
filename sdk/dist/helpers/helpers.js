"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txDidComplete = exports.variableInvoke = exports.sleep = exports.formatter = exports.parseToJSON = void 0;
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("../api");
function parseToJSON(entries) {
    const object = {};
    let key;
    let value;
    entries.forEach((entry) => {
        key = formatter(entry.key);
        switch (entry.value.type) {
            case "Map":
                value = parseToJSON(entry.value.value);
                break;
            case "Array":
                value = entry.value.value.map((e) => {
                    return parseToJSON(e.value);
                });
                break;
            default:
                if (key === 'token_id') {
                    value = formatter(entry.value, true);
                }
                else {
                    value = formatter(entry.value);
                }
                break;
        }
        object[key] = value;
    });
    return object;
}
exports.parseToJSON = parseToJSON;
function formatter(field, num = false) {
    switch (field.type) {
        case "ByteString":
            const rawValue = neon_core_1.u.base642hex(field.value);
            if (num) {
                return parseInt(neon_core_1.u.reverseHex(rawValue), 16);
            }
            //if (rawValue.length === 40) {
            //  return new wallet.Account(u.reverseHex(rawValue))
            //}
            return neon_core_1.u.hexstring2str(rawValue);
        case "Integer":
            return parseInt(field.value);
        case "Array":
            return field.value.map((f) => {
                return formatter(f);
            });
        case "Map":
            const object = {};
            field.value.forEach((f) => {
                let key = formatter(f.key);
                object[key] = formatter(f.value);
            });
            return object;
        default:
            return field.value;
    }
}
exports.formatter = formatter;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
async function variableInvoke(node, networkMagic, contractHash, method, param = [], signer) {
    try {
        let res;
        if (signer) {
            res = await api_1.NeoInterface.publishInvoke(node, networkMagic, contractHash, method, param, signer);
        }
        else {
            res = await api_1.NeoInterface.testInvoke(node, networkMagic, contractHash, method, param);
        }
        if (res === undefined || res.length === 0) {
            throw new Error("unrecognized response");
        }
        return res;
    }
    catch (e) {
        throw new Error("Something went wrong: " + e.message);
    }
}
exports.variableInvoke = variableInvoke;
async function txDidComplete(node, txid, showStats = false) {
    const client = new neon_core_1.rpc.RPCClient(node);
    const tx = await client.getApplicationLog(txid);
    if (showStats) {
        console.log('gas consumed: ', parseInt(tx.executions[0].gasconsumed) / 10 ** 8);
        parseNotifications(tx);
    }
    if (tx.executions[0].vmstate !== "HALT") {
        throw new Error(tx.executions[0].exception);
    }
    if (tx.executions[0]) {
        const result = tx.executions[0].stack.map((item) => {
            return formatter(item);
        });
        return result;
    }
    return true;
}
exports.txDidComplete = txDidComplete;
function parseNotifications(tx) {
    return tx.executions[0].notifications.map((n) => {
        const notification = formatter(n.state);
        console.log(n.eventname, notification);
        return notification;
    });
}
//# sourceMappingURL=helpers.js.map