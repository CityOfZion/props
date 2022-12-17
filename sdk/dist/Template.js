"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const lodash_1 = require("lodash");
const neon_core_1 = require("@cityofzion/neon-core");
const api_1 = require("./api");
const interface_1 = require("./interface");
const DEFAULT_OPTIONS = {
    network: interface_1.NetworkOption.LocalNet
};
/**
  TEMPLATE CONTRACT CLASS
  Use this class template to build out the typescript interface for your smart contract.  If you rename this or the
  `api` equivalent, make sure to update the respective `index.ts` and rebuild.
 */
class Template {
    // Once you get a scriptHash from deploying your smart contract via `npm run deploy`, update the `this.options.scriptHash` value.
    // The default is analogous to localnet (neo-express) so you will most likely want to be updating that value.  Remember to
    // compile the sdk before use or your change wont take effect.  Do that by running `tsc` in the sdk directory.
    constructor(options = {}) {
        this.options = DEFAULT_OPTIONS;
        this.networkMagic = -1;
        switch (options.network) {
            case interface_1.NetworkOption.TestNet:
                this.options.node = 'https://testnet1.neo.coz.io:443';
                this.options.scriptHash = '0x4380f2c1de98bb267d3ea821897ec571a04fe3e0';
                break;
            case interface_1.NetworkOption.MainNet:
                this.options.node = 'https://mainnet1.neo.coz.io:443';
                this.options.scriptHash = '0x4380f2c1de98bb267d3ea821897ec571a04fe3e0';
                break;
            default:
                this.options.node = 'http://localhost:50012';
                this.options.scriptHash = '0x16d6a0be0506b26e0826dd352724cda0defa7131';
                break;
        }
        this.options = (0, lodash_1.merge)({}, this.options, options);
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
    async templateMethod(paramA, paramB, paramC, paramD, paramE, signer) {
        return api_1.TemplateAPI.templateMethod(this.node.url, this.networkMagic, this.scriptHash, paramA, paramB, paramC, paramD, paramE, signer);
    }
}
exports.Template = Template;
//# sourceMappingURL=Template.js.map