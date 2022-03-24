const sdk = require('../sdk/dist')
const fs = require('fs')
const Neon = require("@cityofzion/neon-core")

async function main(network, signer, timeConstant) {
    let result, txid

    const puppet = await new sdk.Puppet({
            network
        })
    await puppet.init()

    const collection = await new sdk.Collection({
        network
    })
    await collection.init()

    const generator = await new sdk.Generator({
        network
    })
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
        result = await sdk.helpers.txDidComplete(collection.node.url, txid, true)
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
            let result = await sdk.helpers.txDidComplete(generator.node.url, txid, true)
            console.log("  id: ", result[0], '\n')
        }
    }
}

const networkFile = JSON.parse(fs.readFileSync("default.neo-express").toString());

//const node = process.argv[2] || 'http://localhost:50012'
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