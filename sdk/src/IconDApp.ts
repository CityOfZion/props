import { IconProperties, SmartContractConfig } from './types'
import { ContractInvocation, ContractInvocationMulti } from '@cityofzion/neo3-invoker'
import { Neo3Parser } from '@cityofzion/neo3-parser'


export class IconDApp {

  static MAINNET = '0x489e98351485bbd85be99618285932172f1862e4'
  static TESTNET = ''
  
  constructor(
    private config: SmartContractConfig
  ) {}

  /**
   * Returns the name of the owner of the smart contract. The owner is the one who deployed the smart contract.
   */
  async getOwner(): Promise<string> {
    const res = await this.config.invoker.testInvoke( {
      invocations: [
        IconDApp.buildGetOwnerInvocation(this.config.scriptHash)
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0], {ByteStringToScriptHash: true})
  }

  /**
   * Returns the name of the owner of the smart contract. The owner is the one who deployed the smart contract.
   */
  async getName(): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        IconDApp.buildNameInvocation(this.config.scriptHash)
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  /**
   * Adds a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)
   */
  async testAddProperty(options: {propertyName: string, description: string}): Promise<boolean> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        IconDApp.buildAddPropertyInvocation(
          this.config.scriptHash,
          this.config.parser,
          {propertyName: options.propertyName, description: options.description}
        )
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return Boolean(res.stack[0].value)
  }

  /**
   * Adds a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)
   */
  async addProperty(options: {propertyName: string, description: string}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        IconDApp.buildAddPropertyInvocation(
          this.config.scriptHash,
          this.config.parser,
          {propertyName: options.propertyName, description: options.description}
        )
      ],
      signers: [],
    })
  }

  /**
   * Updates a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)
   */
  async testUpdateProperty(options: {propertyName: string, description: string}): Promise<boolean> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        IconDApp.buildUpdatePropertyInvocation(
          this.config.scriptHash,
          this.config.parser,
          {propertyName: options.propertyName, description: options.description}
        )
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return Boolean(res.stack[0].value)
  }

  /**
   * Updates a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)
   */
  async updateProperty(options: {propertyName: string, description: string}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        IconDApp.buildUpdatePropertyInvocation(
          this.config.scriptHash,
          this.config.parser,
          {propertyName: options.propertyName, description: options.description}
        )
      ],
      signers: [],
    })
  }

  /**
   * Returns all Icon properties.
   */
  async getProperties(): Promise<IconProperties & Record<string, any>> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        IconDApp.buildGetPropertiesInvocation(this.config.scriptHash)
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  /**
   * Adds a property to the metadata of a smart contract. (Admin and deployer only)
   */
  async testSetMetaData(options: {scriptHash: string, propertyName: string, value: string}): Promise<boolean> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        IconDApp.buildSetMetaDataInvocation(
          this.config.scriptHash,
          this.config.parser,
          {scriptHash: options.scriptHash, propertyName: options.propertyName, value: options.value}
        )
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return Boolean(res.stack[0].value)
  }

  /**
   * Adds a property to the metadata of a smart contract. (Admin and deployer only)
   */
  async setMetaData(options: {scriptHash: string, propertyName: string, value: string}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        IconDApp.buildSetMetaDataInvocation(
          this.config.scriptHash,
          this.config.parser,
          {scriptHash: options.scriptHash, propertyName: options.propertyName, value: options.value}
        )
      ],
      signers: [],
    })
  }

  /**
   * Returns the metadata of a smart contract. If the smart contract is a child it will return a map with 'parent' as a key.
   */
  async getMetaData(options: {scriptHash: string}): Promise<IconProperties & Record<string, any>> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        IconDApp.buildGetMetaDataInvocation(this.config.scriptHash, {scriptHash: options.scriptHash})
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0])
  }

  /**
   * Returns the metadata of multiple smart contracts.
   */
  async getMultipleMetaData(options: { contractHashes: string[] }): Promise<Map<string, Map<string, string>>[]> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        IconDApp.buildGetMultipleMetaDataInvocation(this.config.scriptHash, {contractHashes: options.contractHashes})
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0], {ByteStringToScriptHash: true})
  }

  /**
   * Sets the parent of a smart contract, children will have the same metadata as the parent. (Admin and deployer only)
   */
  async testSetContractParent(options: { childHash: string, parentHash: string }): Promise<boolean> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        IconDApp.buildSetContractParentInvocation(this.config.scriptHash, {childHash: options.childHash, parentHash: options.parentHash})
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return Boolean(res.stack[0].value)
  }

  /**
   * Sets the parent of a smart contract, children will have the same metadata as the parent. (Admin and deployer only)
   */
  async setContractParent(options: { childHash: string, parentHash: string }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        IconDApp.buildSetContractParentInvocation(this.config.scriptHash, {childHash: options.childHash, parentHash: options.parentHash})
      ],
      signers: [],
    })
  }

  /**
   * Returns the parent of a smart contract. If there is no parent it will return null.
   */
  async getContractParent(options: { childHash: string }): Promise<string> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        IconDApp.buildGetContractParentInvocation(this.config.scriptHash, {childHash: options.childHash})
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser.parseRpcResponse(res.stack[0], {ByteStringToScriptHash: true})
  }

  /**
   * Sets the owner of a smart contract. If sender is not the owner of the smart contract, then it will return false.
   */
  async testSetOwnership(options: { scriptHash: string, sender: string }): Promise<boolean> {
    const res = await this.config.invoker.testInvoke({
      invocations: [
        IconDApp.buildSetOwnershipInvocation(this.config.scriptHash, {scriptHash: options.scriptHash, sender: options.sender})
      ],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return Boolean(res.stack[0].value)
  }

  /**
   * Sets the owner of a smart contract. If sender is not the owner of the smart contract, then it will return false.
   */
  async setOwnership(options: { scriptHash: string, sender: string }): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        IconDApp.buildSetOwnershipInvocation(this.config.scriptHash, {scriptHash: options.scriptHash, sender: options.sender})
      ],
      signers: [],
    })
  }

  async invokeFunction(cim: ContractInvocationMulti): Promise<string>{
    return await this.config.invoker.invokeFunction(cim)
  }

  static buildGetOwnerInvocation(scriptHash: string): ContractInvocation{
    return {
      scriptHash,
      operation: 'getOwner',
      args: []
    }
  }
  
  static buildNameInvocation(scriptHash: string): ContractInvocation{
    return {
      scriptHash,
      operation: 'name',
      args: []
    }
  }
  
  static buildAddPropertyInvocation(scriptHash: string, parser: Neo3Parser, params: {propertyName: string, description: string}): ContractInvocation{
    if (params.propertyName.length >= 31 || params.propertyName.length <= 0){
      throw new Error('Length of propertyName is incorrect, it should be between 1 and 30');
    }
  
    if (params.description.length >= 255 || params.description.length <= 0){
      throw new Error('Length of description is incorrect, it should be between 1 and 254');
    }
    
    return {
      scriptHash,
      operation: 'addProperty',
      args: [
        {type: 'ByteArray', value: parser.strToBase64(params.propertyName)},
        {type: 'ByteArray', value: parser.strToBase64(params.description)},
      ]
    }
  }
  
  static buildUpdatePropertyInvocation(scriptHash: string, parser: Neo3Parser, params: {propertyName: string, description: string}): ContractInvocation{
    if (params.propertyName.length >= 31 || params.propertyName.length <= 0){
      throw new Error('Length of propertyName is incorrect, it should be between 1 and 30');
    }
  
    if (params.description.length >= 255 || params.description.length <= 0){
      throw new Error('Length of description is incorrect, it should be between 1 and 254');
    }
    
    return {
      scriptHash,
      operation: 'updateProperty',
      args: [
        {type: 'ByteArray', value: parser.strToBase64(params.propertyName)},
        {type: 'ByteArray', value: parser.strToBase64(params.description)},
      ]
    }
  }
  
  static buildGetPropertiesInvocation(scriptHash: string): ContractInvocation{
    return {
      scriptHash,
      operation: 'getProperties',
      args: []
    }
  }
  
  static buildSetMetaDataInvocation(scriptHash: string, parser: Neo3Parser, params: {scriptHash: string, propertyName: string, value: string}): ContractInvocation{
    if (params.value.length >= 390 || params.value.length <= 0){
      throw new Error('Length of value is incorrect, it should be between 1 and 389');
    }
    
    return {
      scriptHash,
      operation: 'setMetaData',
      args: [
        {type: 'Hash160', value: params.scriptHash},
        {type: 'ByteArray', value: parser.strToBase64(params.propertyName)},
        {type: 'ByteArray', value: parser.strToBase64(params.value)},
      ]
    }
  }
  
  static buildGetMetaDataInvocation(scriptHash: string, params: {scriptHash: string}): ContractInvocation{
    return {
      scriptHash,
      operation: 'getMetaData',
      args: [{ type: 'Hash160', value: params.scriptHash }]
    }
  }
  
  static buildGetMultipleMetaDataInvocation(scriptHash: string, params: {contractHashes: string[]}): ContractInvocation{
    return {
      scriptHash,
      operation: 'getMultipleMetaData',
      args: [{ type: 'Array', value: params.contractHashes.map(hash => ({ type: 'Hash160', value: hash })) }],
    }
  }
  
  static buildSetContractParentInvocation(scriptHash: string, params: {childHash: string, parentHash: string}): ContractInvocation{
    return {
      scriptHash,
      operation: 'setContractParent',
      args: [
        { type: 'Hash160', value: params.childHash },
        { type: 'Hash160', value: params.parentHash },
      ]
    }
  }
  
  static buildGetContractParentInvocation(scriptHash: string, params: {childHash: string}): ContractInvocation{
    return {
      scriptHash,
      operation: 'getContractParent',
      args: [{ type: 'Hash160', value: params.childHash }],
    }
  }
  
  static buildSetOwnershipInvocation(scriptHash: string, params: {scriptHash: string, sender: string}): ContractInvocation{
    return {
      scriptHash,
      operation: 'setOwnership',
      args: [
        { type: 'Hash160', value: params.scriptHash },
        { type: 'Hash160', value: params.sender },
      ],
    }
  }
  
}
