import { Neo3Invoker } from '@cityofzion/neo3-invoker'
import { Neo3Parser } from '@cityofzion/neo3-parser'

export type IconProperties = {
  androidIcon36: string | null
  androidIcon48: string | null
}
export type SmartContractConfig = {
  scriptHash: string
  invoker: Neo3Invoker
  parser: Neo3Parser
}
