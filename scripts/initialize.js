const sdk = require('../sdk/dist')
const fs = require('fs')
const Neon = require("@cityofzion/neon-core")

async function main(node, signer, timeConstant) {
    let result, txid

    const puppet = await new sdk.Puppet({node})
    await puppet.init()

    const collection = await new sdk.Collection()
    await collection.init()

    const epoch = await new sdk.Epoch()
    await epoch.init()


    console.log('\n' +
        '//////////COLLECTIONS///////////////\n' +
        '//////////COLLECTIONS///////////////\n' +
        '//////////COLLECTIONS///////////////\n'
    )

    //deploy all collections
    let basePath = 'parameters/collections'
    let files = fs.readdirSync(basePath)
    for await (let file of files) {
        console.log("Creating Collection: " + file)
        txid = await collection.createFromFile(basePath + '/' + file, signer)
        console.log("  txid: ", txid)
        await sdk.helpers.sleep(timeConstant)
        result = await sdk.helpers.txDidComplete(node, txid, true)
        console.log("  collection_id: ", result[0], '\n')
    }


    console.log('\n' +
        '//////////EPOCH///////////////\n' +
        '//////////EPOCH///////////////\n' +
        '//////////EPOCH///////////////\n'
    )

    console.log('\nDeploying all epochs: ')
    basePath = 'parameters/epochs'
    files = fs.readdirSync(basePath)

    for await (let file of files) {
        console.log("Creating Epoch: " + file)
        txid = await epoch.createEpochFromFile(basePath + '/' + file, signer)
        console.log("  txid: ", txid)
        await sdk.helpers.sleep(timeConstant)
        result = await sdk.helpers.txDidComplete(node, txid, true)
        console.log("  epoch_id: ", result[0], '\n')
    }


    console.log('\n' +
        '//////////PUPPET///////////////\n' +
        '//////////PUPPET///////////////\n' +
        '//////////PUPPET///////////////\n'
    )

    console.log('create the initial admin account: ')
    txid = await puppet.deploy(signer)
    console.log('  txid: ', txid)
    await sdk.helpers.sleep(timeConstant)
    result = await sdk.helpers.txDidComplete(node, txid, true)
    console.log("  response: ", result[0])

    console.log("setting epoch 1 as active")
    txid = await puppet.setCurrentEpoch(1, signer)
    await sdk.helpers.sleep(2000)
    result = await sdk.helpers.txDidComplete(node, txid, true)
    console.log('  result: ', result[0])


}

const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
const node = process.argv[2] || 'http://localhost:50012'
const pkey = process.argv[3] || network.wallets[0].accounts[0]['private-key']
const signer = new Neon.wallet.Account(pkey)
const timeConstant = process.argv[4] || 5000

main(node, signer, timeConstant)