import * as sdk from '../sdk/dist/IconDApp.js';
import { NeonInvoker } from '../sdk/dist/helpers/NeonInvoker.js';
import { NeonParser } from '../sdk/dist/helpers/NeonParser.js';
import fs from 'fs';
import { wallet, rpc, sc, u } from "@cityofzion/neon-core";


// To change default parameters add more args when calling the script
// yarn metadata [nef path] [node] [private key] [block time]
// e.g.: yarn metadata C:\\Users\\Test\\icondapp.nef https://testnet1.neo.coz.io:443 L2hYhdr4zDf9Mj5iZMmPLY9WzSiUrnHsGWrEW5zVyzjYztys1piq
const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
const nefPath = process.argv[2] || 'contract\\icondapp.nef'
const NODE = process.argv[3] || 'http://localhost:50012'
const PRIVATE_KEY = process.argv[4] || network.wallets[0].accounts[0]['private-key']
const SIGNER = new wallet.Account(PRIVATE_KEY)
const TIME_CONSTANT = process.argv[5] || 15000


async function setInitialMetadata(){

    const nef = sc.NEF.fromBuffer(fs.readFileSync(nefPath))

    const rawManifest = fs.readFileSync(nefPath.replace('.nef', '.manifest.json'))
    const manifest = sc.ContractManifest.fromJson(JSON.parse(rawManifest.toString()))

    const assembledScript = (new sc.ScriptBuilder()
        .emit(sc.OpCode.ABORT)
        .emitPush(u.HexString.fromHex(SIGNER.scriptHash))
        .emitPush(nef.checksum)
        .emitPush(manifest.name)
        .build()
    )
    const scriptHash = u.reverseHex(u.hash160(assembledScript))

    const iconDappConfig = {
        rpcAddress: NODE,
        networkMagic: await NeonInvoker.getMagicOfRpcAddress(NODE),
        scriptHash: scriptHash,
        invoker: NeonInvoker,
        parser: NeonParser,    
    }
    const iconDapp = new sdk.IconDApp(iconDappConfig)
    
    const invocations = []

    invocations.push(sdk.buildAddPropertyInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            propertyName: "icon/25x25",
            description: "PLACEHOLDER DESCRIPTION: Icon with a 25x25 pixels resolution"
        }
    ))
   
    invocations.push(sdk.buildAddPropertyInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            propertyName: "icon/288x288",
            description: "PLACEHOLDER DESCRIPTION: Icon with a 288x288 pixels resolution"
        }
    ))

    // Set NEO 25x25 icon
    invocations.push(sdk.buildSetMetaDataInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            scriptHash: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
            propertyName: 'icon/25x25',
            value: 'https://icon-dapp.s3.amazonaws.com/25x25/Neo.png',
        }
    ))
    // Set NEO 288x288 icon
    invocations.push(sdk.buildSetMetaDataInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            scriptHash: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
            propertyName: 'icon/288x288',
            value: 'https://icon-dapp.s3.amazonaws.com/288x288/Neo.png',
        }
    ))
    
    // Set GAS 25x25 icon
    invocations.push(sdk.buildSetMetaDataInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
            propertyName: 'icon/25x25',
            value: 'https://icon-dapp.s3.amazonaws.com/25x25/GAS.png',
        }
    ))
    // Set GAS 288x288 icon
    invocations.push(sdk.buildSetMetaDataInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
            propertyName: 'icon/288x288',
            value: 'https://icon-dapp.s3.amazonaws.com/288x288/GAS.png',
        }
    ))
    
    // Set FLM 25x25 icon
    invocations.push(sdk.buildSetMetaDataInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            scriptHash: '0xf0151f528127558851b39c2cd8aa47da7418ab28',
            propertyName: 'icon/25x25',
            value: 'https://icon-dapp.s3.amazonaws.com/25x25/Flamingo_Finance.png',
        }
    ))
    // Set FLM 288x288 icon
    invocations.push(sdk.buildSetMetaDataInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            scriptHash: '0xf0151f528127558851b39c2cd8aa47da7418ab28',
            propertyName: 'icon/288x288',
            value: 'https://icon-dapp.s3.amazonaws.com/288x288/Flamingo_Finance.png',
        }
    ))
    
    // Set Burger 25x25 icon
    invocations.push(sdk.buildSetMetaDataInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            scriptHash: '0x48c40d4666f93408be1bef038b6722404d9a4c2a',
            propertyName: 'icon/25x25',
            value: 'https://icon-dapp.s3.amazonaws.com/25x25/NeoBurger.png',
        }
    ))
    // Set Burger 288x288 icon
    invocations.push(sdk.buildSetMetaDataInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            scriptHash: '0x48c40d4666f93408be1bef038b6722404d9a4c2a',
            propertyName: 'icon/288x288',
            value: 'https://icon-dapp.s3.amazonaws.com/288x288/NeoBurger.png',
        }
    ))
    
    // Set GrantSharesGov 25x25 icon
    invocations.push(sdk.buildSetMetaDataInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            scriptHash: '0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9',
            propertyName: 'icon/25x25',
            value: 'https://icon-dapp.s3.amazonaws.com/25x25/GrantShares.png',
        }
    ))
    // Set GrantSharesGov 288x288 icon
    invocations.push(sdk.buildSetMetaDataInvocation(
        scriptHash,
        iconDappConfig.parser,
        {
            scriptHash: '0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9',
            propertyName: 'icon/288x288',
            value: 'https://icon-dapp.s3.amazonaws.com/288x288/GrantShares.png',
        }
    ))
    
    // Set GrantSharesTreasury as child of GrantSharesGov
    invocations.push(sdk.buildSetContractParentInvocation(
        scriptHash,
        {
            childHash: '0x6276c1e3a68280bc6c9c00df755fb691be1162ef',
            parentHash: '0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9',
        }
    ))


    const txid = await iconDapp.invokeFunction(SIGNER, {invocations, signers: []})

    console.log(`Setting metadata transaction ID: ${txid}`)

    // Wait setting metadata
    await new Promise(resolve => setTimeout(resolve, TIME_CONSTANT))
        
    const tx = await new rpc.RPCClient(NODE).getApplicationLog(txid)

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

await setInitialMetadata()
