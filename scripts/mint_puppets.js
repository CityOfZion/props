const sdk = require('../sdk/dist')
const fs = require('fs')
const Neon = require("@cityofzion/neon-core")


const NODE = 'http://localhost:50012'
const TIME_CONSTANT = 4000
const PuppetArmySize = 10
const EPOCH_TOTAL_SUPPLY = 100


//load any wallets and network settings we may want later (helpful if we're local)
const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
network.wallets.forEach( (walletObj) => {
    walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
})

async function main(timeConstant) {


    let txid, result

    const signer = network.wallets[0].wallet

    const puppet = await new sdk.Puppet({node: NODE})
    await puppet.init()

    const generator = await new sdk.Generator({node: NODE})
    await generator.init()

    console.log(`Build me an army worthy of ${signer.address} !!!`)
    console.log(`Minting ${PuppetArmySize} puppets!`)
    console.log('This may take a while, you can watch the action on neo-express.')


    console.log(`creating a generator instance with generator 1`)
    txid = await generator.createInstance(1, signer)
    await sdk.helpers.sleep(timeConstant)
    result = await sdk.helpers.txDidComplete(NODE, txid, true)
    const generatorInstanceId = result[0]
    console.log('  Generator Instance ID: ', generatorInstanceId)

    console.log(`creating an epoch with generator instance ${generatorInstanceId}`)
    txid = await puppet.createEpoch("Puppeteer", result[0], 1 * 10**8, 40000000, EPOCH_TOTAL_SUPPLY, signer)
    await sdk.helpers.sleep(timeConstant)
    result = await sdk.helpers.txDidComplete(NODE, txid)
    const epochId = result[0]
    console.log('  epoch ID: ', epochId)

    console.log(`set mint permissions for the generator`)

    const authorizedContracts = [
        {
            'scriptHash': puppet.scriptHash,
            'code': epochId
        }
    ]
    txid = await generator.setInstanceAuthorizedContracts(generatorInstanceId, authorizedContracts, signer)
    await sdk.helpers.sleep(timeConstant)
    result = await sdk.helpers.txDidComplete(NODE, txid)
    console.log('  result: ', result[0])

    const txids = []
    for (let i = 0; i < PuppetArmySize; i++) {
        txid = await puppet.offlineMint(epochId, signer.address, signer)
        txids.push(txid)
        if (i % (PuppetArmySize / 100) === 0) {
            const totalSupply = await puppet.totalSupply()
            console.log(totalSupply, " PUPPETS!!!")
        }
    }
    await sdk.helpers.sleep(timeConstant)

    const totalSupply = await puppet.totalSupply()
    console.log('Puppet Supply: ', totalSupply)

    for (let id of txids) {
        await sdk.helpers.txDidComplete(NODE, id, true)
    }

    for (let i = 1; i <= totalSupply; i++) {
        let p = await puppet.properties(i.toString())
        console.log(p)
    }
}
main(TIME_CONSTANT)