import * as sdk from '../sdk/dist'
import fs from 'fs'
import {wallet} from '@cityofzion/neon-core'
import {exec as _exec} from 'child_process'
import {txDidComplete, sleep} from './helpers'
import { NeonParser } from '@cityofzion/neon-parser'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import * as util from 'util'


async function main(network, signer, timeConstant) {
    let result, txid
    const exec = util.promisify(_exec)

    let stdout = (await exec('neoxp contract get "Collection"')).stdout
    let neoxpContract = JSON.parse(stdout)[0]
    const scriptHashCollection = neoxpContract.hash

    stdout = (await exec('neoxp contract get "Generator"')).stdout
    neoxpContract = JSON.parse(stdout)[0]
    const scriptHashGenerator = neoxpContract.hash

    const collection = new sdk.Collection({
        scriptHash: scriptHashCollection,
        invoker: await NeonInvoker.init(network, signer),
        parser: NeonParser,
    })

    const generator = new sdk.Generator({
        scriptHash: scriptHashGenerator,
        invoker: await NeonInvoker.init(network, signer),
        parser: NeonParser,
    })

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
        txid = await collection.createFromFile(basePath + '/' + file).catch(e => {console.log(e)})
        console.log("  txid: " + txid)
        await sleep(timeConstant)
        result = await txDidComplete(network, txid, true)
        console.log("  collection_id: ", await result[0], '\n')
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

        const txids = []
        const [ txidCreateGenerator, localGenerator ] = await generator.createGeneratorFromFile(basePath + '/' + file, signer, timeConstant)
        txids.push(txidCreateGenerator)
        await sleep(timeConstant)
        
        const gId = (await txDidComplete(network, txidCreateGenerator, true))[0]        
        result = await generator.createTraits({ generatorId: await gId, traits: localGenerator.traits})
        txids.push(result)
        await sleep(timeConstant)
        
        for await (txid of txids) {
            result = await txDidComplete(network, txid, true)
            result.forEach( async (value) => {
                console.log("  id: ", await value, '\n')}
            )
        }
    }
}

const networkFile = JSON.parse(fs.readFileSync("default.neo-express").toString());

const node = process.argv[2] || 'http://localhost:50012'
const pkey = process.argv[3] || networkFile.wallets[0].accounts[0]['private-key']
const signer = new wallet.Account(pkey)
const timeConstant = process.argv[4] || 5000

main(node, signer, timeConstant)
