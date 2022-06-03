"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chest = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const interface_1 = require("./interface");
const helpers_1 = require("./helpers");
const DEFAULT_OPTIONS = {
    network: interface_1.NetworkOption.LocalNet
};
/**
  TEMPLATE CONTRACT CLASS
  Use this class template to build out the typescript interface for your smart contract.  If you rename this or the
  `api` equivalent, make sure to update the respective `index.ts` and rebuild.
 */
class Chest {
    // Once you get a scriptHash from deploying your smart contract via `npm run deploy`, update the `this.options.scriptHash` value.
    // The default is analogous to localnet (neo-express) so you will most likely want to be updating that value.  Remember to
    // compile the sdk before use or your change wont take effect.  Do that by running `tsc` in the sdk directory.
    constructor(options = {}) {
        this.options = DEFAULT_OPTIONS;
        this.networkMagic = -1;
        switch (options.network) {
            case interface_1.NetworkOption.TestNet:
                this.options.node = 'https://testnet1.neo.coz.io:443';
                this.options.scriptHash = '';
                break;
            case interface_1.NetworkOption.MainNet:
                this.options.node = 'https://mainnet1.neo.coz.io:443';
                this.options.scriptHash = '0xb94e721f5425ba1d8830ad752e50e0474f989da5';
                break;
            default:
                this.options.node = 'http://localhost:50012';
                this.options.scriptHash = '0x3fb4df29c0c200eff40f465cd028647b8a82f002';
                break;
        }
        this.options = lodash_1.merge({}, this.options, options);
    }
    /**
     * DO NOT EDIT ME
     * Gets the magic number for the network and configures the class instance.
     */
    async init() {
        const getVersionRes = await this.node.getVersion();
        this.networkMagic = getVersionRes.protocol.network;
    }
    /**
     * DO NOT EDIT ME
     * The the node that the instance is connected to.
     */
    get node() {
        if (this.options.node) {
            return new neon_core_1.rpc.RPCClient(this.options.node);
        }
        throw new Error('no node selected!');
    }
    /**
     * DO NOT EDIT ME
     * The contract script hash that is being interfaced with.
     */
    get scriptHash() {
        if (this.options.scriptHash) {
            return this.options.scriptHash;
        }
        throw new Error('node scripthash defined');
    }
    /**
     *
     * EDIT ME!!!
     *
     * This template method is designed to be a passthough so you should really only be changing the name and parameter types.
     * All the magic happens in the TemplateAPI.templateMethod.  Check there to align your sdk with your smart contract.
     * Create one of these pass throughs for each method you expose in your smart contract. The goal of this entire class is to
     * simplify the network configuration steps which can be complicated.
     */
    async createChest(name, type, eligibleEpochs, puppetTraits, signer) {
        return api_1.ChestAPI.createChest(this.node.url, this.networkMagic, this.scriptHash, name, type, eligibleEpochs, puppetTraits, signer);
    }
    async isPuppetEligible(chestId, puppetId, signer) {
        return api_1.ChestAPI.isPuppetEligible(this.node.url, this.networkMagic, this.scriptHash, chestId, puppetId, signer);
    }
    async lootChestWithPuppet(chestId, puppetId, signer) {
        return api_1.ChestAPI.lootChestWithPuppet(this.node.url, this.networkMagic, this.scriptHash, chestId, puppetId, signer);
    }
    async lootChestWithPuppetVerified(chestId, puppetId, signer) {
        const timeout = 60000;
        let age = 0;
        const txid = await api_1.ChestAPI.lootChestWithPuppet(this.node.url, this.networkMagic, this.scriptHash, chestId, puppetId, signer);
        while (timeout >= age) {
            try {
                let res = await helpers_1.txDidComplete(this.node.url, txid, true);
                let formattedRes = helpers_1.formatter(res[0]);
                formattedRes.scriptHash = neon_core_1.u.reverseHex(neon_core_1.u.str2hexstring(formattedRes.scripHash));
                return formattedRes;
            }
            catch (e) {
                await helpers_1.sleep(1000);
                age += 1000;
            }
        }
        throw new Error("timeout exceeded");
    }
    async lootChestAsOwner(chestId, signer) {
        return api_1.ChestAPI.lootChestAsOwner(this.node.url, this.networkMagic, this.scriptHash, chestId, signer);
    }
    async getChestJSON(chestId, signer) {
        return api_1.ChestAPI.getChestJSON(this.node.url, this.networkMagic, this.scriptHash, chestId, signer);
    }
    async totalChests(name, type, signer) {
        return api_1.ChestAPI.totalChests(this.node.url, this.networkMagic, this.scriptHash, signer);
    }
}
exports.Chest = Chest;
//# sourceMappingURL=Chest.js.map