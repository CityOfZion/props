const sdk = require("../../dist")
const Neon = require("@cityofzion/neon-core")
const fs = require("fs")
var assert = require('assert');

describe("Basic System Test Suite", function() {
    this.timeout(0);
    let epoch, collection, network, NODE

    beforeEach( async function () {
        this.timeout(0);
        //initialize the contract puppet
        NODE = 'http://localhost:50012'

        epoch = await new sdk.Epoch({node: NODE})
        await epoch.init()

        collection = await new sdk.Collection({node: NODE})
        await collection.init()

        //load any wallets and network settings we may want later (helpful if we're local)
        network = JSON.parse(fs.readFileSync("../default.neo-express").toString());
        network.wallets.forEach( (walletObj) => {
            walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
        })
    })

    it("should create an epoch from a collection set it as active", async() => {
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
        await sleep(2000)
        await txDidComplete(NODE, res)

        //Set the current Epoch
        console.log("set epoch: ")
        const epoch_id = await puppet.totalEpochs()
        res = await puppet.setCurrentEpoch(epoch_id, cozWallet)
        await sleep(2000)
        await txDidComplete(NODE, res)

        const currentEpoch = await puppet.getCurrentEpoch()
        assert.equal(currentEpoch, epoch_id)
    })

    //test to get the epoch and validate fields

    it("should get the total epochs", async() => {
        const total = await epoch.totalEpochs()
        console.log(total)
        assert(total > 0)
    })

    it("should mint from an epoch", async() => {
        const cozWallet = network.wallets[0].wallet
        const epoch_id = await epoch.totalEpochs()

        const txids = []
        const mintCount = 10

        for (let i = 0; i < mintCount; i++) {
            const txid = await epoch.mintFromEpoch(epoch_id, cozWallet)
            txids.push(txid)
        }
        await sdk.helpers.sleep(4000)

        const res = []
        for (let txid of txids) {
            const traits = await sdk.helpers.txDidComplete(NODE, txid)
            console.log(traits)
            //res.push(traits[0].color)
        }

        /*
        const hist = {}
        for (const num of res) {
            hist[num] = hist[num] ? hist[num] + 1 : 1;
        }
        console.log(hist)

         */
    })


    it("should create an epoch using a collection", async() => {
        const cozWallet = network.wallets[0].wallet


        const collectionId = await collection.totalCollections()
        const initialCollection = await collection.getCollectionJSON(collectionId)

        const newEpoch = [
            {
                "drop_score": 500,
                "unique": true,
                "traits": []
            },
            {
                "drop_score": 1000,
                "unique": true,
                "traits": []
            }]

        j = 0
        initialCollection.values.forEach((value, i) => {
            if (i < 100) {
                newEpoch[i % 2].traits.push({
                    "collection_id": collectionId,
                    "index": i
                })


            }
        })

        const res = await epoch.createEpoch("testEpoch", 3, newEpoch, cozWallet)
        await sleep(2000)
        await txDidComplete(NODE, res)

        const epoch_id = await epoch.totalEpochs()
        const res2 = await epoch.getEpochJSON(epoch_id)
        initialCollection.values.forEach( (value, i) => {
            console.log(res2)
            assert.equal(value, initialCollection.values[res2.trait_levels[i%2].traits[(Math.floor(i/2))]['index']])
        })
    })

})
