import {rpc, u, wallet} from '@cityofzion/neon-core'
import {hash160} from "@cityofzion/neon-core/lib/u";
import {ApplicationLogJson} from "@cityofzion/neon-core/lib/rpc";
import {NeoInterface} from "../api";

export function parseToJSON(entries: any): any {
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
    throw new Error(e)
  }
}

export async function txDidComplete(node: string, txid: string, showStats: boolean = false): Promise<any>{
  const client = new rpc.RPCClient(node)
  const tx = await client.getApplicationLog(txid)

  if (showStats) {
    console.log('gas consumed: ', parseInt(tx.executions[0].gasconsumed) / 10 ** 8)
    parseNotifications(tx)
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

function parseNotifications(tx: ApplicationLogJson) {
  return tx.executions[0].notifications.map( (n) => {
    const notification = formatter(n.state)
    console.log(n.eventname, notification)
    return notification
  })
}