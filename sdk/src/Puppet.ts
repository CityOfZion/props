import type { EpochType, PuppetType, SmartContractConfig } from './types'
import type { ContractInvocation } from '@cityofzion/neo3-invoker'

export class Puppet {
  static MAINNET = '0x76a8f8a7a901b29a33013b469949f4b08db15756'
  static TESTNET = ''

  constructor(private config: SmartContractConfig) {}

  async balanceOf(options: { address: string }): Promise<number> {
    return await this.singleInvocationTestInvoke(
      { ...options },
      Puppet.buildBalanceOfInvocation
    )
  }

  async createEpoch(options: {
    label: string
    generatorInstanceId: number
    initialRollCollectionId: number
    mintFee: number
    sysFee: number
    maxSupply: number
  }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        Puppet.buildCreateEpochInvocation(this.config.scriptHash, {
          ...options
        })
      ],
      signers: []
    })
  }

  async decimals(): Promise<number> {
    return await this.singleInvocationTestInvoke(
      {},
      Puppet.buildDecimalsInvocation
    )
  }

  async deploy(): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [Puppet.buildDeployInvocation(this.config.scriptHash)],
      signers: []
    })
  }

  async getAttributeMod(options: {
    attributeValue: number
  }): Promise<number | string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        Puppet.buildGetAttributeModInvocation(this.config.scriptHash, {
          ...options
        })
      ],
      signers: []
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  async getEpochJSON(options: { epochId: number }): Promise<EpochType> {
    return await this.singleInvocationTestInvoke(
      { ...options },
      Puppet.buildGetEpochJSONInvocation
    )
  }

  async getPuppetJSON(options: { tokenId: string }): Promise<PuppetType> {
    return await this.singleInvocationTestInvoke(
      { ...options },
      Puppet.buildGetPuppetJSONInvocation
    )
  }

  async getPuppetRaw(options: { tokenId: string }): Promise<string> {
    return await this.singleInvocationTestInvoke(
      options,
      Puppet.buildGetPuppetRawInvocation
    )
  }

  async ownerOf(options: { tokenId: string }): Promise<string> {
    return await this.singleInvocationTestInvoke(
      options,
      Puppet.buildOwnerOfInvocation
    )
  }

  async offlineMint(options: {
    epochId: number
    owner: string
  }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        Puppet.buildOfflineMintInvocation(this.config.scriptHash, {
          ...options
        })
      ],
      signers: []
    })
  }

  async properties(options: { tokenId: string }): Promise<PuppetType | string> {
    return await this.singleInvocationTestInvoke(
      options,
      Puppet.buildPropertiesInvocation
    )
  }

  async purchase(options: {
    epochId: number
    signerAddress: string
  }): Promise<string> {
    const method = 'transfer'

    const GASScriptHash = '0xd2a4cff31913016155e38e474a2c06d08be276cf'
    const epoch = await this.getEpochJSON(options)
    const EpochTyped = epoch as unknown as EpochType
    if (EpochTyped.totalSupply === EpochTyped.maxSupply) {
      throw new Error(
        `Epoch is out of Puppets: ${EpochTyped.totalSupply} / ${EpochTyped.maxSupply}`
      )
    }

    const purchasePrice = EpochTyped.mintFee

    return await this.config.invoker.invokeFunction({
      invocations: [
        {
          scriptHash: GASScriptHash,
          operation: method,
          args: [
            { type: 'String', value: options.signerAddress },
            { type: 'String', value: this.config.scriptHash },
            { type: 'Integer', value: purchasePrice },
            { type: 'Integer', value: options.epochId }
          ]
        }
      ],
      signers: []
    })
  }

  async setMintFee(options: { epochId: number; fee: number }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        Puppet.buildSetMintFeeInvocation(this.config.scriptHash, { ...options })
      ],
      signers: []
    })
  }

  async symbol(): Promise<string> {
    return await this.singleInvocationTestInvoke(
      {},
      Puppet.buildSymbolInvocation
    )
  }

  async tokens(): Promise<number[]> {
    return await this.singleInvocationTestInvoke(
      {},
      Puppet.buildTokensInvocation
    )
  }

  async tokensOf(options: { address: string }): Promise<string[]> {
    return await this.singleInvocationTestInvoke(
      options,
      Puppet.buildTokensOfInvocation
    )
  }

  async totalAccounts(): Promise<number> {
    return await this.singleInvocationTestInvoke(
      {},
      Puppet.buildTotalAccountsInvocation
    )
  }

  async totalEpochs(): Promise<number> {
    return await this.singleInvocationTestInvoke(
      {},
      Puppet.buildTotalEpochsInvocation
    )
  }

  async totalSupply(): Promise<number> {
    return await this.singleInvocationTestInvoke(
      {},
      Puppet.buildTotalSupplyInvocation
    )
  }

  async transfer(options: {
    to: string
    tokenId: string
    data: any
  }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        Puppet.buildTransferInvocation(this.config.scriptHash, { ...options })
      ],
      signers: []
    })
  }

  async update(options: {
    script: string
    manifest: string
    data?: any
  }): Promise<string> {
    options.data = options.data || ''

    return await this.config.invoker.invokeFunction({
      invocations: [
        Puppet.buildUpdateInvocation(this.config.scriptHash, {
          script: options.script,
          manifest: options.manifest,
          data: options.data
        })
      ],
      signers: []
    })
  }

  private async singleInvocationTestInvoke<Type>(
    args: Type,
    buildInvocationFunction: (
      scriptHash: string,
      params: Type
    ) => ContractInvocation
  ): Promise<any> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        buildInvocationFunction(this.config.scriptHash, { ...args })
      ],
      signers: []
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  static buildBalanceOfInvocation(
    scriptHash: string,
    params: { address: string }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'balanceOf',
      args: [{ type: 'Hash160', value: params.address }]
    }
  }

  static buildCreateEpochInvocation(
    scriptHash: string,
    params: {
      label: string
      generatorInstanceId: number
      initialRollCollectionId: number
      mintFee: number
      sysFee: number
      maxSupply: number
    }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'create_epoch',
      args: [
        { type: 'String', value: params.label },
        { type: 'Integer', value: params.generatorInstanceId },
        { type: 'Integer', value: params.initialRollCollectionId },
        { type: 'Integer', value: params.mintFee },
        { type: 'Integer', value: params.sysFee },
        { type: 'Integer', value: params.maxSupply }
      ]
    }
  }

  static buildDecimalsInvocation(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'decimals',
      args: []
    }
  }

  static buildDeployInvocation(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'deploy',
      args: []
    }
  }

  static buildGetAttributeModInvocation(
    scriptHash: string,
    params: { attributeValue: number }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_attribute_mod',
      args: [{ type: 'Integer', value: params.attributeValue }]
    }
  }

  static buildGetEpochJSONInvocation(
    scriptHash: string,
    params: { epochId: number }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_epoch_json',
      args: [{ type: 'Integer', value: params.epochId }]
    }
  }

  // FLAT?
  static buildGetPuppetJSONInvocation(
    scriptHash: string,
    params: { tokenId: string }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_puppet_json',
      args: [{ type: 'String', value: params.tokenId }]
    }
  }

  static buildGetPuppetRawInvocation(
    scriptHash: string,
    params: { tokenId: string }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_puppet_raw',
      args: [{ type: 'String', value: params.tokenId }]
    }
  }

  static buildOwnerOfInvocation(
    scriptHash: string,
    params: { tokenId: string }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'ownerOf',
      args: [{ type: 'String', value: params.tokenId }]
    }
  }

  static buildOfflineMintInvocation(
    scriptHash: string,
    params: { epochId: number; owner: string }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'offline_mint',
      args: [
        { type: 'Integer', value: params.epochId },
        { type: 'Hash160', value: params.owner }
      ]
    }
  }

  static buildPropertiesInvocation(
    scriptHash: string,
    params: { tokenId: string }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'properties',
      args: [{ type: 'String', value: params.tokenId }]
    }
  }

  static buildSetMintFeeInvocation(
    scriptHash: string,
    params: { epochId: number; fee: number }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'set_mint_fee',
      args: [
        { type: 'Integer', value: params.epochId },
        { type: 'Integer', value: params.fee }
      ]
    }
  }

  static buildSymbolInvocation(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'symbol',
      args: []
    }
  }

  static buildTokensInvocation(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'tokens',
      args: []
    }
  }

  static buildTokensOfInvocation(
    scriptHash: string,
    params: { address: string }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'tokensOf',
      args: [{ type: 'Hash160', value: params.address }]
    }
  }

  static buildTotalAccountsInvocation(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'total_accounts',
      args: []
    }
  }

  static buildTotalEpochsInvocation(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'total_epochs',
      args: []
    }
  }

  static buildTotalSupplyInvocation(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'totalSupply',
      args: []
    }
  }

  static buildTransferInvocation(
    scriptHash: string,
    params: { to: string; tokenId: string; data: any }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'transfer',
      args: [
        { type: 'Hash160', value: params.to },
        { type: 'String', value: params.tokenId },
        { type: 'Any', value: params.data } // Talvez de erro
      ]
    }
  }

  static buildUpdateInvocation(
    scriptHash: string,
    params: { script: string; manifest: string; data: any }
  ): ContractInvocation {
    return {
      scriptHash,
      operation: 'update',
      args: [
        { type: 'ByteArray', value: params.script },
        { type: 'String', value: params.manifest },
        { type: 'Any', value: params.data }
      ]
    }
  }
}
