import { EpochType, PuppetType, SmartContractConfig } from './types'
import { ContractInvocation } from '@cityofzion/neo3-invoker'

export function buildBalanceOfInvocation(scriptHash: string, params: {address: string}): ContractInvocation{
  return {
    scriptHash,
    operation: 'balanceOf',
    args: [
			{type: 'Hash160', value: params.address}
		]
  }
}

export function buildCreateEpochInvocation(scriptHash: string, params: {label: string, generatorInstanceId: number, initialRollCollectionId: number, mintFee: number, sysFee: number, maxSupply: number}): ContractInvocation{
  return {
    scriptHash,
    operation: 'create_epoch',
    args: [
			{type: 'String', value: params.label},
			{type: 'Integer', value: params.generatorInstanceId},
			{type: 'Integer', value: params.initialRollCollectionId},
			{type: 'Integer', value: params.mintFee},
			{type: 'Integer', value: params.sysFee},
			{type: 'Integer', value: params.maxSupply},
		]
  }
}

export function buildDecimalsInvocation(scriptHash: string): ContractInvocation{
  return {
    scriptHash,
    operation: 'decimals',
    args: []
  }
}

export function buildDeployInvocation(scriptHash: string): ContractInvocation{
  return {
    scriptHash,
    operation: 'deploy',
    args: []
  }
}

export function buildGetAttributeModInvocation(scriptHash: string, params: {attributeValue: number}): ContractInvocation{
  return {
    scriptHash,
    operation: 'get_attribute_mod',
    args: [
			{type: 'Integer', value: params.attributeValue},
		]
  }
}

export function buildGetEpochJSONInvocation(scriptHash: string, params: {epochId: number}): ContractInvocation{
  return {
    scriptHash,
    operation: 'get_epoch_json',
    args: [
			{type: 'Integer', value: params.epochId},
		]
  }
}

// FLAT?
export function buildGetPuppetJSONInvocation(scriptHash: string, params: {tokenId: string}): ContractInvocation{
  return {
    scriptHash,
    operation: 'get_puppet_json',
    args: [
			{type: 'String', value: params.tokenId},
		]
  }
}

export function buildGetPuppetRawInvocation(scriptHash: string, params: {tokenId: string}): ContractInvocation{
  return {
    scriptHash,
    operation: 'get_puppet_raw',
    args: [
			{type: 'String', value: params.tokenId},
		]
  }
}

export function buildOwnerOfInvocation(scriptHash: string, params: {tokenId: string}): ContractInvocation{
  return {
    scriptHash,
    operation: 'ownerOf',
    args: [
			{type: 'String', value: params.tokenId},
		]
  }
}

export function buildOfflineMintInvocation(scriptHash: string, params: {epochId: number, owner: string}): ContractInvocation{
  return {
    scriptHash,
    operation: 'offline_mint',
    args: [
			{type: 'Integer', value: params.epochId},
			{type: 'Hash160', value: params.owner},
		]
  }
}

export function buildPropertiesInvocation(scriptHash: string, params: {tokenId: string}): ContractInvocation{
  return {
    scriptHash,
    operation: 'properties',
    args: [
			{type: 'String', value: params.tokenId},
		]
  }
}

export function buildSetMintFeeInvocation(scriptHash: string, params: {epochId: number, fee: number}): ContractInvocation{
  return {
    scriptHash,
    operation: 'set_mint_fee',
    args: [
			{type: 'Integer', value: params.epochId},
			{type: 'Integer', value: params.fee},
		]
  }
}

export function buildSymbolInvocation(scriptHash: string): ContractInvocation{
  return {
    scriptHash,
    operation: 'symbol',
    args: []
  }
}

export function buildTokensInvocation(scriptHash: string): ContractInvocation{
  return {
    scriptHash,
    operation: 'tokens',
    args: []
  }
}

export function buildTokensOfInvocation(scriptHash: string, params: {address: string}): ContractInvocation{
  return {
    scriptHash,
    operation: 'tokensOf',
    args: [
			{type: 'Hash160', value: params.address},
		]
  }
}

export function buildTotalAccountsInvocation(scriptHash: string): ContractInvocation{
  return {
    scriptHash,
    operation: 'total_accounts',
    args: []
  }
}

export function buildTotalEpochsInvocation(scriptHash: string): ContractInvocation{
  return {
    scriptHash,
    operation: 'total_epochs',
    args: []
  }
}

export function buildTotalSupplyInvocation(scriptHash: string): ContractInvocation{
  return {
    scriptHash,
    operation: 'totalSupply',
    args: []
  }
}

export function buildTransferInvocation(scriptHash: string, params: {to: string, tokenId: string, data: any}): ContractInvocation{
  return {
    scriptHash,
    operation: 'transfer',
    args: [
			{type: 'Hash160', value: params.to},
			{type: 'String', value: params.tokenId},
			{type: 'Any', value: params.data},  // Talvez de erro
		]
  }
}

export function buildUpdateInvocation(scriptHash: string, params: {script: string, manifest: string, data: any}): ContractInvocation{
  return {
    scriptHash,
    operation: 'update',
    args: [
			{type: 'ByteArray', value: params.script},
			{type: 'String', value: params.manifest},
			{type: 'Any', value: params.data},
		]
  }
}

export class Puppet {
  
  constructor(
    private config: SmartContractConfig
  ) {}

	
  async balanceOf(options: {address: string}): Promise<number> {
		return await this.singleInvocationTestInvoke({...options}, buildBalanceOfInvocation)
  }

  async createEpoch(options:{label: string, generatorInstanceId: number, initialRollCollectionId: number, mintFee: number, sysFee: number, maxSupply: number}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildCreateEpochInvocation(this.config.scriptHash, {...options})
      ],
      signers: [],
    })
  }

  async decimals(): Promise<number> {
    return await this.singleInvocationTestInvoke({}, buildDecimalsInvocation)
  }

  async deploy(): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildDeployInvocation(this.config.scriptHash)
      ],
      signers: [],
    })
  }


  async getAttributeMod(options: {attributeValue: number}): Promise<number | string> {
    const res = await this.config.invoker.testInvoke({
			invocations: [
        buildGetAttributeModInvocation(this.config.scriptHash, {...options})
			],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}

		return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async getEpochJSON(options: {epochId: number}): Promise<EpochType> {
    return await this.singleInvocationTestInvoke({...options}, buildGetEpochJSONInvocation)
  }

  async getPuppetJSON(options: {tokenId: string}): Promise<PuppetType> {
    return await this.singleInvocationTestInvoke({...options}, buildGetPuppetJSONInvocation)
  }

  async getPuppetRaw(options: {tokenId: string}): Promise<string> {
    return await this.singleInvocationTestInvoke(options, buildGetPuppetRawInvocation)
  }

  async ownerOf(options: {tokenId: string}): Promise<string> {
    return await this.singleInvocationTestInvoke(options, buildOwnerOfInvocation)
  }

  async offlineMint(options: {epochId: number, owner: string}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildOfflineMintInvocation(this.config.scriptHash, {...options})
      ],
      signers: [],
    })
  }

  async properties(options: {tokenId: string}): Promise<PuppetType | string> {
    return await this.singleInvocationTestInvoke(options, buildPropertiesInvocation)
  }

  async purchase(options: {epochId: number, signerAddress: string}): Promise<string> {
    const method = "transfer";

    const GASScriptHash = "0xd2a4cff31913016155e38e474a2c06d08be276cf"
    const epoch = await this.getEpochJSON(options)
    const EpochTyped = epoch as unknown as EpochType
    if (EpochTyped.totalSupply === EpochTyped.maxSupply) {
      throw new Error(`Epoch is out of Puppets: ${EpochTyped.totalSupply} / ${EpochTyped.maxSupply}`)
    }

    const purchasePrice = EpochTyped.mintFee

    return await this.config.invoker.invokeFunction({
      invocations: [
        {
          scriptHash: GASScriptHash,
          operation: method,
          args: [
            {type: 'String', value: options.signerAddress},
            {type: 'String', value: this.config.scriptHash},	
            {type: 'Integer', value: purchasePrice},	
            {type: 'Integer', value: options.epochId},	
          ]
        }
      ],
      signers: [],
    })
  }

  async setMintFee(options: {epochId: number, fee: number}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildSetMintFeeInvocation(this.config.scriptHash, {...options})
      ],
      signers: [],
    })
  }

  async symbol(): Promise<string> {
    return await this.singleInvocationTestInvoke({}, buildSymbolInvocation)
  }

  async tokens(): Promise<number[]> {
    return await this.singleInvocationTestInvoke({}, buildTokensInvocation)
  }

  async tokensOf(options: {address: string}): Promise<string[]> {
    return await this.singleInvocationTestInvoke(options, buildTokensOfInvocation)
  }

  async totalAccounts(): Promise<number> {
    return await this.singleInvocationTestInvoke({}, buildTotalAccountsInvocation)
  }

  async totalEpochs(): Promise<number> {
    return await this.singleInvocationTestInvoke({}, buildTotalEpochsInvocation)
  }

  async totalSupply(): Promise<number> {
    return await this.singleInvocationTestInvoke({}, buildTotalSupplyInvocation)
  }

  async transfer(options: {to: string, tokenId: string, data: any}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildTransferInvocation(this.config.scriptHash, {...options})
      ],
      signers: [],
    })
  }

  async update(options: {script: string, manifest: string, data?: any}): Promise<string> {
    options.data = options.data || ''

    return await this.config.invoker.invokeFunction({
      invocations: [
        buildUpdateInvocation(this.config.scriptHash, {
          script: options.script,
          manifest: options.manifest,
          data: options.data
        })
      ],
      signers: [],
    })
  }

  private async singleInvocationTestInvoke<Type>(args: Type, buildInvocationFunction: (scriptHash: string, params: Type) => ContractInvocation): Promise<any>{
    const res = await this.config.invoker.testInvoke({
			invocations: [
        buildInvocationFunction(this.config.scriptHash, {...args})
			],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}

		return this.config.parser.parseRpcResponse(res.stack[0])
  }

}