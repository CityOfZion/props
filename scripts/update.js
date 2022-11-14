const Neon = require("@cityofzion/neon-core")
const sdk = require('../sdk/dist')
const fs = require('fs')

async function updater(targetScriptHash, pathToNEF, node, signer, timeConstant) {

    const nef = Neon.sc.NEF.fromBuffer(
        fs.readFileSync(
            pathToNEF
        )
    )

    const serializedNEF = Neon.u.HexString.fromHex(nef.serialize(), true)
    const rawManifest = fs.readFileSync(pathToNEF.replace('.nef', '.manifest.json'))

    const manifest = Neon.sc.ContractManifest.fromJson(
        JSON.parse(rawManifest.toString())
    )


    const stringifiedManifest = JSON.stringify(manifest.toJson())

    const collection = new sdk.Collection({
        node,
        scriptHash: targetScriptHash
    })
    await collection.init()

    const txid = await collection.update(serializedNEF.toBase64(true), stringifiedManifest, signer)

    await sdk.helpers.sleep(timeConstant)
    const res = await sdk.helpers.txDidComplete(node, txid, true)
    console.log(res)
}



const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
const TARGET_SCRIPT_HASH = process.argv[2]
const PATH_TO_NEF = process.argv[3]
const NODE = process.argv[4] || 'http://localhost:50012'
const privateKey = process.argv[5] || network.wallets[0].accounts[0]['private-key']
const SIGNER = new Neon.wallet.Account(privateKey)
const TIME_CONSTANT = process.argv[6] || 5000

updater(TARGET_SCRIPT_HASH, PATH_TO_NEF, NODE, SIGNER, TIME_CONSTANT)
