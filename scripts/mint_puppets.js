const sdk = require('../sdk/dist')
const fs = require('fs')
const Neon = require("@cityofzion/neon-core")

const PuppetArmySize = 50
const EPOCH_TOTAL_SUPPLY = 100


async function main(network, signer, timeConstant) {


    let txid, result

    const puppet = await new sdk.Puppet({
        network
    })
    await puppet.init()

    const generator = await new sdk.Generator({
        network
    })
    await generator.init()

    console.log(`Build me an army worthy of ${signer.address} !!!`)
    console.log(`Minting ${PuppetArmySize} puppets!`)
    console.log('This may take a while, you can watch the action on neo-express.')


    console.log(`creating a generator instance with generator 1`)
    txid = await generator.createInstance(1, signer)
    await sdk.helpers.sleep(timeConstant)
    result = await sdk.helpers.txDidComplete(puppet.node.url, txid, true)
    const generatorInstanceId = result[0]
    console.log('  Generator Instance ID: ', generatorInstanceId)

    console.log(`creating an epoch with generator instance ${generatorInstanceId}`)
    txid = await puppet.createEpoch("Puppeteer", generatorInstanceId, 1,  10 * 10**8, 40000000, EPOCH_TOTAL_SUPPLY, signer)
    await sdk.helpers.sleep(timeConstant)
    result = await sdk.helpers.txDidComplete(puppet.node.url, txid)
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
    result = await sdk.helpers.txDidComplete(puppet.node.url, txid)
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

    for (let id of txids) {
        await sdk.helpers.txDidComplete(puppet.node.url, id, true)
    }

    const totalSupply = await puppet.totalSupply()
    console.log('Puppet Supply: ', totalSupply)

    for (let i = 1; i <= totalSupply; i++) {
        let p = await puppet.properties(i.toString())
        console.log(p)
    }
}

const networkFile = JSON.parse(fs.readFileSync("default.neo-express").toString());

let target = process.argv[2]
switch (target){
    case 'TestNet':
        target = sdk.types.NetworkOption.TestNet
        break
    case 'MainNet':
        target = sdk.types.NetworkOption.MainNet
        break
    default:
        target = sdk.types.NetworkOption.LocalNet
}

const pkey = process.argv[3] || networkFile.wallets[0].accounts[0]['private-key']
const signer = new Neon.wallet.Account(pkey)
const timeConstant = process.argv[4] || 5000

main(target, signer, timeConstant)