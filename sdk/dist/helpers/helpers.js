"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chiSquared = exports.txDidComplete = exports.getEvents = exports.deployContract = exports.variableInvoke = exports.sleep = exports.formatter = void 0;
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("../api");
const fs_1 = __importDefault(require("fs"));
const neon_js_1 = require("@cityofzion/neon-js");
function formatter(field, num = false) {
    switch (field.type) {
        case "ByteString":
            const rawValue = neon_core_1.u.base642hex(field.value);
            if (num) {
                return parseInt(neon_core_1.u.reverseHex(rawValue), 16);
            }
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
async function deployContract(node, networkMagic, pathToNEF, signer) {
    const config = {
        networkMagic,
        rpcAddress: node,
        account: signer
    };
    const nef = neon_core_1.sc.NEF.fromBuffer(fs_1.default.readFileSync(pathToNEF));
    const rawManifest = fs_1.default.readFileSync(pathToNEF.replace('.nef', '.manifest.json'));
    const manifest = neon_core_1.sc.ContractManifest.fromJson(JSON.parse(rawManifest.toString()));
    const assembledScript = new neon_core_1.sc.ScriptBuilder()
        .emit(neon_core_1.sc.OpCode.ABORT)
        .emitPush(neon_core_1.u.HexString.fromHex(signer.scriptHash))
        .emitPush(nef.checksum)
        .emitPush(manifest.name)
        .build();
    const scriptHash = neon_core_1.u.reverseHex(neon_core_1.u.hash160(assembledScript));
    console.log(`deploying ${manifest.name} to 0x${scriptHash} ...`);
    return neon_js_1.experimental.deployContract(nef, manifest, config);
}
exports.deployContract = deployContract;
async function getEvents(node, txid) {
    const client = new neon_core_1.rpc.RPCClient(node);
    const tx = await client.getApplicationLog(txid);
    return parseNotifications(tx);
}
exports.getEvents = getEvents;
async function txDidComplete(node, txid, showStats = false) {
    const client = new neon_core_1.rpc.RPCClient(node);
    const tx = await client.getApplicationLog(txid);
    if (showStats) {
        console.log('gas consumed: ', parseInt(tx.executions[0].gasconsumed) / 10 ** 8);
        parseNotifications(tx, true);
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
function parseNotifications(tx, verbose = false) {
    return tx.executions[0].notifications.map((n) => {
        const notification = formatter(n.state);
        const res = {
            'eventName': n.eventname,
            'value': notification
        };
        if (verbose) {
            console.log(`event: ${n.eventname}`);
            console.log(`  payload: ${JSON.stringify(notification)}`);
        }
        return res;
    });
}
function chiSquared(samples) {
    const bins = {};
    for (let sample of samples) {
        // @ts-ignore
        if (bins[sample]) {
            // @ts-ignore
            bins[sample] += 1;
        }
        else {
            // @ts-ignore
            bins[sample] = 1;
        }
    }
    // chi-squared test for uniformity
    let chiSquared = 0;
    const expected = samples.length / Object.keys(bins).length;
    const keys = Object.keys(bins);
    for (let i = 0; i < keys.length; i++) {
        // @ts-ignore
        chiSquared += ((bins[keys[i]] - expected) ** 2) / expected;
    }
    return chiSquared;
}
exports.chiSquared = chiSquared;
//# sourceMappingURL=helpers.js.map