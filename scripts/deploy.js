const Neon = require("@cityofzion/neon-core")
const sdk = require('../sdk/dist')
const fs = require('fs')

async function synchronousDeploy(node, pathToNEF, signer, timeConstant) {

    const rpcNode = new Neon.rpc.RPCClient(node)
    const getVersionRes = await rpcNode.getVersion()
    const networkMagic = getVersionRes.protocol.network

    const txid = await sdk.helpers.deployContract(node, networkMagic, pathToNEF, signer)
    await sdk.helpers.sleep(timeConstant)
    await sdk.helpers.txDidComplete(node, txid, true)
}

async function NEFHunter(dirPath) {
    const files = fs.readdirSync(dirPath)

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            NEFHunter(dirPath + "/" + file)
        } else {
            if (file.split(".").pop() === 'nef') {
                synchronousDeploy(NODE, dirPath + '/' + file, SIGNER, TIME_CONSTANT)
            }
        }
    })
}

const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
const basePath = process.argv[2] || 'contracts'
const NODE = process.argv[3] || 'http://localhost:50012'
const PRIVATE_KEY = process.argv[4] || network.wallets[0].accounts[0]['private-key']
const SIGNER = new Neon.wallet.Account(PRIVATE_KEY)
const TIME_CONSTANT = process.argv[5] || 5000

NEFHunter(basePath)
