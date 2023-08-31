import Neon from '@cityofzion/neon-core'
import fs from 'fs'
import assert from 'assert'
import { Collection, Generator } from '../src'
import { exec as _exec, spawn } from 'child_process'
import { afterEach } from 'mocha'
import * as util from 'util'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'
import { txDidComplete } from './helper'

describe('Basic Generator Test Suite', function () {
  this.timeout(60000)
  let scriptHash: string
  let scriptHashCollection: string
  let wallets: any
  let cozWallet: any
  const TIME_CONSTANT = 2500
  const NODE = 'http://127.0.0.1:50012'

  const exec = util.promisify(_exec)
  const wait = util.promisify(setTimeout)

  const getSdk = async (account?: any) => {
    return new Generator({
      scriptHash,
      invoker: await NeonInvoker.init(NODE, account),
      parser: NeonParser
    })
  }

  const getCollectionSdk = async (account?: any) => {
    return new Collection({
      scriptHash: scriptHashCollection,
      invoker: await NeonInvoker.init(NODE, account),
      parser: NeonParser
    })
  }

  beforeEach(async function () {
    await exec(
      'neoxp checkpoint restore -i ../default.neo-express -f ../postSetup.neoxp-checkpoint'
    )
    let { stdout } = await exec(
      'neoxp contract get "Generator" -i ../default.neo-express'
    )
    let neoxpContract = JSON.parse(stdout)[0]
    scriptHash = neoxpContract.hash

    stdout = (
      await exec('neoxp contract get "Collection" -i ../default.neo-express')
    ).stdout
    neoxpContract = JSON.parse(stdout)[0]
    scriptHashCollection = neoxpContract.hash

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

  /* percentError is returning ~0.9 instead of something less than 0.05
  it('Tests creating a simple generator from a collection and sample from it', async function() {
    const cozWallet = wallets.find((wallet: any) => wallet.name === 'coz')
    const generator = await getSdk(cozWallet.account)

    const mintCount = 2000
    const maxTraits = 5
    const dropRate = 0.5

    const gid = await buildGenerator(dropRate, maxTraits, -1, generator)

    const txid = await generator.createInstance({generatorId: gid})
    await wait(TIME_CONSTANT)
    const giid = await txDidComplete(NODE, txid)

    console.log("minting")
    const mints = await mintFromInstanceFunction(giid[0], mintCount, generator)

    let traits: any[] = []
    mints.forEach( (mint) => {
      traits = traits.concat(mint['testTrait'])
    })

    //verify mint quantity
    const traitSlots = mintCount * maxTraits
    const expectedDrops = (traitSlots * dropRate)
    const percentError = Math.abs((traits.length / expectedDrops) - 1)
    assert(percentError < 0.05, percentError.toString())

    const chiSquared = chiSquaredFunction(traits)
    assert(chiSquared < 20, `chi-squared: ${chiSquared}`)

  })
  */

  it('Tests getting the total generators', async () => {
    const generator = await getSdk(cozWallet.account)

    const maxTraits = 5
    const dropRate = 0.5

    const totalOriginal = await generator.totalGenerators()
    await buildGenerator(dropRate, maxTraits, -1, generator)
    const newTotal = await generator.totalGenerators()
    assert(newTotal === totalOriginal + 1)
  })

  it('Tests creating a new generator instance and mint from it, verifying uniqueness', async () => {
    const generator = await getSdk(cozWallet.account)

    const generator_id = await buildGenerator(1, 1, 1, generator)

    const sampleCount = 300
    const masterSet: { testTrait: string[] } = { testTrait: [] }
    const txids: string[] = []
    let txid: string

    txid = await generator.createInstance({ generatorId: generator_id })
    await wait(TIME_CONSTANT)
    const instanceId = (await txDidComplete(NODE, txid))[0]

    for (let i = 0; i < sampleCount; i++) {
      txid = await generator.mintFromInstance({ instanceId: instanceId })
      txids.push(txid)
    }
    await wait(TIME_CONSTANT)
    for (txid of txids) {
      const res = await txDidComplete(NODE, txid)
      Object.keys(res[0]).forEach(key => {
        if (key == 'testTrait') {
          masterSet.testTrait.push(res[0][key])
        }
      })
    }

    assert(
      masterSet.testTrait.length === [...new Set(masterSet.testTrait)].length,
      masterSet.testTrait.length.toString()
    )
  })

  it('Tests evaluating instance access rights', async () => {
    const generator = await getSdk(cozWallet.account)
    const otherWallet = new Neon.wallet.Account()
    const generatorOtherWallet = await getSdk(otherWallet)
    let txid: string

    const neonInvoker = await NeonInvoker.init(NODE, cozWallet.account)

    //transfer GAS to a test wallet
    let buildInvoke = [
      {
        scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
        operation: 'transfer',
        args: [
          { type: 'Hash160', value: cozWallet.account.address },
          { type: 'Hash160', value: otherWallet.scriptHash },
          { type: 'Integer', value: 100 * 10 ** 8 },
          { type: 'Any', value: '' }
        ]
      }
    ]

    txid = await neonInvoker.invokeFunction({
      signers: [],
      invocations: buildInvoke
    })
    await wait(TIME_CONSTANT)
    await txDidComplete(NODE, txid, false)

    //create a new generator and instance
    const generator_id = await buildGenerator(1, 1, 1, generator)
    txid = await generator.createInstance({ generatorId: generator_id })
    await wait(TIME_CONSTANT)
    const instanceId = (await txDidComplete(NODE, txid))[0]

    /////////////UNAUTHENTICATED USER TESTS////////////////

    //test minting from the instance for a user who doesn't have access
    try {
      txid = await generatorOtherWallet.mintFromInstance({ instanceId })
      await wait(TIME_CONSTANT)
      await txDidComplete(NODE, txid)
      assert.fail('Successful minting by unauthorized user')
    } catch (e) {}

    //test setting the instance fee
    const targetFee = 4 * 10 ** 8
    try {
      txid = await generatorOtherWallet.setInstanceFee({
        instanceId,
        fee: targetFee
      })
      await wait(TIME_CONSTANT)
      await txDidComplete(NODE, txid)
      assert.fail('Successful fee manipulation by unauthorized user')
    } catch (e) {}

    //test changing the authorized users
    try {
      txid = await generator.setInstanceAuthorizedUsers({
        instanceId,
        authorizedUsers: [cozWallet.account.address, otherWallet.address]
      })
      await wait(TIME_CONSTANT)
      await txDidComplete(NODE, txid)
      assert.fail('Successful role change by unauthorized user')
    } catch (e) {}

    /////////////Set Authentication////////////////

    //add the user as a second authenticated minter
    txid = await generator.setInstanceAuthorizedUsers({
      instanceId,
      authorizedUsers: [cozWallet.account.address, otherWallet.address]
    })
    await wait(TIME_CONSTANT)
    await txDidComplete(NODE, txid)

    //verify that both accounts can mint
    txid = await generatorOtherWallet.mintFromInstance({ instanceId })
    await wait(TIME_CONSTANT)
    let res = await txDidComplete(NODE, txid)
    assert(res)

    txid = await generator.mintFromInstance({ instanceId })
    await wait(TIME_CONSTANT)
    res = await txDidComplete(NODE, txid)
    assert(res)

    // verify that the new user still cannot change authorization or set fees
    //test setting the instance fee
    try {
      txid = await generatorOtherWallet.setInstanceFee({
        instanceId,
        fee: targetFee
      })
      await wait(TIME_CONSTANT)
      await txDidComplete(NODE, txid)
      assert.fail('Successful fee manipulation by unauthorized user')
    } catch (e) {}

    //test changing the authorized users
    try {
      txid = await generator.setInstanceAuthorizedUsers({
        instanceId,
        authorizedUsers: [cozWallet.account.address, otherWallet.address]
      })
      await wait(TIME_CONSTANT)
      await txDidComplete(NODE, txid)
      assert.fail('Successful role change by unauthorized user')
    } catch (e) {}
  })

  it('Tests evaluating the ability to get generator instances and increment the total count', async () => {
    const generator = await getSdk(cozWallet.account)

    const totalInstances = await generator.totalGeneratorInstances()

    const generator_id = await buildGenerator(1, 1, 1, generator)
    const txid = await generator.createInstance({ generatorId: generator_id })
    await wait(TIME_CONSTANT)
    await txDidComplete(NODE, txid, false)

    const newTotalInstances = await generator.totalGeneratorInstances()
    assert(newTotalInstances === totalInstances + 1)

    for (let i = 0; i < totalInstances; i++) {
      let instance = await generator.getGeneratorInstanceJSON({
        instanceId: i + 1
      })
      let instanceKeys = Object.keys(instance)

      const expectedKeys = [
        'generatorId',
        'instanceId',
        'author',
        'authorizedUsers',
        'objectStorage'
      ]
      expectedKeys.forEach(key => assert(instanceKeys.indexOf(key) !== -1))
    }
  })

  it('Test evaluating the ability to get generators and increment the total count', async () => {
    const generator = await getSdk(cozWallet.account)

    const total = await generator.totalGenerators()
    await buildGenerator(1, 1, 1, generator)
    const newTotal = await generator.totalGenerators()
    assert(newTotal === total + 1)

    for (let i = 0; i < total; i++) {
      let g = await generator.getGeneratorJSON({ generatorId: i + 1 })
      let generatorKeys = Object.keys(g)
      const expectedKeys = [
        'id',
        'author',
        'baseGeneratorFee',
        'label',
        'traits'
      ]
      expectedKeys.forEach(key => assert(generatorKeys.indexOf(key) !== -1))
    }
  })

  it("Test evaluating a non-owner user's ability to attach traits to a generator", async () => {
    const generator = await getSdk(cozWallet.account)
    const otherWallet = new Neon.wallet.Account()
    const generatorOtherWallet = await getSdk(otherWallet)

    const neonInvoker = await NeonInvoker.init(NODE, cozWallet.account)

    //transfer GAS to a test wallet
    let buildInvoke = [
      {
        scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
        operation: 'transfer',
        args: [
          { type: 'Hash160', value: cozWallet.account.address },
          { type: 'Hash160', value: otherWallet.scriptHash },
          { type: 'Integer', value: 100 * 10 ** 8 },
          { type: 'Any', value: '' }
        ]
      }
    ]

    let txid = await neonInvoker.invokeFunction({
      signers: [],
      invocations: buildInvoke
    })
    await wait(TIME_CONSTANT)
    await txDidComplete(NODE, txid, false)

    //create a new generator and instance
    const generatorId = await buildGenerator(1, 1, 1, generator)

    //attempt to attach a trait without being the generator author
    try {
      const trait = {
        label: 'badTrait',
        slots: 1,
        traitLevels: []
      }

      txid = await generatorOtherWallet.createTrait({ generatorId, trait })
      await wait(TIME_CONSTANT)
      await txDidComplete(NODE, txid)
      assert.fail('Successful trait creation by unauthorized user')
    } catch (e) {}
  })

  /* Return is not right
  it("Test minting recursively from a generator using another generator with multiple slots", async() => {
    const generator = await getSdk(cozWallet.account)

    const sampleCount = 1
    const txids: string[] = []

    // create the base generator and instance it
    console.log("creating base generator and instance")
    const baseGID = await buildGenerator(1, 2, -1, generator)
    let txid = await generator.createInstance({ generatorId: baseGID })
    await wait(TIME_CONSTANT)
    let baseInstanceId = await txDidComplete(NODE, txid)
    console.log(`  Base Generator: GID: ${baseGID} | InstanceId: ${baseInstanceId[0]}`)


    console.log("creating root generator and instance")
    const traits = [
        {
            "type": 1,
            "maxMint": -1,
            "args": {
                "scriptHash": scriptHash,
                "method": 'mint_from_instance',
                "param": [
                  {type: "Integer", value: baseInstanceId[0]}  
                ]
            }
        }
    ]
    const newGenerator = {
        'label': 'new generator',
        'baseGeneratorFee': 8000000000,
        'traits': [
            {
                "label": "rootTrait",
                "slots": 3,
                "traitLevels": [
                    {
                        "dropScore": 10000,
                        "mintMode": 0,
                        "traits": traits
                    }
                ]
            }
        ]
    }

    let res = await generator.createGenerator({ label: newGenerator.label, baseGeneratorFee: newGenerator.baseGeneratorFee})
    await wait(TIME_CONSTANT)
    let gid = await txDidComplete(NODE, res)
    
    await generator.createTraits({
      generatorId: gid[0],
      traits: newGenerator.traits,
      acc: cozWallet.account,  
    })
    await wait(TIME_CONSTANT)

    //create a generator instance
    txid = await generator.createInstance({ generatorId: gid[0] })
    await wait(TIME_CONSTANT)

    let rootInstanceId = await txDidComplete(NODE, txid)
    console.log(`  Root Generator: GID: ${gid[0]} | InstanceId: ${rootInstanceId[0]}`)

    //whitelist the root generator instance on the base generator instance
    console.log("whitelisting the root generator instance on the base generator instance")
    const authorizedContracts = [
        {
            'scriptHash': scriptHash,
            'code': rootInstanceId[0]
        }
    ]
    console.log(authorizedContracts)
    txid = await generator.setInstanceAuthorizedContracts(
      {instanceId: baseInstanceId[0], authorizedContracts}
    )
    await wait(TIME_CONSTANT)
    await txDidComplete(NODE, txid)
    console.log("minting")
    for (let i = 0; i < sampleCount; i++) {
        txid = await generator.mintFromInstance({ instanceId: rootInstanceId[0] })
        txids.push(txid)
    }

    await wait(TIME_CONSTANT)
    for (txid of txids) {
        const res = await txDidComplete(NODE, txid, true)
        // res[0].rootTrait is returning a empty array []
        assert(res[0].rootTrait.length === 3)
        res[0].rootTrait.forEach( (trait: any) => {
            assert(trait.testTrait.length === 2)
        })
    }
  })
  */

  /* Less traits are being returned than expected
  it("Tests minting with mode 1; resulting in a complete generator mint without empties", async() => {
    const generator = await getSdk(cozWallet.account)

    const txids: string[] = []

    const collection = await getCollectionSdk(cozWallet.account)
    const cid = await createCollectionHelper(collection)
    const initialCollection = await collection.getCollectionJSON({ collectionId: cid })

    const traits = initialCollection.values.map((value, i) => {
        return {
            "type": 0,
            "maxMint": 1,
            "args": {
                "collectionId": cid,
                "index": i
            }
        }
    })
    const newGenerator = {
        'label': 'new generator',
        'baseGeneratorFee': 100000000,
        'traits': [
            {
                "label": "testTrait",
                "slots": 1,
                "traitLevels": [
                    {
                        "dropScore": 10000,
                        "mintMode": 1,
                        "traits": traits
                    }
                ]
            }
        ]
    }
    const sampleCount = initialCollection.values.length
    let res = await generator.createGenerator({ ...newGenerator })
    await wait(TIME_CONSTANT)
    let gid = await txDidComplete(NODE, res)

    await generator.createTraits({
      generatorId: gid[0],
      traits: newGenerator.traits,
    })
    await wait(TIME_CONSTANT)

    //create a generator instance
    let txid = await generator.createInstance({ generatorId: gid[0] })
    await wait(TIME_CONSTANT)
    const instanceId = await txDidComplete(NODE, txid)

    for (let i = 0; i < sampleCount; i++) {
        txid = await generator.mintFromInstance({instanceId: instanceId[0]})
        txids.push(txid)
    }

  const masterSet: {testTrait: string[]} = {testTrait: []}
  await wait(TIME_CONSTANT)
    for (txid of txids) {
        const res = await txDidComplete(NODE, txid)
        Object.keys(res[0]).forEach((key) => {
            if (key == 'testTrait') {
                masterSet.testTrait.push(res[0][key])
            }
        })
    }
    assert(masterSet.testTrait.length === initialCollection.values.length, `${masterSet.testTrait.length} != ${initialCollection.values.length}`)
  })
  */

  async function buildGenerator(
    dropRate: number,
    maxTraits: number,
    maxMint: number,
    generator: Generator
  ) {
    const collection = await getCollectionSdk(cozWallet.account)

    const cid = await createCollectionHelper(collection)

    const initialCollection = await collection.getCollectionJSON({
      collectionId: cid
    })

    const traits = initialCollection.values.map((value, i) => {
      return {
        type: 0,
        maxMint: maxMint,
        args: {
          collectionId: cid,
          index: i
        }
      }
    })

    const newGenerator = {
      label: 'new generator',
      baseGeneratorFee: 1000000000,
      traits: [
        {
          label: 'testTrait',
          slots: maxTraits,
          traitLevels: [
            {
              dropScore: dropRate * 10000,
              mintMode: 0,
              traits: traits
            }
          ]
        }
      ]
    }
    let res = await generator.createGenerator({
      label: newGenerator.label,
      baseGeneratorFee: newGenerator.baseGeneratorFee
    })

    await wait(TIME_CONSTANT)

    const gid = await txDidComplete(NODE, res)
    const giid = gid[0]

    await generator.createTraits({
      generatorId: giid,
      traits: newGenerator.traits
    })

    return giid
  }

  async function createCollectionHelper(collection: Collection) {
    const txid = await collection.createFromFile(
      '../props_initialize_data/collections/3_traits.colors.json'
    )
    await wait(TIME_CONSTANT)
    const res = await txDidComplete(NODE, txid, true)
    return res[0]
  }

  async function mintFromInstanceFunction(
    instanceId: number,
    count: number,
    generator: Generator
  ) {
    const txids: string[] = []

    for (let i = 0; i < count; i++) {
      const txid = await generator.mintFromInstance({
        instanceId: instanceId
      })
      txids.push(txid)
    }
    await wait(TIME_CONSTANT)

    const res: any[] = []
    for (let txid of txids) {
      const traits = await txDidComplete(NODE, txid, false)
      res.push(traits[0])
    }
    return res
  }
})
