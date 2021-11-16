const sdk = require("../../dist")
const Neon = require("@cityofzion/neon-core")
const fs = require("fs")
var assert = require('assert');

describe("Basic System Test Suite", () => {
    let wrapper, network, options

    beforeEach( async function () {
        this.timeout(0);
        //initialize the contract wrapper
        const options = {
            node: "http://localhost:50012",
            scriptHash: "0x2d45fa4996c7a199fb813431dd9cd4ae14bb41cb"
        }
        wrapper = await new sdk.Nep11Wrapper(options)
        await wrapper.init()


        //load any wallets and network settings we may want later (helpful if we're local)
        network = JSON.parse(fs.readFileSync("../default.neo-express").toString());
        network.wallets.forEach( (walletObj) => {
            walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
        })
    })

    it("should get the token symbol", async () => {
        const symbol = await wrapper.symbol()
        assert.equal(symbol, 'ISN')
    })

    it("should get the decimals", async () => {
        const decimals = await wrapper.decimals()
        assert.equal(decimals, 0)
    })

    it("should get the total supply", async () => {
        const totalSupply = await wrapper.totalSupply()
        assert.equal(totalSupply, 0)
    })

    it("should get the balance of an account", async () => {
        const account = new Neon.wallet.Account()
        const balance = await wrapper.balanceOf(account.address)
        assert.equal(balance, 0)
    })

    it ("should initialize the contract", async() => {
        const cozWallet = network.wallets[0].wallet
        const res = await wrapper.deploy(cozWallet.address,false, cozWallet)
        console.log(res)
    })

    it("should mint a token to the root account", async() => {
        const cozWallet = network.wallets[0].wallet
        const res = await wrapper.mint("{}", "", "", cozWallet)
        console.log(res)
    })

    it("should get the tokens of the root account", async() => {
        const cozWallet = network.wallets[0].wallet
        const res = await wrapper.tokensOf(cozWallet.address)
        console.log(res)
    })

    it("should get all the tokens on the contract", async() => {
        const res = await wrapper.tokens()
        console.log(res)
    })

    it("should get the owner of a token", async() => {
        const res = await wrapper.ownerOf("01")
        console.log(res)
    })

})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}