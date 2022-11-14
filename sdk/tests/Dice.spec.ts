import Neon from '@cityofzion/neon-core'
import fs from 'fs'
import assert from 'assert'
import {Dice} from '../src'
import {exec as _exec, spawn} from 'child_process'
import {afterEach} from 'mocha'
import * as util from 'util'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'
import { chiSquaredFunction, txDidComplete } from './helper'

describe('Basic Dice Test Suite', function () {
  this.timeout(60000)
  let scriptHash: string
  let wallets: any
  let cozWallet: any
  const TIME_CONSTANT = 2500
  const NODE = 'http://127.0.0.1:50012'

  const exec = util.promisify(_exec)
  const wait = util.promisify(setTimeout)

  const getSdk = async (account?: any) => {
    return new Dice({
      scriptHash,
      invoker: await NeonInvoker.init(NODE, account),
      parser: NeonParser,
    })
  }  

  beforeEach(async function () {
    await exec('neoxp checkpoint restore -i ../default.neo-express -f ../postSetup.neoxp-checkpoint')
    const {stdout} = await exec('neoxp contract get "Dice" -i ../default.neo-express')

    const neoxpContract = JSON.parse(stdout)[0]
    scriptHash = neoxpContract.hash
    spawn('neoxp', ['run', '-i', '../default.neo-express', '-s', '1'], {})
    await wait(TIME_CONSTANT)

    const network = JSON.parse(fs.readFileSync('../default.neo-express').toString())
    wallets = network.wallets.map((walletObj: any) => ({
      ...walletObj,
      account: new Neon.wallet.Account(walletObj.accounts[0]['private-key']),
    }))

    cozWallet = wallets.find((wallet: any) => wallet.name === 'coz')

    return true
  })

  afterEach('Tear down', async function () {
    await exec('neoxp stop -i ../default.neo-express')
    return true
  })

  it('Tests randbetween', async function() {
    this.timeout(0)
    const dice = await getSdk(cozWallet.account)

    const runSize = 2000
    const bins = 20

    const txids: string[] = []
    for (let i = 0; i < runSize; i++) {
        const res = await dice.randBetween({ start: 0, end: bins - 1})
        txids.push(res)
    }
    await wait(TIME_CONSTANT)

    const results: string[] = []
    for (let txid of txids) {
        let result = await txDidComplete(NODE, txid)
        results.push(result[0])
    }

    // chi-squared test for uniformity
    const chiSquared = chiSquaredFunction(results)
    assert(chiSquared < 30, chiSquared.toString())
})


  it('Tests fair dice roll using rollDie', async () => {
    this.timeout(0)
    const dice = await getSdk(cozWallet.account)

    const runSize = 2000
    const die = 'd20'


    const txids: string[] = []
    for (let i = 0; i < runSize; i++) {
        const res = await dice.rollDie({die})
        txids.push(res)
    }
    await wait(TIME_CONSTANT)

    const results: any[] = []
    for (let txid of txids) {
        let result = await txDidComplete(NODE, txid)
        results.push(result[0])
    }

    // chi-squared test for uniformity
    const chiSquared = chiSquaredFunction(results)
    assert(chiSquared < 20, chiSquared.toString())

  })

})
