import * as sdk from '../sdk/dist'
import fs from 'fs'
import {wallet} from '@cityofzion/neon-core'
import {exec as _exec} from 'child_process'
import {txDidComplete, sleep} from './helpers'
import { NeonParser } from '@cityofzion/neon-parser'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import * as util from 'util'

const PuppetArmySize = 50
const EPOCH_TOTAL_SUPPLY = 100


async function main(network, signer, timeConstant) {
    let txid, result
    const exec = util.promisify(_exec)

    let stdout = (await exec('neoxp contract get "Puppet"')).stdout
    let neoxpContract = JSON.parse(stdout)[0]
    const scriptHashPuppet = neoxpContract.hash

    stdout = (await exec('neoxp contract get "Generator"')).stdout
    neoxpContract = JSON.parse(stdout)[0]
    const scriptHashGenerator = neoxpContract.hash

    const puppet = new sdk.Puppet({
        scriptHash: scriptHashPuppet,
        invoker: await NeonInvoker.init(network, signer),
        parser: NeonParser,
    })

    const generator = new sdk.Generator({
        scriptHash: scriptHashGenerator,
        invoker: await NeonInvoker.init(network, signer),
        parser: NeonParser,
    })

    console.log(`Build me an army worthy of ${signer.address} !!!`)
    console.log(`Minting ${PuppetArmySize} puppets!`)
    console.log('This may take a while, you can watch the action on neo-express.')


    console.log(`creating a generator instance with generator 1`)
    txid = await generator.createInstance({generatorId: 1})
    await sleep(timeConstant)
    result = await txDidComplete(network, txid, true)
    const generatorInstanceId = await result[0]
    console.log('  Generator Instance ID: ', generatorInstanceId)

    console.log(`creating an epoch with generator instance ${generatorInstanceId}`)
    txid = await puppet.createEpoch({
        label: "Puppeteer",
        generatorInstanceId,
        initialRollCollectionId: 1,
        mintFee: 10 * 10**8,
        sysFee: 40000000,
        maxSupply: EPOCH_TOTAL_SUPPLY
    })
    await sleep(timeConstant)
    result = await txDidComplete(network, txid)
    result = await txDidComplete(network, txid)
    const epochId = await result[0]
    console.log('  epoch ID: ', epochId)

    console.log(`set mint permissions for the generator`)

    const authorizedContracts = [
        {
            'scriptHash': scriptHashPuppet,
            'code': epochId
        }
    ]
    txid = await generator.setInstanceAuthorizedContracts({instanceId: generatorInstanceId, authorizedContracts})
    await sleep(timeConstant)
    result = await txDidComplete(network, txid)
    console.log('  result: ', await result[0])

    const txids = []
    for (let i = 0; i < PuppetArmySize; i++) {
        console.log('i, PuppetArmySize, epochId, signer.address')
        console.log(i, PuppetArmySize, epochId, signer.address)
        txid = await puppet.offlineMint({epochId, owner: signer.address})
        txids.push(txid)
        if (i % (PuppetArmySize / 100) === 0) {
            const totalSupply = await puppet.totalSupply()
            console.log(totalSupply, " PUPPETS!!!")
        }
    }
    await sleep(timeConstant)

    for (let id of txids) {
        await txDidComplete(network, id, true)
    }

    const totalSupply = await puppet.totalSupply()
    console.log('Puppet Supply: ', totalSupply)

    for (let i = 1; i <= totalSupply; i++) {
        let p = await puppet.properties({tokenId: i.toString()})
        console.log(p)
    }
}

const networkFile = JSON.parse(fs.readFileSync("default.neo-express").toString());

const node = process.argv[2] || 'http://localhost:50012'
const pkey = process.argv[3] || networkFile.wallets[0].accounts[0]['private-key']
const signer = new wallet.Account(pkey)
const timeConstant = process.argv[4] || 5000

main(node, signer, timeConstant)