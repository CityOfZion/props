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

    it("should get the total generators", async() => {
        const total = await generator.totalGenerators()
        console.log(total)
        assert(total > 0)
    })

    // TODO: create a new generator with all unique field, then sample and verify uniqueness
    it("should create a new generator instance and mint from it, verifying uniqueness", async() => {
        const cozWallet = network.wallets[0].wallet
        const generator_id = 1 //assumes generator 1 is the puppeteer generator

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

    //test unauthenticated minting

    //add second minter

    //test authenticated second user minting

    //test get generator instance

    //test get generator

    //test setting instance fee and purchase

    //test get total generators

    //test epoch total supply

    //test iterator over all generators

    //test iterate over all generator instances

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
