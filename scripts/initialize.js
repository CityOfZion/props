const sdk = require('../sdk/dist')
const fs = require('fs')
const Neon = require("@cityofzion/neon-core")

async function main(node, signer, timeConstant) {
    let result, txid

    const puppet = await new sdk.Puppet({node})
    await puppet.init()

    const collection = await new sdk.Collection()
    await collection.init()

    const generator = await new sdk.Generator()
    await generator.init()

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
        '//////////GENERATOR///////////////\n' +
        '//////////GENERATOR///////////////\n' +
        '//////////GENERATOR///////////////\n'
    )

    console.log('\nDeploying all generators: ')
    basePath = 'parameters/generators'
    files = fs.readdirSync(basePath)

    for await (let file of files) {
        console.log("Creating Generator: " + file)
        const txids = await generator.createGeneratorFromFile(basePath + '/' + file, signer, timeConstant)
        await sdk.helpers.sleep(timeConstant)
        for await (txid of txids) {
            let result = await sdk.helpers.txDidComplete(node, txid, true)
            console.log("  id: ", result[0], '\n')
        }
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
}

const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
const node = process.argv[2] || 'http://localhost:50012'
const pkey = process.argv[3] || network.wallets[0].accounts[0]['private-key']
const signer = new Neon.wallet.Account(pkey)
const timeConstant = process.argv[4] || 5000

main(node, signer, timeConstant)