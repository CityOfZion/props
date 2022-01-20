const Neon = require("@cityofzion/neon-core")
const sdk = require('../sdk/dist')
const fs = require('fs')

async function main(node, pathToNEF, privateKey, timeConstant) {

    const rpcNode = new Neon.rpc.RPCClient(node)
    const getVersionRes = await rpcNode.getVersion()
    const networkMagic = getVersionRes.protocol.network

    const txid = await sdk.helpers.deployContract(node, networkMagic, pathToNEF, privateKey)
    await sdk.helpers.sleep(timeConstant)
    await sdk.helpers.txDidComplete(node, txid, true)
}

const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
const node = process.argv[2] || 'http://localhost:50012'
const pkey = process.argv[3] || network.wallets[0].accounts[0]['private-key']
const signer = new Neon.wallet.Account(pkey)
const timeConstant = process.argv[4] || 5000

main(node,'contracts/dice/props.dice.nef', signer, timeConstant)
main(node,'contracts/collection/props.collection.nef', signer, timeConstant)
main(node,'contracts/generator/props.generator.nef', signer, timeConstant)
main(node,'contracts/puppet/props.puppet.nef', signer, timeConstant)
