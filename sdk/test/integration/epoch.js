const sdk = require("../../dist")
const Neon = require("@cityofzion/neon-core")
const fs = require("fs")
var assert = require('assert');

describe("Basic System Test Suite", function() {
    this.timeout(0);
    const TIME_CONSTANT = 4000
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

    it("should create a simple epoch from a collection and sample from the distribution", async() => {
        const cozWallet = network.wallets[0].wallet

        const mintCount = 100
        const maxTraits = 5
        const dropRate = 0.5

        let cid = await createCollection(collection, NODE, TIME_CONSTANT, cozWallet)
        const initialCollection = await collection.getCollectionJSON(cid)

        const traits = initialCollection.values.map((value, i) => {
                return {
                        "type": 0,
                        "args": {
                            "collectionId": cid,
                            "index": i
                        }
                    }
        })

        const newEpoch = {
            'label': 'new epoch',
            'traits': [
                {
                    "label": "testTrait",
                    "slots": maxTraits,
                    "traitLevels": [
                        {
                            "dropScore": dropRate * 10000,
                            "unique": false,
                            "traits": traits
                        }
                    ]
                }
            ]
        }

        //Create the Epoch
        console.log("create epoch: ")
        let res = await epoch.createEpoch(newEpoch, cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        let eid = await sdk.helpers.txDidComplete(NODE, res)
        eid = eid[0]

        console.log("minting")
        const mints = await mintFromEpoch(eid, mintCount, cozWallet, TIME_CONSTANT, NODE)
        let t = []
        mints.forEach( (mint) => {
            t = t.concat(mint['testTrait'])
        })

        //verify mint quantity
        const traitSlots = mintCount * maxTraits
        const expectedDrops = (traitSlots * dropRate)
        const percentError = Math.abs((t.length / expectedDrops) - 1)
        assert(percentError < 0.05, percentError)

        const chiSquared = sdk.helpers.chiSquared(t)
        console.log(chiSquared)

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

    //test unique

    //test unauthenticated unique


    async function createCollection(collection, NODE, timeConstant, signer) {
        const txid = await collection.createFromFile('../parameters/collections/3_traits.colors.json', signer)
        await sdk.helpers.sleep(timeConstant)
        const res = await sdk.helpers.txDidComplete(NODE, txid, true)
        return res[0]
    }

    async function mintFromEpoch(epochID, count, wallet, timeConstant, NODE) {
        const txids = []
        for (let i = 0; i < count; i++) {
            const txid = await epoch.mintFromEpoch(epochID, wallet)
            txids.push(txid)
        }
        await sdk.helpers.sleep(timeConstant)

        const res = []
        for (let txid of txids) {
            const traits = await sdk.helpers.txDidComplete(NODE, txid)
            res.push(traits[0])
        }
        return res
    }
})
