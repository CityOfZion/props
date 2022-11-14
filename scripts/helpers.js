import {sc, rpc, u} from '@cityofzion/neon-core'
import {experimental} from "@cityofzion/neon-js";
import fs from 'fs'

export async function deployContract(node, networkMagic, pathToNEF, signer){
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

export async function txDidComplete(node, txid, showStats = false){
  const client = new rpc.RPCClient(node)
  const tx = await client.getApplicationLog(txid)

  if (showStats) {
    console.log('gas consumed: ', parseInt(tx.executions[0].gasconsumed) / 10 ** 8)
    tx.executions[0].notifications.map( (n) => {
      const notification = formatter(n.state)
      console.log(`event: ${n.eventname}`)
      console.log(`  payload: ${JSON.stringify(notification)}`)
    })
  }
  if (tx.executions[0].vmstate !== "HALT") {
    throw new Error((tx.executions[0]).exception)
  }

  if (tx.executions[0]) {
    const result = tx.executions[0].stack.map( async (item) => {
      return await formatter(item)
    })
    return result
  }
  return true
}

async function formatter(field, num = false) {
  switch (field.type) {
    case "ByteString":
      const rawValue = u.base642hex(field.value)
      if (num) {
        return parseInt(u.reverseHex(rawValue),16)
      }
      return u.hexstring2str(rawValue)
    case "Integer":
      return parseInt(field.value)
    case "Array":
      return field.value.map( (f) => {
        return formatter(f)
      })
    case "Map":
      const object = {}
      field.value.forEach( (f) => {
        let key = formatter(f.key)
        object[key] = formatter(f.value)
      })
      return object
    default:
      return field.value
  }
}

export async function sleep(sleepTime) {
  await new Promise(resolve => setTimeout(resolve, sleepTime))
}
