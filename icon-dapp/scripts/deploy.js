import { wallet, rpc, sc } from "@cityofzion/neon-core";
import { experimental } from "@cityofzion/neon-js";
import { NeonParser } from '../sdk/dist/helpers/NeonParser.js';
import fs from 'fs';


// To change default parameters add more args when calling the script
// yarn deploy [nef path] [node] [private key] [block time]
// e.g.: yarn deploy C:\\Users\\Test\\icondapp.nef https://testnet1.neo.coz.io:443 L2hYhdr4zDf9Mj5iZMmPLY9WzSiUrnHsGWrEW5zVyzjYztys1piq
const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
const nefPath = process.argv[2] || 'contract\\icondapp.nef'
const NODE = process.argv[3] || 'http://localhost:50012'
const PRIVATE_KEY = process.argv[4] || network.wallets[0].accounts[0]['private-key']
const SIGNER = new wallet.Account(PRIVATE_KEY)
const TIME_CONSTANT = process.argv[5] || 15000


async function deploy(){

    const rpcNode = new rpc.RPCClient(NODE)
    const getVersionRes = await rpcNode.getVersion()
    const networkMagic = getVersionRes.protocol.network
    
    const nef = sc.NEF.fromBuffer(fs.readFileSync(nefPath))

    const rawManifest = fs.readFileSync(nefPath.replace('.nef', '.manifest.json'))
    const manifest = sc.ContractManifest.fromJson(JSON.parse(rawManifest.toString()))

    const txid = await experimental.deployContract(nef, manifest, {networkMagic, rpcAddress: NODE, account: SIGNER})

    // Wait deploy
    console.log(`Deployment transaction ID: ${txid}`)
    await new Promise(resolve => setTimeout(resolve, TIME_CONSTANT))

    const tx = await rpcNode.getApplicationLog(txid)

    console.log('GAS consumed: ', parseInt((await tx).executions[0].gasconsumed) / 10 ** 8)
    await tx.executions[0].notifications.map( (n) => {
        const notification = NeonParser.formatResponse(n.state)
        const res = {
            'eventName': n.eventname,
            'value': notification
        }
        console.log(`event: ${n.eventname}`)
        console.log(`  payload: ${JSON.stringify(notification)}`)
        return res
    })

    if (tx.executions[0].vmstate !== "HALT") {
        throw new Error((tx.executions[0]).exception)
    }
}

await deploy()
