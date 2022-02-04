const sdk = require("../../dist")
const Neon = require("@cityofzion/neon-js")
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

        const gid = await buildGenerator(dropRate, maxTraits, -1, NODE, TIME_CONSTANT, cozWallet)

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
        const cozWallet = network.wallets[0].wallet

        const maxTraits = 5
        const dropRate = 0.5

        const totalOriginal = await generator.totalGenerators()
        await buildGenerator(dropRate, maxTraits, -1, NODE, TIME_CONSTANT, cozWallet)
        const newTotal = await generator.totalGenerators()
        assert(newTotal === (totalOriginal + 1))
    })

    it("should create a new generator instance and mint from it, verifying uniqueness", async() => {
        const cozWallet = network.wallets[0].wallet


        const generator_id = await buildGenerator(1, 1, 1, NODE, TIME_CONSTANT, cozWallet)

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
            Object.keys(res[0]).forEach((key) => {
                if (masterSet[key]) {
                    masterSet[key].push(res[0][key])
                } else {
                    masterSet[key] = [res[0][key]]
                }
            })
        }
        assert(masterSet.testTrait.length === [...new Set(masterSet.testTrait)].length, masterSet.testTrait.length)

    })

    it("should evaluate authenticated instance minting", async() => {
        const cozWallet = network.wallets[0].wallet
        const otherWallet = new Neon.wallet.Account()

        //transfer GAS to a test wallet
        console.log(cozWallet.scriptHash)
        const GAS = "0xd2a4cff31913016155e38e474a2c06d08be276cf"
        let params = [
            Neon.sc.ContractParam.hash160(cozWallet.address),
            Neon.sc.ContractParam.hash160(otherWallet.address),
            Neon.sc.ContractParam.integer(100 * 10**8),
            Neon.sc.ContractParam.any('')
        ]
        let txid = await sdk.api.NeoInterface.publishInvoke(NODE, generator.networkMagic,
            "0xd2a4cff31913016155e38e474a2c06d08be276cf",
                "transfer",
                params,
                cozWallet
            );
        await sdk.helpers.sleep(TIME_CONSTANT)
        await sdk.helpers.txDidComplete(NODE,txid, false)

        //create a new generator and instance
        const generator_id = await buildGenerator(1, 1, 1, NODE, TIME_CONSTANT, cozWallet)
        txid = await generator.createInstance(generator_id, cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        const instanceId = await sdk.helpers.txDidComplete(NODE, txid )

        //test minting from the instance for a user who doesn't have access
        try {
            txid = await generator.mintFromInstance(instanceId[0], otherWallet)
            await sdk.helpers.sleep(TIME_CONSTANT)
            await sdk.helpers.txDidComplete(NODE, txid)
            assert.fail("Successful minting by unauthorized user")
        } catch (e) {}


        //add the user as a second authenticated minter
        txid = await generator.setInstanceAuthorizedUsers(instanceId[0],
            [
                cozWallet.address,
                otherWallet.address
            ], cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        await sdk.helpers.txDidComplete(NODE, txid)

        //verify that both accounts can mint
        txid = await generator.mintFromInstance(instanceId[0], otherWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        let res = await sdk.helpers.txDidComplete(NODE, txid)
        assert(res)

        txid = await generator.mintFromInstance(instanceId[0], cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        res = await sdk.helpers.txDidComplete(NODE, txid)
        assert(res)

    })

    it("should evaluate the ability to get generator instances and increment the total count", async() => {
        const cozWallet = network.wallets[0].wallet

        const totalInstances = await generator.totalGeneratorInstances()
        for (let i = 0; i < totalInstances; i++) {
            let instance = await generator.getGeneratorInstanceJSON(i + 1)
            let instanceKeys = Object.keys(instance)

            const expectedKeys = [
                'generatorId',
                'instanceId',
                'author',
                'authorizedUsers',
                'objectStorage'
            ]
            expectedKeys.forEach(key => assert(instanceKeys.indexOf(key) !== -1))
        }

        const txid = await generator.createInstance(1, cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        await sdk.helpers.txDidComplete(NODE, txid, false)
        const newTotalInstances = await generator.totalGeneratorInstances()
        assert(newTotalInstances === (totalInstances + 1))
    })

    it("should evaluate the ability to get generators and increment the total count", async() => {
        const cozWallet = network.wallets[0].wallet

        const total = await generator.totalGenerators()
        for (let i = 0; i < total; i++) {
            console.log(total, i+1)
            let g = await generator.getGeneratorJSON(i + 1)
            let generatorKeys = Object.keys(g)
            console.log(generatorKeys)
            const expectedKeys = [
                'generatorId',
                'instanceId',
                'author',
                'authorizedUsers',
                'objectStorage'
            ]
            expectedKeys.forEach(key => assert(instanceKeys.indexOf(key) !== -1))
        }
        /*

        const txid = await generator.createInstance(1, cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        await sdk.helpers.txDidComplete(NODE, txid, false)
        const newTotalInstances = await generator.totalGeneratorInstances()
        assert(newTotalInstances === (totalInstances + 1))

         */
    })

    //test get generator

    //test iterator over all generators

    //test setting instance fee (owner and non-owner)

    //create trait as non-owner

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

    async function buildGenerator(dropRate, maxTraits, maxMint, NODE, timeConstant, signer) {
        const generator = await new sdk.Generator({node: NODE})
        await generator.init()

        const collection = await new sdk.Collection({node: NODE})
        await collection.init()

        const cid = await createCollection(collection, NODE, timeConstant, signer)

        const initialCollection = await collection.getCollectionJSON(cid)

        const traits = initialCollection.values.map((value, i) => {
            return {
                "type": 0,
                "maxMint": maxMint,
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
