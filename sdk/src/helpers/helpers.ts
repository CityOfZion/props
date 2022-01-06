import {sc, rpc, u, wallet} from '@cityofzion/neon-core'
import {NeoInterface} from "../api";
import fs from "fs";
import {experimental} from "@cityofzion/neon-js";

export function parseToJSON(entries: any[]): any {
  const object: {
    [key: string]: any
  } = {}
  let key: string
  let value: any

  entries.forEach((entry: any) => {
    key = formatter(entry.key)
    switch (entry.value.type) {
      case "Map":
        value = parseToJSON(entry.value.value)
        break
      case "Array":
        value = entry.value.value.map((e: any) => {
          return parseToJSON(e.value)
        })

        break
      default:
        if (key === 'token_id') {
          value = formatter(entry.value, true)
        } else {
          value = formatter(entry.value)
        }
        break
    }
    object[key] = value
  })
  return object
}

export function formatter(field: any, num: boolean = false): any {
  switch (field.type) {
    case "ByteString":
      const rawValue = u.base642hex(field.value)
      if (num) {
        return parseInt(u.reverseHex(rawValue),16)
      }
      //if (rawValue.length === 40) {
      //  return new wallet.Account(u.reverseHex(rawValue))
      //}
      return u.hexstring2str(rawValue)
    case "Integer":
      return parseInt(field.value)
    case "Array":
      return field.value.map( (f: any) => {
        return formatter(f)
      })
    case "Map":
      const object: {
        [key: string]: any
      } = {}
      field.value.forEach( (f: any) => {
        let key: string = formatter(f.key)
        object[key] = formatter(f.value)
      })
      return object
    default:
      return field.value
  }
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function variableInvoke(node: string, networkMagic: number, contractHash: string, method: string, param: any[] = [], signer?: wallet.Account): Promise<any> {
  try {
    let res
    if (signer) {
      res = await NeoInterface.publishInvoke(
        node,
        networkMagic,
        contractHash,
        method,
        param,
        signer
      );
    } else {
      res = await NeoInterface.testInvoke(
        node,
        networkMagic,
        contractHash,
        method,
        param,
      );
    }
    if (res === undefined || res.length === 0) {
      throw new Error("unrecognized response");
    }
    return res;
  } catch (e) {
    throw new Error("Something went wrong: " + (e as Error).message)
  }
}

export async function deployContract(node: string, networkMagic: number, pathToNEF: string, signer: wallet.Account): Promise<string> {
  const config = {
    networkMagic,
    rpcAddress: node,
    account: signer
  }

  const nef = sc.NEF.fromBuffer(
    fs.readFileSync(
      pathToNEF
    )
  )

  const rawManifest = fs.readFileSync(pathToNEF.replace('.nef', '.manifest.json'))
  const manifest = sc.ContractManifest.fromJson(
    JSON.parse(rawManifest.toString())
  )

  const assembledScript = new sc.ScriptBuilder()
    .emit(sc.OpCode.ABORT)
    .emitPush(u.HexString.fromHex(signer.scriptHash))
    .emitPush(nef.checksum)
    .emitPush(manifest.name)
    .build();
  const scriptHash = u.reverseHex(u.hash160(assembledScript))

  console.log(`deploying ${manifest.name} to 0x${scriptHash} ...`)


  return experimental.deployContract(nef, manifest, config)
}

export async function getEvents(node: string, txid: string): Promise<any[]> {
  const client = new rpc.RPCClient(node)
  const tx = await client.getApplicationLog(txid)
  return parseNotifications(tx)
}

export async function txDidComplete(node: string, txid: string, showStats: boolean = false): Promise<any>{
  const client = new rpc.RPCClient(node)
  const tx = await client.getApplicationLog(txid)

  if (showStats) {
    console.log('gas consumed: ', parseInt(tx.executions[0].gasconsumed) / 10 ** 8)
    parseNotifications(tx, true)
  }
  if (tx.executions[0].vmstate !== "HALT") {
    throw new Error((tx.executions[0] as any).exception)
  }

  if (tx.executions[0]) {
    const result = tx.executions[0].stack!.map( (item) => {
      return formatter(item)
    })
    return result
  }
  return true
}

function parseNotifications(tx: rpc.ApplicationLogJson, verbose: boolean = false) {
  return tx.executions[0].notifications.map( (n) => {
const notification = formatter(n.state)
    const res = {
      'eventName': n.eventname,
      'value': notification
    }
    if (verbose) {
      console.log(`event: ${n.eventname}`)
      console.log(`  payload: ${notification}`)
    }
    return res
  })
}

export function chiSquared(samples: string[]): number {
  const bins = {}

  for (let sample of samples) {
    // @ts-ignore
    if (bins[sample]) {
      // @ts-ignore
      bins[sample] += 1
    } else {
      // @ts-ignore
      bins[sample] = 1
    }
  }

  // chi-squared test for uniformity
  let chiSquared = 0
  const expected = samples.length/Object.keys(bins).length
  const keys: any[] = Object.keys(bins)
  for (let i = 0; i< keys.length; i++) {
    // @ts-ignore
    chiSquared += ((bins[keys[i]] - expected) ** 2) / expected
  }
  return chiSquared
}