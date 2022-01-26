const sdk = require("../../dist")
const Neon = require("@cityofzion/neon-core")
const fs = require("fs")
var assert = require('assert');

describe("Basic System Test Suite", function() {
    this.timeout(0);
    const TIME_CONSTANT = 4000
    let generator, collection, network, NODE

    beforeEach( async function () {
        this.timeout(0);
        //initialize the contract puppet
        NODE = 'http://localhost:50012'

        generator = await new sdk.Generator({node: NODE})
        await generator.init()

        collection = await new sdk.Collection({node: NODE})
        await collection.init()

        //load any wallets and network settings we may want later (helpful if we're local)
        network = JSON.parse(fs.readFileSync("../default.neo-express").toString());
        network.wallets.forEach( (walletObj) => {
            walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
        })
    })

    it("should create a simple generator from a collection and sample from it", async() => {
        const cozWallet = network.wallets[0].wallet

        const mintCount = 1000
        const maxTraits = 5
        const dropRate = 0.5

        const gid = await buildGenerator(dropRate, maxTraits, NODE, TIME_CONSTANT, cozWallet)

        let txid = await generator.createInstance(gid, cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        const giid = await sdk.helpers.txDidComplete(NODE, txid)

        console.log("minting")
        const mints = await mintFromInstance(giid[0], mintCount, cozWallet, TIME_CONSTANT, NODE)
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
        assert(chiSquared < 20, `chi-squared: ${chiSquared}`)
    })

    //test to get the generator and validate fields

    it("should get the total generators", async() => {
        const total = await generator.totalGenerators()
        console.log(total)
        assert(total > 0)
    })

    it("should mint from an generator", async() => {
        const cozWallet = network.wallets[0].wallet
        const generator_id = await generator.totalGenerators()

        const txids = []
        const mintCount = 1

        for (let i = 0; i < mintCount; i++) {
            const txid = await generator.mintFromGenerator(generator_id, cozWallet)
            txids.push(txid)
        }
        await sdk.helpers.sleep(TIME_CONSTANT)

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


    it("should create an generator using a collection", async() => {
        const cozWallet = network.wallets[0].wallet

        /*
        const collectionId = await collection.totalCollections()
        const initialCollection = await collection.getCollectionJSON(collectionId)

        const newGenerator = [
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
                newGenerator[i % 2].traits.push({
                    "collection_id": collectionId,
                    "index": i
                })


            }
        })

        const res = await generator.createGenerator("testGenerator", 3, newGenerator, cozWallet)
        await sleep(2000)
        await txDidComplete(NODE, res)
        */
        const generator_id = await generator.totalGenerators()
        const res2 = await generator.getGeneratorJSON(generator_id)
        console.log(generator_id)
        console.log(res2.traits[0].traitLevels[0])
        /*
        initialCollection.values.forEach( (value, i) => {
            console.log(res2)
            assert.equal(value, initialCollection.values[res2.trait_levels[i%2].traits[(Math.floor(i/2))]['index']])
        })

         */
    })

    //test unique
    it("should create a new generator instance and mint from it, verifying uniqueness", async() => {
        const cozWallet = network.wallets[0].wallet
        const generator_id = await generator.totalGenerators()

        const sampleCount = 300
        const masterSet = {}
        const txids = []
        let txid

        txid = await generator.createInstance(generator_id, cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        const instanceId = await sdk.helpers.txDidComplete(NODE, txid )

        for (let i = 0; i < sampleCount; i++) {
          txid = await generator.mintFromInstance(instanceId[0], cozWallet)
          txids.push(txid)
        }
        await sdk.helpers.sleep(TIME_CONSTANT)
        for (txid of txids) {
            const res = await sdk.helpers.txDidComplete(NODE, txid)
            console.log(res[0])
            Object.keys(res[0]).forEach((key) => {
                if (masterSet[key]) {
                    masterSet[key].push(res[0][key])
                } else {
                    masterSet[key] = [res[0][key]]
                }
            })
        }


        console.log(masterSet)


    })
    //test unauthenticated unique

    //add second minter

    async function createCollection(collection, NODE, timeConstant, signer) {
        const txid = await collection.createFromFile('../parameters/collections/3_traits.colors.json', signer)
        await sdk.helpers.sleep(timeConstant)
        const res = await sdk.helpers.txDidComplete(NODE, txid)
        return res[0]
    }

    async function mintFromInstance(instanceId, count, wallet, timeConstant, NODE) {
        const txids = []
        for (let i = 0; i < count; i++) {
            const txid = await generator.mintFromInstance(instanceId, wallet)
            txids.push(txid)
        }
        await sdk.helpers.sleep(timeConstant)

        const res = []
        for (let txid of txids) {
            const traits = await sdk.helpers.txDidComplete(NODE, txid, true)
            res.push(traits[0])
        }
        return res
    }

    async function buildGenerator(dropRate, maxTraits, NODE, timeConstant, signer) {
        const generator = await new sdk.Generator({node: NODE})
        await generator.init()

        const collection = await new sdk.Collection({node: NODE})
        await collection.init()

        const cid = await createCollection(collection, NODE, timeConstant, signer)

        const initialCollection = await collection.getCollectionJSON(cid)

        const traits = initialCollection.values.map((value, i) => {
            return {
                "type": 0,
                "maxMint": -1,
                "args": {
                    "collectionId": cid,
                    "index": i
                }
            }
        })
        const newGenerator = {
            'label': 'new generator',
            'baseGeneratorFee': 1000000000,
            'traits': [
                {
                    "label": "testTrait",
                    "slots": maxTraits,
                    "traitLevels": [
                        {
                            "dropScore": dropRate * 10000,
                            "traits": traits
                        }
                    ]
                }
            ]
        }
        let res = await generator.createGenerator(newGenerator, signer, timeConstant)
        await sdk.helpers.sleep(TIME_CONSTANT)
        let eid = await sdk.helpers.txDidComplete(NODE, res[0])
        return eid[0]
    }
})
