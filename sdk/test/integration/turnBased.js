const sdk = require("../../dist")
const Neon = require("@cityofzion/neon-core")
const fs = require("fs")
var assert = require('assert');

describe("Demo: turn based game contract", function() {
    this.timeout(60000);
    let game, generator, network, TIME_CONSTANT

    beforeEach( async function () {
        this.timeout(0);
        //these scripts assume that puppets are in the coz account

        const targetNetwork = sdk.types.NetworkOption.LocalNet
        TIME_CONSTANT = 5000

        game = new sdk.TurnBased({
            network: targetNetwork
        })
        await game.init()

        generator = new sdk.Generator({
            network: targetNetwork
        })
        await generator.init()

        //load any wallets and network settings we may want later (helpful if we're local)
        network = JSON.parse(fs.readFileSync("../default.neo-express").toString());
        network.wallets.forEach( (walletObj) => {
            walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
        })
    })

    it("should initialize the generator instance", async () => {
        const signer = network.wallets[0].wallet

        console.log(`creating a generator instance with generator 2`)
        let txid = await generator.createInstance(2, signer)
        await sdk.helpers.sleep(TIME_CONSTANT)
        let result = await sdk.helpers.txDidComplete(game.node.url, txid, true)
        const generatorInstanceId = result[0]
        console.log('  Generator Instance ID: ', generatorInstanceId)
        console.log(`set mint permissions for the generator`)

        const authorizedContracts = [
            {
                'scriptHash': game.scriptHash,
                'code': 1
            }
        ]
        txid = await generator.setInstanceAuthorizedContracts(generatorInstanceId, authorizedContracts, signer)
        await sdk.helpers.sleep(TIME_CONSTANT)
        result = await sdk.helpers.txDidComplete(game.node.url, txid)
        console.log('  result: ', result[0])
    })


    it("should get the total games", async () => {
        const totalGames = await game.totalGames()
        console.log(totalGames)
    })

    it("should join a game with some puppets", async () => {
        const cozWallet = network.wallets[0].wallet

        let txids = []
        for (let tokenId of ['3','4']) {
            const txid = await game.joinGame(tokenId, cozWallet)
            txids.push(txid)
        }
        await sdk.helpers.sleep(3000)
        let res
        for (let txid of txids) {
            res = await sdk.helpers.txDidComplete(game.node.url, txid, true )
            console.log(`joined game: ${res[0]}`)
            const gameState = await game.getGameJSON(res[0])
            console.log(gameState)
        }
    })

    it("should get the total supply", async () => {
        const totalSupply = await puppet.totalSupply()
        assert(totalSupply >= 0)
    })

    //test to increment and verify it goes up

    // TODO: mint to this account, then verify the balance increments
    it("should get the balance of an account", async () => {
        const cozWallet = network.wallets[0].wallet
        const balance = await puppet.balanceOf(cozWallet.address)
        assert(balance >= 0)
    })

    it("should create an epoch from generator instance and set it as active", async() => {
        const cozWallet = network.wallets[0].wallet

        const collectionId = await collection.totalCollections()
        const initialCollection = await collection.getCollectionJSON(collectionId)

        let newEpoch = []
        let traits = []
        let dropScore = 100
        initialCollection.values.forEach((value, i) => {

            if (i <= 200) {
                traits.push({
                        "collection_id": collectionId,
                        "index": i
                    }
                )
                if (traits.length > 40) {
                    newEpoch.push({
                        "drop_score": dropScore,
                        "unique": false,
                        "traits": traits
                    })
                    dropScore += 100
                    traits = []
                }
            }
        })
        const maxTraits = 5


        //Create the Epoch
        console.log("create epoch: ")
        let res = await puppet.createEpoch("testEpoch", maxTraits, newEpoch, cozWallet)
        await sdk.helpers.sleep(2000)
        await sdk.helpers.txDidComplete(NODE, res)

        //Set the current Epoch
        console.log("set epoch: ")
        const epoch_id = await puppet.totalEpochs()
        res = await puppet.setCurrentEpoch(epoch_id, cozWallet)
        await sdk.helpers.sleep(2000)
        await sdk.helpers.txDidComplete(NODE, res)

        const currentEpoch = await puppet.getCurrentEpoch()
        assert.equal(currentEpoch, epoch_id)
    })

    //test to get the epoch and validate fields

    it("should mint a token to the root account", async function() {
        this.timeout(0)

        const cozWallet = network.wallets[0].wallet
        const tokensOld = await puppet.tokensOf(cozWallet.address)

        const res = await puppet.offlineMint(cozWallet.address, cozWallet)
        await sdk.helpers.sleep(2000)
        await sdk.helpers.txDidComplete(NODE, res, true)

        const tokensNew = await puppet.tokensOf(cozWallet.address)
        assert(tokensNew.length === (tokensOld.length + 1))
    })

    //should conduct field validation on all puppet fields

    it("should get the tokens of the root account", async() => {
        const cozWallet = network.wallets[0].wallet
        const res = await puppet.tokensOf(cozWallet.address)
        for (const tokenId of res) {
            const token = await puppet.properties(tokenId)
            assert(token)
            console.log(token)
        }
    })

    it("should get all the tokens on the contract as defined by tokens method", async() => {
        const res = await puppet.tokens()
        for (const tokenId of res) {
            const token = await puppet.properties(tokenId)
            console.log(token)
            assert(token)
        }
    })

    // method to actually get all the tokens on the contract

    it("should get the owner of a token", async() => {
        const cozWallet = network.wallets[0].wallet
        let res = await puppet.tokensOf(cozWallet.address)
        const owner = await puppet.ownerOf(res[0])
        assert(cozWallet.address === owner.address)
    })

    it("should transfer a character to a user", async() => {
        const cozWallet = network.wallets[0].wallet
        const account = new Neon.wallet.Account('NUqoQhF9mVF7v6EeeU7YhpdSSr64cTJGD3')

        const initialTokensOfOwner = await puppet.tokensOf(cozWallet.address)
        const res = await puppet.transfer(account.address, initialTokensOfOwner[0], cozWallet)
        await sdk.helpers.sleep(2000)
        await sdk.helpers.txDidComplete(NODE, res)

        const newTokensOfOwner = await puppet.tokensOf(cozWallet.address)
        const newTokensOfReceiver = await puppet.tokensOf(account.address)

        assert(newTokensOfOwner.indexOf(initialTokensOfOwner[0]) === -1)
        assert(newTokensOfReceiver.indexOf(initialTokensOfOwner[0]) !== -1)
    })

    it("should purchase a token", async() => {
        const cozWallet = network.wallets[0].wallet
        const totalSupply = await puppet.totalSupply()
        const res = await puppet.purchase(cozWallet)
        await sdk.helpers.sleep(4000)
        await sdk.helpers.txDidComplete(NODE, res)

        const newTotalSupply = await puppet.totalSupply()
        assert(totalSupply < newTotalSupply)
    })

    it("should set the initial mint fee", async() => {
        const cozWallet = network.wallets[0].wallet
        const mintFee = 100000000
        const res = await puppet.setMintFee(mintFee, cozWallet)
        await sdk.helpers.sleep(2000)
        await sdk.helpers.txDidComplete(puppet.node.url, res)

        const realizedMintFee = await puppet.getMintFee()
        assert.equal(mintFee, realizedMintFee)
    })

    it("should change the mint fee", async() => {

        const cozWallet = network.wallets[0].wallet
        const initialTotalSupply = await puppet.totalSupply()
        const initialMintFee = await puppet.getMintFee()
        console.log('mint fee: ', initialMintFee)


        let res = await puppet.purchase(cozWallet)
        await sdk.helpers.sleep(2000)
        await sdk.helpers.txDidComplete(puppet.node.url, res)

        // verify that the token was purchased
        const newTotalSupply = await puppet.totalSupply()
        assert(initialTotalSupply < newTotalSupply)


        // update the mint fee to 10 GAS
        res = await puppet.setMintFee(5 * initialMintFee, cozWallet)
        console.log('set mint fee: ', res)
        await sdk.helpers.sleep(2000)
        await sdk.helpers.txDidComplete(puppet.node.url, res)

        // verify the update persisted
        const newMintFee = await puppet.getMintFee()
        console.log('new mint fee: ', newMintFee)
        assert.equal(newMintFee, initialMintFee * 5)

        // buy a new token and verify
        res = await puppet.purchase(cozWallet)
        await sdk.helpers.sleep(2000)
        await sdk.helpers.txDidComplete(puppet.node.url, res)

        const finalTotalSupply = await puppet.totalSupply()
        assert(newTotalSupply < finalTotalSupply)

        // reset
        res = await puppet.setMintFee(initialMintFee, cozWallet)
        await sdk.helpers.sleep(2000)
        await sdk.helpers.txDidComplete(puppet.node.url, res)
    })

    it("should get the total epochs", async() => {
        const total = await puppet.totalEpochs()
        assert(total > 0)
    })

    it("should create an epoch using a collection", async() => {
        const cozWallet = network.wallets[0].wallet


        const collectionId = await collection.totalCollections()
        const initialCollection = await collection.getCollectionJSON(collectionId)

        const newEpoch = [
            {
            "drop_score": 1000,
            "unique": true,
            "traits": []
            },
            {
            "drop_score": 600,
            "unique": true,
            "traits": []
            }]

        initialCollection.values.forEach((value, i) => {
            if (i < 100) {
                newEpoch[i % 2].traits.push({
                    "collection_id": collectionId,
                    "index": i
                })
            }
        })

        const res = await puppet.createEpoch("testEpoch", 3, newEpoch, cozWallet)
        await sdk.helpers.sleep(2000)
        await sdk.helpers.txDidComplete(puppet.node.url, res)

        const epoch_id = await puppet.totalEpochs()
        const res2 = await puppet.getEpochJSON(epoch_id)
        initialCollection.values.forEach( (value, i) => {
            console.log(res2)
            assert.equal(value, initialCollection.values[res2.trait_levels[i%2].traits[(Math.floor(i/2))]['index']])
        })
    })

})
