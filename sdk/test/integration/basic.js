const sdk = require("../../dist")
const Neon = require("@cityofzion/neon-core")
const fs = require("fs")
var assert = require('assert');

describe("Basic System Test Suite", () => {
    let node, contracts, network

    beforeEach( async function () {

        node = "http://localhost:50012"
        contracts = {
            "nep11": "0x3f57010287f648889d1ce5264d4fa7839fdab000"
        }
        network = JSON.parse(fs.readFileSync("../default.neo-express").toString());

        network.wallets.forEach( (walletObj) => {
            walletObj.wallet = new Neon.wallet.Account(walletObj.accounts['private-key'])
        })
    })

    it("should get the token symbol", async () => {
        const symbol = await sdk.api.Nep11.symbol(node, network.magic, contracts.nep11)
        assert.equal('ISN', symbol)
    })

})