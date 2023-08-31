import Neon from '@cityofzion/neon-core'
import fs from 'fs'
import assert from 'assert'
import { Collection } from '../src/index'
import { exec as _exec, spawn } from 'child_process'
import { afterEach } from 'mocha'
import * as util from 'util'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import type { NeonParser } from '@cityofzion/neon-parser'
import { chiSquaredFunction, generateName, txDidComplete } from './helper'

describe('Basic Collection Test Suite', function () {
  this.timeout(60000)
  let scriptHash: string
  let wallets: any
  let cozWallet: any
  const TIME_CONSTANT = 2500
  const NODE = 'http://127.0.0.1:50012'

  const exec = util.promisify(_exec)
  const wait = util.promisify(setTimeout)

  const getSdk = async (account?: any) => {
    return new Collection({
      scriptHash,
      invoker: await NeonInvoker.init(NODE, account),
      parser: NeonParser
    })
  }

  beforeEach(async function () {
    await exec(
      'neoxp checkpoint restore -i ../default.neo-express -f ../postSetup.neoxp-checkpoint'
    )
    const { stdout } = await exec(
      'neoxp contract get "Collection" -i ../default.neo-express'
    )

    const neoxpContract = JSON.parse(stdout)[0]
    scriptHash = neoxpContract.hash
    spawn('neoxp', ['run', '-i', '../default.neo-express', '-s', '1'], {})
    await wait(TIME_CONSTANT)

    const network = JSON.parse(
      fs.readFileSync('../default.neo-express').toString()
    )
    wallets = network.wallets.map((walletObj: any) => ({
      ...walletObj,
      account: new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
    }))

    cozWallet = wallets.find((wallet: any) => wallet.name === 'coz')

    return true
  })

  afterEach('Tear down', async function () {
    await exec('neoxp stop -i ../default.neo-express')
    return true
  })

  it('Tests creating a very large collection', async () => {
    const collection = await getSdk(cozWallet.account)

    const collectionLength = 2000

    const traits: string[] = []
    for (let i = 0; i < collectionLength; i++) {
      traits.push(generateName())
    }

    const txid = await collection.createCollection({
      description: 'a collection with 2000 objects',
      collectionType: 'string',
      extra: '',
      values: traits
    })
    await wait(TIME_CONSTANT)

    let cid = await txDidComplete(NODE, txid, true)
    cid = cid[0]

    const cLength = await collection.getCollectionLength({ collectionId: cid })
    assert.equal(collectionLength, cLength)

    const res2 = await collection.getCollectionJSON({ collectionId: cid })

    traits.forEach((trait, i) => {
      assert(trait === res2.values[i])
    })
  })

  it('Tests popping values from a very large collection', async () => {
    const collection = await getSdk(cozWallet.account)

    const traits: string[] = []
    for (let i = 0; i < 500; i++) {
      traits.push(generateName())
    }

    const txid = await collection.createCollection({
      description: 'a small collection',
      collectionType: 'string',
      extra: '',
      values: traits
    })
    await wait(TIME_CONSTANT)
    let cid = await txDidComplete(NODE, txid, true)
    cid = cid[0]

    const collectionLength = await collection.getCollectionLength({
      collectionId: cid
    })
    assert.equal(traits.length, collectionLength)

    for (let index = 0; index < collectionLength; index++) {
      const trait = traits[index]
      const res2 = await collection.getCollectionElement({
        collectionId: cid,
        index
      })

      assert.equal(trait, res2)
    }
  })

  it('Tests creating a small collection and get the values', async () => {
    const collection = await getSdk(cozWallet.account)

    const cid = await createCollectionHelper(collection)
    const localCollection = JSON.parse(
      fs
        .readFileSync(
          '../props_initialize_data/collections/3_traits.colors.json'
        )
        .toString()
    )

    const collectionValues = await collection.getCollectionValues({
      collectionId: cid
    })

    localCollection.values.forEach((trait: string, index: number) => {
      assert(trait === collectionValues[index])
    })
  })

  it('Tests uniformly sampling from the range of values in a collection using the multiple sample feature', async () => {
    const collection = await getSdk(cozWallet.account)

    const runSize = 400

    const cid = await createCollectionHelper(collection)

    const txids: string[] = []
    for (let i = 0; i < runSize; i++) {
      const res = await collection.sampleFromCollection({
        collectionId: cid,
        samples: 5
      })
      txids.push(res)
    }

    await wait(TIME_CONSTANT)

    let results: any[] = []
    for (let txid of txids) {
      let result = await txDidComplete(NODE, txid)
      results = results.concat(result[0])
    }
    const chiSquared = chiSquaredFunction(results)
    assert(chiSquared < 30, `chi-squared: ${chiSquared}`)
  })

  it('Tests uniformly sampling from the range of values in a collection', async () => {
    const collection = await getSdk(cozWallet.account)

    const runSize = 2000

    const cid = await createCollectionHelper(collection)

    const txids: string[] = []
    for (let i = 0; i < runSize; i++) {
      const res = await collection.sampleFromCollection({
        collectionId: cid,
        samples: 1
      })
      txids.push(res)
    }

    await wait(TIME_CONSTANT)

    const results: any[] = []
    for (let txid of txids) {
      let result = await txDidComplete(NODE, txid)
      results.push(result[0])
    }
    const chiSquared = chiSquaredFunction(results)
    assert(chiSquared < 30, `chi-squared: ${chiSquared}`)
  })

  it('Tests getting every collection in the contract', async () => {
    const collectionOwnerPermission = await getSdk(cozWallet.account)
    const collection = await getSdk()

    await createCollectionHelper(collectionOwnerPermission)

    const total = await collection.totalCollections()
    assert(total >= 1)

    for (let i = 1; i <= total; i++) {
      const collec = await collection.getCollectionJSON({ collectionId: i })
      assert(collec !== undefined)
    }
  })

  it('Tests sampling uniformly from a runtime sample', async () => {
    const collection = await getSdk(cozWallet.account)

    const options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    const txid = await collection.sampleFromRuntimeCollection({
      values: options,
      samples: 1000,
      pick: false
    })

    await wait(TIME_CONSTANT)

    const result = await txDidComplete(NODE, txid, false)

    const chiSquared = chiSquaredFunction(result[0])
    assert(chiSquared < 20)
  })

  it('Tests picking 9 of the 10 samples multiple times without repeating', async () => {
    const collection = await getSdk(cozWallet.account)

    const options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    const txids: string[] = []
    for (let i = 0; i < 20; i++) {
      const txid = await collection.sampleFromRuntimeCollection({
        values: options,
        samples: 9,
        pick: true
      })
      txids.push(txid)
    }
    await wait(TIME_CONSTANT)

    for (let txid of txids) {
      let result = await txDidComplete(NODE, txid, false)

      assert(result[0].length === result[0].filter(onlyUnique).length)
    }

    function onlyUnique(value: number, index: number, self: Array<number>) {
      return self.indexOf(value) === index
    }
  })

  it('Tests rejecting a runtime sampling because the picks count is larger than the array length', async () => {
    const collection = await getSdk(cozWallet.account)

    const options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    try {
      await collection.sampleFromRuntimeCollection({
        values: options,
        samples: 12,
        pick: true
      })
      assert.fail('this tx should fail due to sample length')
    } catch (e) {}
  })

  async function createCollectionHelper(collection: Collection) {
    const txid = await collection.createFromFile(
      '../props_initialize_data/collections/3_traits.colors.json'
    )
    await wait(TIME_CONSTANT)
    const res = await txDidComplete(NODE, txid, true)
    return res[0]
  }
})
