const sdk = require("../../dist")
const Neon = require("@cityofzion/neon-core")
const fs = require("fs")
var assert = require('assert');

describe("Basic System Test Suite", function() {
    this.timeout(60000);
    let wrapper, network, options

    beforeEach( async function () {
        this.timeout(0);
        //initialize the contract wrapper
        options = {
            node: "http://localhost:50012",
            scriptHash: "0x844a65210c14a764be528c0d25719c216e38eded"
        }
        wrapper = await new sdk.Character(options)
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
        const tokens = await wrapper.tokens()
        assert.equal(totalSupply, tokens.length)
    })

    it("should get the balance of an account", async () => {
        const account = new Neon.wallet.Account()
        const balance = await wrapper.balanceOf(account.address)
        assert.equal(balance, 0)
    })

    it ("should initialize the contract", async() => {
        const cozWallet = network.wallets[0].wallet
        const res = await wrapper.deploy(cozWallet.address, false, cozWallet)
        console.log(res)
    })

    it("should mint a token to the root account", async function() {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet

        const tokensOld = await wrapper.tokensOf(cozWallet.address)
        const res = await wrapper.mint(cozWallet)

        await sleep(2000)

        const tokensNew = await wrapper.tokensOf(cozWallet.address)
        assert(tokensNew.length = tokensOld.length + 1)
    })

    it("should get the tokens of the root account", async() => {
        const cozWallet = network.wallets[0].wallet
        const res = await wrapper.tokensOf(cozWallet.address)
        for (const tokenId of res) {
            const token = await wrapper.properties(tokenId)
            assert(token)
        }
    })

    it("should get all the tokens on the contract", async() => {
        const res = await wrapper.tokens()
        for (const tokenId of res) {
            const token = await wrapper.properties(tokenId)
            assert(token)
        }
    })

    it("should get the owner of a token", async() => {
        const cozWallet = network.wallets[0].wallet
        let res = await wrapper.tokensOf(cozWallet.address)
        const owner = await wrapper.ownerOf(res[0])
        assert(cozWallet.address === owner.address)
    })

    it("should roll for an initial attribute", async() => {
        const cozWallet = network.wallets[0].wallet
        const res = await wrapper.rollInitialStat()
        assert(res <= 18)
        assert(res >= 3)
    })

    it("should get the characters of the initial account", async() => {
        const cozWallet = network.wallets[0].wallet
        let res = await wrapper.tokensOf(cozWallet.address)
        for (const tokenId of res) {
            res = await wrapper.properties(tokenId)
            console.log(res)
        }
        assert(res)
    })

    it("should transfer a character to a user", async() => {
        const cozWallet = network.wallets[0].wallet
        const account = new Neon.wallet.Account('NUqoQhF9mVF7v6EeeU7YhpdSSr64cTJGD3')

        const initialTokensOfOwner = await wrapper.tokensOf(cozWallet.address)
        await wrapper.transfer(account.address, initialTokensOfOwner[0], cozWallet)

        await sleep(2000)

        const newTokensOfOwner = await wrapper.tokensOf(cozWallet.address)
        const newTokensOfReceiver = await wrapper.tokensOf(account.address)

        assert(newTokensOfOwner.indexOf(initialTokensOfOwner[0]) === -1)
        assert(newTokensOfReceiver.indexOf(initialTokensOfOwner[0]) !== -1)
    })

    it("should purchase a token", async() => {
        const cozWallet = network.wallets[0].wallet
        const initialTokensOf = await wrapper.tokensOf(cozWallet.address)
        await wrapper.purchase(cozWallet)
        await sleep(2000)
        const newTokensOf = await wrapper.tokensOf(cozWallet.address)
        assert(initialTokensOf.length < newTokensOf.length)
    })



})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}