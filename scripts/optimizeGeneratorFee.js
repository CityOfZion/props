const sdk = require('../sdk/dist')
const fs = require('fs')
const Neon = require("@cityofzion/neon-core")


const NODE = 'http://localhost:50012'
const TIME_CONSTANT = 2000

//load any wallets and network settings we may want later (helpful if we're local)
const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
network.wallets.forEach( (walletObj) => {
    walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
})

async function main(generatorId, timeConstant) {
    const signer = network.wallets[0].wallet

    const generator = await new sdk.Generator({node: NODE})
    await generator.init()

    let feeRange = [0, 10**9]
    let fee
    let res
    while(1) {
        fee = (feeRange[0] + feeRange[1]) / 2
        console.log(`running ${fee / 10**8} GAS`)

        res = await testFee(generator, generatorId, fee, timeConstant, NODE, signer)

        console.log(`  ${res}`)

        if (!res) {
            feeRange[0] = fee
        }
        else {
            feeRange[1] = fee
        }

        if ((feeRange[1] - feeRange[0]) < (0.001 * 10**8)) {
            console.log(`Optimized generator fee: ${feeRange[1]} | ${feeRange[1] / 10**8} GAS`)
            return
        }
    }
}


async function testFee(generator, generatorId, fee, timeConstant, node, signer) {

    let txid = await generator.createInstance(generatorId, signer)
    await sdk.helpers.sleep(timeConstant)
    const giid = await sdk.helpers.txDidComplete(node, txid)

    txid = await generator.setInstanceFee(giid[0], fee, signer)
    await sdk.helpers.sleep(timeConstant)
    await sdk.helpers.txDidComplete(node, txid)

    try {
        //mint using the fee
        const txids = []
        for (let i = 0; i < 100; i++) {
            const txid = await generator.mintFromInstance(giid[0], signer)
            txids.push(txid)
        }
        await sdk.helpers.sleep(timeConstant)

        for (let txid of txids) {
            await sdk.helpers.txDidComplete(NODE, txid)
        }
        return true
    } catch(e) {
        return false
    }
}


main(1, TIME_CONSTANT)
