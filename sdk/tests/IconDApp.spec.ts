import Neon from '@cityofzion/neon-core'
import fs from 'fs'
import assert from 'assert'
import {IconDApp} from '../src'
import {exec as _exec, spawn} from 'child_process'
import {afterEach} from 'mocha'
import * as util from 'util'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'

describe('Basic IconDApp Test Suite', function () {
  this.timeout(60000)
  let scriptHash: string
  let wallets: any
  const TIME_CONSTANT = 2500

  const exec = util.promisify(_exec)
  const wait = util.promisify(setTimeout)

  const getSdk = async (account?: any) => {
    return new IconDApp({
      scriptHash,
      invoker: await NeonInvoker.init('http://127.0.0.1:50012', account),
      parser: NeonParser,
    })
  }

  beforeEach(async function () {
    await exec('neoxp checkpoint restore -i ../default.neo-express -f ../postSetup.neoxp-checkpoint')

    await exec('neoxp batch -i ../../../../default.neo-express ./tests/batch_files/icon_dapp/initialize.batch')
    const {stdout} = await exec('neoxp contract get "Icon DApp by COZ & NNT" -i ../default.neo-express')

    const neoxpContract = JSON.parse(stdout)[0]
    scriptHash = neoxpContract.hash
    spawn('neoxp', ['run', '-i', '../default.neo-express', '-s', '1'], {})
    await wait(TIME_CONSTANT)

    const network = JSON.parse(fs.readFileSync('../default.neo-express').toString())
    wallets = network.wallets.map((walletObj: any) => ({
      ...walletObj,
      account: new Neon.wallet.Account(walletObj.accounts[0]['private-key']),
    }))

    return true
  })

  afterEach('Tear down', async function () {
    await exec('neoxp stop -i ../default.neo-express')
    return true
  })

  it('Tests getName', async () => {
    const iconDapp = await getSdk()

    const resp = await iconDapp.getName()
    assert.equal(resp, 'Icon DApp')
  })

  it('Tests getOwner before being set', async () => {
    const iconDapp = await getSdk()

    const resp = await iconDapp.getOwner()

    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    assert.equal(resp, `0x${owner.account.scriptHash}`)
  })

  it('Tests testAddProperty', async () => {
    const iconDapp = await getSdk()
    await assert.rejects(
      async () => await iconDapp.testAddProperty({propertyName: 'prop1', description: 'description1'}),
      /No authorization/
    )
  })

  it('Tests testUpdateProperty', async () => {
    const iconDapp = await getSdk()
    await assert.rejects(
      async () => await iconDapp.testUpdateProperty({propertyName: 'prop1', description: 'description1'}),
      /No authorization/
    )
  })

  it('Tests getProperties empty', async () => {
    const iconDapp = await getSdk()
    const resp = await iconDapp.getProperties()
    assert(Object.keys(resp).length === 2)  // icon/25x25 and icon/288x288
  })

  it('Tests addProperties and getProperties', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)
    const txid = await iconDapp.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    assert(txid.length > 0)
    await wait(1200)

    const resp = await iconDapp.getProperties()
    assert.equal(resp.prop1, 'description1')
  })

  it('Tests addProperty length validation', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)

    await assert.rejects(
      async () => await iconDapp.addProperty({
        propertyName: 'a'.repeat(31),
        description: 'description1',
      }),
      /Length of propertyName is incorrect, it should be between 1 and 30$/,
      'Property name should be less than or equals to 30'
    )

    await assert.rejects(
      async () => await iconDapp.addProperty({
        propertyName: '',
        description: 'description1',
      }),
      /Length of propertyName is incorrect, it should be between 1 and 30$/,
      'Property name should be greater than 0'
    )

    await assert.rejects(
      async () => await iconDapp.addProperty({
        propertyName: 'prop1',
        description: 'a'.repeat(255),
      }),
      /Length of description is incorrect, it should be between 1 and 254$/,
      'Description should be less than or equals to 254'
    )

    await assert.rejects(
      async () => await iconDapp.addProperty({
        propertyName: 'prop1',
        description: '',
      }),
      /Length of description is incorrect, it should be between 1 and 254$/,
      'Description should be greater than 0'
    )

    // testing max length possible
    await iconDapp.addProperty({
      propertyName: 'a'.repeat(30),
      description: 'a'.repeat(254),
    })

    // testing min length possible
    await iconDapp.addProperty({
      propertyName: 'a',
      description: 'a',
    })
  })

  it('Tests testUpdateProperty with property not set', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)
    await assert.rejects(
      async () => await iconDapp.updateProperty({propertyName: 'prop2', description: 'description2'}),
      /Invalid property/
    )
  })

  it('Tests updateProperty with invalid length of strings', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)

    await assert.rejects(
      async () => await iconDapp.updateProperty({
        propertyName: 'a'.repeat(31),
        description: 'description1',
      }),
      /Length of propertyName is incorrect, it should be between 1 and 30$/,
      'Property name should be less than or equals to 30'
    )

    await assert.rejects(
      async () => await iconDapp.updateProperty({
        propertyName: '',
        description: 'description1',
      }),
      /Length of propertyName is incorrect, it should be between 1 and 30$/,
      'Property name should be greater than 0'
    )

    await assert.rejects(
      async () => await iconDapp.updateProperty({
        propertyName: 'prop1',
        description: 'a'.repeat(255),
      }),
      /Length of description is incorrect, it should be between 1 and 254$/,
      'Description should be less than or equals to 254'
    )

    await assert.rejects(
      async () => await iconDapp.updateProperty({
        propertyName: 'prop1',
        description: '',
      }),
      /Length of description is incorrect, it should be between 1 and 254$/,
      'Description should be greater than 0'
    )

  })

  it('Tests addProperty, updateProperty and getProperties', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)
    const txid1 = await iconDapp.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    assert(txid1.length > 0)
    await wait(1200)

    const txid2 = await iconDapp.updateProperty({
      propertyName: 'prop1',
      description: 'updated description',
    })
    assert(txid2.length > 0)
    await wait(1200)

    const resp = await iconDapp.getProperties()
    assert.equal(resp.prop1, 'updated description')
  })

  it('Tests testSetMetaData', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)
    await assert.rejects(async () => await iconDapp.testSetMetaData({
      scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
      propertyName: 'prop1',
      value: 'https://www.google.com/',
    }),
      /Undefined property name/)
  })

  it('Tests addProperties and testSetMetaData', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)
    await iconDapp.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    await wait(1200)

    const resp = await iconDapp.testSetMetaData({
      scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
      propertyName: 'prop1',
      value: 'https://www.google.com/',
    })
    assert.equal(resp, true)
  })

  it('Tests addProperties, setMetaData and getMetaData',
    async () => {
      const owner = wallets.find((wallet: any) => wallet.name === 'coz')
      const iconDapp = await getSdk(owner.account)
      await iconDapp.addProperty({
        propertyName: 'prop1',
        description: 'description1',
      })
      await wait(1200)

      const txid = await iconDapp.setMetaData({
        scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
        propertyName: 'prop1',
        value: 'https://www.google.com/',
      })
      assert(txid.length > 0)
      await wait(1200)

      const resp = await iconDapp.getMetaData({
        scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
      })

      assert.equal(resp.prop1, 'https://www.google.com/')
  })

  it('Tests setMetaData invalid length',
  async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)
    
    await assert.rejects( 
      async() => await iconDapp.setMetaData({
        scriptHash: '0x1234567890123456789012345678901234567890',
        propertyName: 'icon/25x25',
        value: 'a'.repeat(390),
      }),
      /Length of value is incorrect, it should be between 1 and 389$/,
      'Value should be less than or equals to 389'
    )
    
    await assert.rejects( 
      async() => await iconDapp.setMetaData({
        scriptHash: '0x1234567890123456789012345678901234567890',
        propertyName: 'icon/25x25',
        value: '',
      }),
      /Length of value is incorrect, it should be between 1 and 389$/,
      'Value should be greater than 0'
    )
  })

  it('Tests getMultipleMetaData', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)
    await iconDapp.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    await wait(1200)

    await iconDapp.setMetaData({
      scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
      propertyName: 'prop1',
      value: 'https://www.google.com/',
    })
    await iconDapp.setMetaData({
      scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
      propertyName: 'prop1',
      value: 'https://www.reddit.com/',
    })
    await wait(1200)

    const resp: any = await iconDapp.getMultipleMetaData({
      contractHashes: ['0x14d91cd393bc06c571b966df1cc59c0115bdb59c', '0xd2a4cff31913016155e38e474a2c06d08be276cf']
    })

    assert.equal(resp['0x14d91cd393bc06c571b966df1cc59c0115bdb59c'].prop1, 'https://www.google.com/')
    assert.equal(resp['0xd2a4cff31913016155e38e474a2c06d08be276cf'].prop1, 'https://www.reddit.com/')
  })

  it('Tests testSetContractParent', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)
    const resp = await iconDapp.testSetContractParent({
      childHash: '0x49cf4e5378ffcd4dec034fd98a174c5491e395e2',
      parentHash: '0xcc5e4edd9f5f8dba8bb65734541df7a1c081c67b',
    })

    assert.equal(resp, true)
  })

  it('Tests setContractParent and getContractParent', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)
    const txid = await iconDapp.setContractParent({
      childHash: '0x49cf4e5378ffcd4dec034fd98a174c5491e395e2',
      parentHash: '0xcc5e4edd9f5f8dba8bb65734541df7a1c081c67b',
    })
    assert(txid.length > 0)
    await wait(1200)

    const resp = await iconDapp.getContractParent({
      childHash: '0x49cf4e5378ffcd4dec034fd98a174c5491e395e2',
    })

    assert.equal(resp, '0xcc5e4edd9f5f8dba8bb65734541df7a1c081c67b')
  })

  it('Tests setContractParent with same hash for child and parent', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const iconDapp = await getSdk(owner.account)
    await assert.rejects(
      async () => await iconDapp.setContractParent({
        childHash: '0x49cf4e5378ffcd4dec034fd98a174c5491e395e2',
        parentHash: '0x49cf4e5378ffcd4dec034fd98a174c5491e395e2',
      }),
      /can't set a contract as its own parent$/
    )
  })

  it('Tests testSetOwnership', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'coz')
    const user = wallets.find((wallet: any) => wallet.name === 'User1')
    const iconDappForOwner = await getSdk(owner.account)
    const iconDappForUser = await getSdk(user.account)

    await iconDappForOwner.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    await wait(1200)

    const {stdout} = await exec('neoxp contract get "Ownership" -i ../default.neo-express')
    
    const {hash} = JSON.parse(stdout)[0]

    await iconDappForUser.setOwnership({
      scriptHash: hash,
      sender: user.account.scriptHash,
    })
    await wait(1200)

    const resp = await iconDappForUser.testSetMetaData({
      scriptHash: hash,
      propertyName: 'prop1',
      value: 'https://www.google.com/',
    })

    assert.equal(resp, true)
  })

  it('Tests setOwnership', async () => {
    const coz = wallets.find((wallet: any) => wallet.name === 'coz')
    const userOwner = wallets.find((wallet: any) => wallet.name === 'User1')
    const iconDappCoz = await getSdk(coz.account)
    const iconDappUser = await getSdk(userOwner.account)
    const propertyName = 'prop1'
    const value = 'https://www.google.com'

    const {stdout} = await exec('neoxp contract get "ownership" -i ../default.neo-express')
    const contractScriptHash = JSON.parse(stdout)[0].hash

    await iconDappCoz.addProperty({
      propertyName,
      description: 'description1',
    })
    await wait(1200)

    await assert.rejects( 
      async () => await iconDappUser.setMetaData({
        scriptHash: contractScriptHash,
        propertyName,
        value
      }),
      /No authorization$/,
      'User can\'t change metadata if he is not the owner'
    )
    await wait(1200)

    // making sure no value was saved
    let contractMetadata = await iconDappUser.getMetaData({scriptHash: contractScriptHash})
    assert(contractMetadata[propertyName] === undefined, 'Property value should not have been added')
    
    // user is claiming ownership of the smart contract they deployed
    const txid = await iconDappUser.setOwnership({
      scriptHash: contractScriptHash,
      sender: userOwner.account.scriptHash,
    })
    assert(txid.length > 0)
    await wait(1200)

    // user can change their smart contract's metadata now
    await iconDappUser.setMetaData({
      scriptHash: contractScriptHash,
      propertyName,
      value
    })
    await wait(1200)

    contractMetadata = await iconDappUser.getMetaData({scriptHash: contractScriptHash})
    assert(contractMetadata[propertyName] === value, 'Property value should have been added')
  })
})
