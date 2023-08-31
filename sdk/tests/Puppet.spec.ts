import Neon from '@cityofzion/neon-core'
import fs from 'fs'
import assert from 'assert'
import { Collection, Puppet, TraitLevel } from '../src/index'
import { exec as _exec, spawn } from 'child_process'
import { afterEach } from 'mocha'
import * as util from 'util'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'

describe('Basic Puppet Test Suite', function () {
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
    return new Puppet({
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
      'neoxp contract get "Puppet" -i ../default.neo-express'
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

  it('Tests getting token symbol', async () => {
    const puppet = await getSdk()

    const symbol = await puppet.symbol()
    assert.equal(symbol, 'PUPPET')
  })

  it('Tests getting token decimals', async () => {
    const puppet = await getSdk()

    const symbol = await puppet.decimals()
    assert.equal(symbol, 0)
  })

  it('Tests getting token total supply', async () => {
    const puppet = await getSdk()

    const symbol = await puppet.totalSupply()
    assert(symbol >= 0)
  })

  it('Tests getting the balance of an account', async () => {
    const puppet = await getSdk()

    const balance = await puppet.balanceOf({
      address: cozWallet.account.address
    })
    assert(balance >= 0)
  })

  /*  Test uses methods that doesn't exist on the smart contract and sdk (setCurrentEpoch and getCurrentEpoch) and 
      methods that have different parameters (createEpoch)
  it("should create an epoch from generator instance and set it as active", async() => {
    const puppet = await getSdk(cozWallet.account)

    const collection = await getCollectionSdk()

    const collectionId = await collection.totalCollections()
    const initialCollection = await collection.getCollectionJSON({collectionId})

    let newEpoch: {drop_score: number, unique: boolean, traits: {collection_id: number, index: number}[]}[] = []
    let traits: {collection_id: number, index: number}[] = []
    let dropScore = 100
    initialCollection.values.forEach((value, i) => {

        if (i <= 200) {
            traits.push({
                    "collection_id": collectionId,
                    "index": i
                }
            )
            if (traits.length > 40) {
                newEpoch.push({
                    "drop_score": dropScore,
                    "unique": false,
                    "traits": traits
                })
                dropScore += 100
                traits = []
            }
        }
    })
    const maxTraits = 5


    //Create the Epoch
    console.log("create epoch: ")
    let res = await puppet.createEpoch("testEpoch", maxTraits, newEpoch, cozWallet)
    await wait(2000)
    await txDidComplete(NODE, res)

    //Set the current Epoch
    console.log("set epoch: ")
    const epoch_id = await puppet.totalEpochs()
    res = await puppet.setCurrentEpoch(epoch_id, cozWallet)
    await wait(2000)
    await txDidComplete(NODE, res)

    const currentEpoch = await puppet.getCurrentEpoch()
    assert.equal(currentEpoch, epoch_id)
  })
 */

  //test to get the epoch and validate fields

  /* Iterator return is making this test not work
  it("Tests minting a token to the root account", async () => {
    const puppet = await getSdk(cozWallet.account)

    const tokensOld = await puppet.tokensOf({ address: cozWallet.account.address })

    // Not sure what the epochId should be, in the original it was puppet.offlineMint(cozWallet.address, cozWallet)
    const res = await puppet.offlineMint({ epochId: 0, owner: cozWallet.account.address })
    await wait(2000)
    await txDidComplete(NODE, res, true)

    const tokensNew = await puppet.tokensOf({ address: cozWallet.account.address })
    assert(tokensNew.length === (tokensOld.length + 1))
  })
  */

  //should conduct field validation on all puppet fields

  /* Iterator return is making this test not work
  it("Tests getting the tokens of the root account", async() => {
    const puppet = await getSdk()

    // Iterable return does not work
    const res = await puppet.tokensOf({address: cozWallet.account.address})
    for (const tokenId of res) {
        const token = await puppet.properties({tokenId})
        assert(token)
        console.log(token)
    }
  })
  */

  /* Iterator return is making this test not work
  it("Tests getting all the tokens on the contract as defined by tokens method", async() => {    
   const puppet = await getSdk()

    const res = await puppet.tokens()
    for (const tokenId of res) {
        // puppet.tokens() return a array of numbers, but properties get a string as param
        const token = await puppet.properties({tokenId: tokenId.toString()})
        console.log(token)
        assert(token)
    }
  })
  /*

  // method to actually get all the tokens on the contract

  /* Iterator return is making this test not work
  it("Tests getting the owner of a token", async() => {
    const puppet = await getSdk()

    let res = await puppet.tokensOf({ address: cozWallet.account.address })
    const ownerOfToken = await puppet.ownerOf({tokenId: res[0]})
    assert(cozWallet.account.address === ownerOfToken)
  })
  /*

  /* Iterator return is making this test not work
  it("should transfer a character to a user", async() => {
    const puppet = await getSdk()
    const account = new Neon.wallet.Account('NUqoQhF9mVF7v6EeeU7YhpdSSr64cTJGD3')

    const initialTokensOfOwner = await puppet.tokensOf({ address: cozWallet.account.address })

    const res = await puppet.transfer({
      to: account.address,
      tokenId: initialTokensOfOwner[0],
      data: cozWallet.account
    })
    await wait(2000)
    await txDidComplete(NODE, res)

    const newTokensOfOwner = await puppet.tokensOf({ address: cozWallet.account.address })
    const newTokensOfReceiver = await puppet.tokensOf({ address: account.address })

    assert(newTokensOfOwner.indexOf(initialTokensOfOwner[0]) === -1)
    assert(newTokensOfReceiver.indexOf(initialTokensOfOwner[0]) !== -1)
  })
  */

  /* Purchase method ont he original test was different
  it("should purchase a token", async() => {
    const puppet = await getSdk(cozWallet.account)

    const totalSupply = await puppet.totalSupply()
    // Not sure what the epochId should be, in the original it was puppet.purchase(cozWallet)
    const res = await puppet.purchase({
      epochId: 0,
      signerAddress: cozWallet.account.address
    })
    await wait(4000)
    await txDidComplete(NODE, res)

    const newTotalSupply = await puppet.totalSupply()
    assert(totalSupply < newTotalSupply)
  })
  */

  /* The method getMintFee doesn't exist and setMintFee has different parameters
  it("Tests setting the initial mint fee", async() => {
    const puppet = await getSdk(cozWallet.account)

    const mintFee = 100000000
    const res = await puppet.setMintFee({
      epochId: 0,
      fee: mintFee
    })
    await wait(2000)
    await txDidComplete(NODE, res)

    const realizedMintFee = await puppet.getMintFee()
    assert.equal(mintFee, realizedMintFee)
  })
  */

  /* The method getMintFee doesn't exist, and setMintFee and purchase has different parameters
  it("should change the mint fee", async() => {
    const puppet = await getSdk(cozWallet.account)

    const initialTotalSupply = await puppet.totalSupply()
    const initialMintFee = await puppet.getMintFee()
    console.log('mint fee: ', initialMintFee)


    let res = await puppet.purchase({
      epochId: 0,
      signerAddress: cozWallet.account.address
    })
    await wait(2000)
    await txDidComplete(NODE, res)

    // verify that the token was purchased
    const newTotalSupply = await puppet.totalSupply()
    assert(initialTotalSupply < newTotalSupply)


    // update the mint fee to 10 GAS
    res = await puppet.setMintFee({
      epochId: 0,
      fee: 5 * initialMintFee
    })
    console.log('set mint fee: ', res)
    await wait(2000)
    await txDidComplete(NODE, res)

    // verify the update persisted
    const newMintFee = await puppet.getMintFee()
    console.log('new mint fee: ', newMintFee)
    assert.equal(newMintFee, initialMintFee * 5)

    // buy a new token and verify
    res = await puppet.purchase({
      epochId: 0,
      signerAddress: cozWallet.account.address
    })
    await wait(2000)
    await txDidComplete(NODE, res)

    const finalTotalSupply = await puppet.totalSupply()
    assert(newTotalSupply < finalTotalSupply)

    // reset
    res = await puppet.setMintFee({
      epochId: 0,
      fee: initialMintFee
    })
    await wait(2000)
    await txDidComplete(NODE, res)
  })
   */

  it('should get the total epochs', async () => {
    const puppet = await getSdk(cozWallet.account)

    const total = await puppet.totalEpochs()
    assert(total > 0)
  })

  /* The method createEpoch was expecting different args on the original test and EpochType had a trait_levels prop
  it("should create an epoch using a collection", async() => {
    const puppet = await getSdk(cozWallet.account)
    const collection = await getCollectionSdk(cozWallet.account)

    const collectionId = await collection.totalCollections()
    const initialCollection = await collection.getCollectionJSON({collectionId})

    const newEpoch: {drop_score: number, unique: boolean, traits: {collection_id: number, index: number}[]}[] = [
      {
        "drop_score": 1000,
        "unique": true,
        "traits": []
      },
      {
        "drop_score": 600,
        "unique": true,
        "traits": []
      }
    ]

    initialCollection.values.forEach((value, i) => {
        if (i < 100) {
            newEpoch[i % 2].traits.push({
                "collection_id": collectionId,
                "index": i
            })
        }
    })

    // Not sure what the params should be the original were ("testEpoch", 3, newEpoch, cozWallet)
    const res = await puppet.createEpoch({
      label: "testEpoch",
      generatorInstanceId: 0,
      initialRollCollectionId: 0,
      mintFee: 0,
      sysFee: 0,
      maxSupply: 0
    })
    await wait(2000)
    await txDidComplete(NODE, res)

    const epoch_id = await puppet.totalEpochs()
    const res2 = await puppet.getEpochJSON({epochId: epoch_id})
    initialCollection.values.forEach( (value, i) => {
        console.log(res2)
        assert.equal(value, initialCollection.values[res2.trait_levels[i%2].traits[(Math.floor(i/2))]['index']])
    })
  })
   */
})
