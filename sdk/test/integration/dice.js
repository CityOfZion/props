const sdk = require("../../dist")
const Neon = require("@cityofzion/neon-core")
const fs = require("fs")
const crypto = require('crypto')
const process = require('process')

var assert = require('assert');

describe("Basic Dice Test Suite", function() {
    this.timeout(60000);
    let TIME_CONSTANT = 4000
    let dice, network, NODE

    beforeEach( async function () {
        this.timeout(0);
        //initialize the contract puppet

        NODE = 'http://localhost:50012'

        dice = await new sdk.Dice({node: NODE})
        await dice.init()


        //load any wallets and network settings we may want later (helpful if we're local)
        network = JSON.parse(fs.readFileSync("../default.neo-express").toString());
        network.wallets.forEach( (walletObj) => {
            walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
        })
    })

    it('should sample from a uniform distibution using randbetween', async function() {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet

        const runSize = 2000
        const bins = 20
        const binVals = new Array(bins).fill(0)


        const txids = []
        for (let i = 0; i < runSize; i++) {
            const res = await dice.randBetween(0, bins - 1, cozWallet)
            txids.push(res)
        }
        await sdk.helpers.sleep(TIME_CONSTANT)

        const results = []
        for (let txid of txids) {
            let result = await sdk.helpers.txDidComplete(NODE, txid)
            results.push(result[0])
        }

        // chi-squared test for uniformity
        const chiSquared = sdk.helpers.chiSquared(results)
        assert(chiSquared < 20, chiSquared)
    })

    it('should roll some fair dice using rollDie', async function() {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet

        const runSize = 2000
        const bins = 20
        const die = 'd20'

        const txids = []
        for (let i = 0; i < runSize; i++) {
            const res = await dice.rollDie(die, cozWallet)
            txids.push(res)
        }
        await sdk.helpers.sleep(TIME_CONSTANT)

        const results = []
        for (let txid of txids) {
            let result = await sdk.helpers.txDidComplete(NODE, txid)
            results.push(result[0])
        }

        // chi-squared test for uniformity
        const chiSquared = sdk.helpers.chiSquared(results)
        assert(chiSquared < 20, chiSquared)
    })
})
