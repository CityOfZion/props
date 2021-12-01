import {u, wallet} from '@cityofzion/neon-core'
import {hash160} from "@cityofzion/neon-core/lib/u";

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
      if (rawValue.length === 40) {
        return new wallet.Account(u.reverseHex(rawValue))
      }
      return u.hexstring2str(rawValue)
    case "Integer":
      return parseInt(field.value)
    default:
      return field.value
  }
}