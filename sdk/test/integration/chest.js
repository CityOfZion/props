const sdk = require("../../dist")
const Neon = require("@cityofzion/neon-js")
const fs = require("fs")
const crypto = require('crypto')
const process = require('process')

var assert = require('assert');

describe("Basic Chest Test Suite", function() {
    this.timeout(60000);
    let TIME_CONSTANT = 2000
    let chest, puppet, network

    beforeEach( async function () {
        this.timeout(0);
        //initialize the contract puppet

        const targetNetwork = sdk.types.NetworkOption.LocalNet

        chest = await new sdk.Chest({
            network: targetNetwork
        })
        puppet = await new sdk.Puppet({
            network: targetNetwork
        })
        await chest.init()
        await puppet.init()


        //load any wallets and network settings we may want later (helpful if we're local)
        network = JSON.parse(fs.readFileSync("../default.neo-express").toString());
        network.wallets.forEach( (walletObj) => {
            walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
        })
    })

    it("should get the total supply", async () => {
        const totalSupply = await chest.totalChests()
        console.log(totalSupply)
        assert(totalSupply >= 0)
    })

    it("should create a new chest", async () => {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet

        const oldChestCount = await chest.totalChests()

        // create a chest and get the json
        const eligibilityCases = [
            {
                scriptHash: puppet.scriptHash.slice(2),
                attributes: [{
                    logic: 'e',
                    key: 'traits.color',
                    value: 'blue'
                }]
            }
        ]

        const txid = await chest.createChest("A test chest",
            0,
            eligibilityCases,
            cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        const res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
        console.log(res[0])

        const chestJSON = await chest.getChestJSON(res[0])
        console.log(JSON.stringify(chestJSON, null, 2))

        const newChestCount = await chest.totalChests()
        console.log(oldChestCount, newChestCount)
        assert(newChestCount === oldChestCount + 1)
    })

    it("should create a new chest and transfer some NFTs to it", async() => {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet

        const contractAddress = Neon.wallet.getAddressFromScriptHash(chest.scriptHash.slice(2))
        let puppetTokens = await puppet.tokensOf(cozWallet.address)
        const oldBalance = await puppet.balanceOf(cozWallet.address)
        const eligibilityCases = [
            {
                scriptHash: puppet.scriptHash.slice(2),
                attributes: [{
                    logic: 'e',
                    key: 'traits.color',
                    value: 'blue'
                }]
            }
        ]

        console.log("puppet balance: ", oldBalance)

        let txid = await chest.createChest("A test chest",
            1,
            eligibilityCases,
            cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        let res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
        console.log(`new chest: ${res[0]}`)
        let chestJSON = await chest.getChestJSON(res[0])


        //Transfer to the chest
        const transferAmount = 5
        const txids = []
        for (let i = 0; i < transferAmount; i++) {
            await puppet.transfer(contractAddress, puppetTokens[i], cozWallet, [res[0]])
        }

        await sdk.helpers.sleep(2000)
        for (let txid of txids) {
            await sdk.helpers.txDidComplete(chest.node.url, txid, true)
        }

        const newPuppetBalance = await puppet.balanceOf(cozWallet.address)
        assert(newPuppetBalance === oldBalance - transferAmount)

        chestJSON = await chest.getChestJSON(res[0])
        assert(chestJSON.loot_available === transferAmount)
        console.log("new chest", chestJSON)
    })

    it("should create a new chest and transfer some GAS to it", async() => {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet


        const contractAddress = Neon.wallet.getAddressFromScriptHash(chest.scriptHash.slice(2))

        const transferAmount = 10 * 10**8
        const amountPerReservoirItem = 1 * 10**8
        const eligibilityCases = [
            {
                scriptHash: puppet.scriptHash.slice(2),
                attributes: [{
                    logic: 'e',
                    key: 'traits.color',
                    value: 'blue'
                }]
            }
        ]

        let txid = await chest.createChest("A test chest",
            0,
            eligibilityCases,
            cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        let res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
        console.log(`new chest: ${res[0]}`)
        let chestJSON = await chest.getChestJSON(res[0])
        console.log(chestJSON)

        //transfer some GAS
        const params = [
            Neon.sc.ContractParam.hash160(cozWallet.address),
            Neon.sc.ContractParam.hash160(contractAddress),
            Neon.sc.ContractParam.integer(transferAmount),
            //Neon.sc.ContractParam.any('')
            Neon.sc.ContractParam.array(
                Neon.sc.ContractParam.integer(res[0]),
                Neon.sc.ContractParam.integer(amountPerReservoirItem)
            )
        ]
        txid = await sdk.api.NeoInterface.publishInvoke(chest.node.url, chest.networkMagic,
            "0xd2a4cff31913016155e38e474a2c06d08be276cf",
            "transfer",
            params,
            cozWallet
        );

        await sdk.helpers.sleep(TIME_CONSTANT)
        let resB = await sdk.helpers.txDidComplete(chest.node.url, txid, true)

        chestJSON = await chest.getChestJSON(res[0])
        console.log(chestJSON)

    })

    //verify eligibility

    it("should attempt to loot an empty chest as the author", async () => {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet

        // create a chest and get the json
        let txid = await chest.createChest("A test chest",
            0,
            [1],
            {
                color: 'blue'
            },
            cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        let res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)

        try {
            txid = await chest.lootChestAsOwner(res[0], cozWallet)
            await sdk.helpers.sleep(TIME_CONSTANT)
            res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
            assert.fail()
        } catch {}
    })

    it("should attempt to loot an empty chest with a puppet", async () => {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet
        let puppetTokens = await puppet.tokensOf(cozWallet.address)
        // create a chest and get the json
        let txid = await chest.createChest("A test chest",
            1,
            [1],
            {
                color: 'blue'
            },
            cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        let res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
        const chestJSON = await chest.getChestJSON(res[0])
        console.log(chestJSON)

        let eligibility = await chest.isPuppetEligible(res[0], puppetTokens[0])
        console.log(`is eligible: ${eligibility}`)

        try {
            txid = await chest.lootChestWithPuppet(res[0], puppetTokens[0], cozWallet)
            await sdk.helpers.sleep(TIME_CONSTANT)
            res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
            assert.fail()
        } catch {}
    })

    it("should loot a chest as the owner (NEP-11)", async() => {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet
        const chestId = 2

        //get the original puppet balance and chest balance
        let puppetBalance = await puppet.balanceOf(cozWallet.address)
        let chestJSON = await chest.getChestJSON(chestId)
        console.log(puppetBalance)
        console.log(chestJSON)

        let txid = await chest.lootChestAsOwner(chestId, cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        let res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
        console.log(`Chest response: ${JSON.stringify(res[0])}`)

        let newChestJSON = await chest.getChestJSON(chestId)
        console.log(newChestJSON)

        puppetBalance = await puppet.balanceOf(cozWallet.address)
        console.log(puppetBalance)
    })

    it("should loot a chest as the owner (NEP-17)", async() => {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet
        const chestId = 1

        const rpcClient = new Neon.rpc.RPCClient(chest.node.url);


        //get the original balance and chest balance
        const oldbalances = await rpcClient.getNep17Balances(cozWallet.address)
        let chestJSON = await chest.getChestJSON(chestId)

        console.log(`GAS: ${oldbalances.balance[0].amount}`)
        console.log(chestJSON)

        let txid = await chest.lootChestAsOwner(chestId, cozWallet)
        await sdk.helpers.sleep(TIME_CONSTANT)
        let res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
        console.log(`Chest response: ${JSON.stringify(res[0])}`)

        let newChestJSON = await chest.getChestJSON(chestId)
        console.log(newChestJSON)

        const newbalances = await rpcClient.getNep17Balances(cozWallet.address)
        console.log(`GAS: ${newbalances.balance[0].amount}`)
        assert(newbalances.balance[0].amount > oldbalances.balance[0].amount)
        assert(chestJSON.loot_available > newChestJSON.loot_available)
    })

    it("should loot a chest using an eligible puppet", async() => {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet
        const chestId = 1

        const rpcClient = new Neon.rpc.RPCClient(chest.node.url);

        const puppets = await puppet.tokensOf(cozWallet.address)
        let txids = []
        //test puppets with blue and green traits
        for (let p of puppets) {
            let props = await puppet.getPuppetJSON(p.toString())
            let absoluteEligibility = props.traits.color === 'blue'
            if (absoluteEligibility) {
                console.log('found one', props)
                let txid = await chest.lootChest(chestId, puppet.scriptHash.slice(2), p.toString(), cozWallet)
                await sdk.helpers.sleep(TIME_CONSTANT)
                let res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
                break
            }
            else {
                console.log("miss")
            }
        }
    })

    //verify
    it("should loot a chest using an ineligible puppet", async() => {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet
        const chestId = 1

        const rpcClient = new Neon.rpc.RPCClient(chest.node.url);

        const puppets = await puppet.tokensOf(cozWallet.address)
        let txids = []
        //test puppets with blue and green traits
        for (let p of puppets) {
            let props = await puppet.getPuppetJSON(p.toString())
            let eligibility = await chest.isEligible(chestId, p.toString())
            let absoluteEligibility = props.traits.color === 'blue'
            console.log(props.traits.color, eligibility, absoluteEligibility)
            assert(eligibility === absoluteEligibility)

            if (!eligibility) {
                let txid = await chest.lootChest(chestId, p.toString(), cozWallet)
                txids.push(txid)
            }
        }

        await sdk.helpers.sleep(TIME_CONSTANT)

        for (let txid of txids) {
            console.log(txid)
            let res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
            console.log(`Chest response: ${JSON.stringify(res[0])}`)
        }
    })

    //verify
    it("should loot a chest using an eligible token which has already minted", async() => {
        this.timeout(0)
        const cozWallet = network.wallets[0].wallet
        const chestId = "\u0001"

        const rpcClient = new Neon.rpc.RPCClient(chest.node.url);

        const puppets = await puppet.tokensOf(cozWallet.address)
        let txids = []
        //test puppets with blue and green traits
        for (let p of puppets) {
            let props = await puppet.getPuppetJSON(p.toString())
            let eligibility = await chest.isPuppetEligible(chestId, p.toString())
            let absoluteEligibility = props.traits.color === 'blue'
            console.log(props.traits.color, eligibility, absoluteEligibility)
            assert(eligibility === absoluteEligibility, props.traits.color)


            if (eligibility) {
                let txid = await chest.lootChestWithPuppet(chestId, p.toString(), cozWallet)
                txids.push(txid)
            }
        }

        await sdk.helpers.sleep(TIME_CONSTANT)

        for (let txid of txids) {
            console.log(txid)
            let res = await sdk.helpers.txDidComplete(chest.node.url, txid, true)
            console.log(`Chest response: ${JSON.stringify(res[0])}`)
        }
    })

})
