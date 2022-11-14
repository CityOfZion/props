import {rpc, wallet} from '@cityofzion/neon-core'
import fs from 'fs'
import {deployContract, txDidComplete, sleep} from './helpers'

async function synchronousDeploy(node, pathToNEF, signer, timeConstant) {
    const rpcNode = new rpc.RPCClient(node)
    const getVersionRes = await rpcNode.getVersion().catch(e => {console.log(e)})
    const networkMagic = getVersionRes.protocol.network

    const txid = await deployContract(node, networkMagic, pathToNEF, signer)
    await sleep(timeConstant)
    await txDidComplete(node, txid, true)
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
const SIGNER = new wallet.Account(PRIVATE_KEY)
const TIME_CONSTANT = process.argv[5] || 5000

NEFHunter(basePath)
