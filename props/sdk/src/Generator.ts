import { EventCollectionPointer, EventCollectionSampleFrom, EventInstanceCall, EventTypeEnum, EventValue, GeneratorType, InstanceAccessMode, InstanceAuthorizedContracts, SmartContractConfig, TraitType } from './types'
import { ContractInvocation } from '@cityofzion/neo3-invoker'
import fs from "fs";

export function buildCreateGeneratorInvocation(scriptHash: string, params: {label: string, baseGeneratorFee: number}): ContractInvocation{
  return {
    scriptHash,
    operation: 'create_generator',
    args: [
			{type: 'String', value: params.label},
			{type: 'Integer', value: params.baseGeneratorFee},	
    ]
  }
}

export function buildGetGeneratorJSONInvocation(scriptHash: string, params: {generatorId: number}): ContractInvocation{
  return {
    scriptHash,
    operation: 'get_generator_json',
    args: [
			{type: 'Integer', value: params.generatorId},	
    ]
  }
}

export function buildGetTraitJSONInvocation(scriptHash: string, params: {traitId: string}): ContractInvocation{
  return {
    scriptHash,
    operation: 'get_trait_json',
    args: [
			{type: 'String', value: params.traitId},	
    ]
  }
}

export function buildCreateTraitInvocation(scriptHash: string, params: {generatorId: number, trait: TraitType}): ContractInvocation{
  
  const traitLevelsBuffer = {
    type: 'Array', 
    value: params.trait.traitLevels.map(
      (traitLevel)=>({
        type: 'Array', 
        value: [
          { 
            type: 'Integer',
            value: traitLevel.dropScore
          },
          {
            type: 'Integer',
            value: traitLevel.mintMode
          },
          {
            type: 'Array',
            value: traitLevel.traits.map(
              (eventTypeWrapper) => {
                const argsBuffer: {type: string, value: any}[] = []
                
                switch (eventTypeWrapper.type){
                  case EventTypeEnum.CollectionPointer:
                    argsBuffer.push({
                      type: 'Integer',
                      value: (eventTypeWrapper.args as EventCollectionPointer).collectionId
                    })
                    argsBuffer.push({
                      type: 'Integer',
                      value: (eventTypeWrapper.args as EventCollectionPointer).index
                    })
                    break
                  case EventTypeEnum.InstanceCall:
                    argsBuffer.push({
                      type: 'String',
                      value: (eventTypeWrapper.args as EventInstanceCall).scriptHash
                    })
                    argsBuffer.push({
                      type: 'String',
                      value: (eventTypeWrapper.args as EventInstanceCall).method
                    })
                    argsBuffer.push({
                      type: 'Array',
                      value: (eventTypeWrapper.args as EventInstanceCall).param
                    })
                    break
                  case EventTypeEnum.Value:
                    argsBuffer.push({
                      type: 'String',
                      value: (eventTypeWrapper.args as EventValue).value
                    })
                    break
                  case EventTypeEnum.CollectionSampleFrom:
                    argsBuffer.push({
                      type: 'String',
                      value: (eventTypeWrapper.args as EventCollectionSampleFrom).collectionId
                    })
                }
              
                return (
                  {
                    type: 'Array',
                    value: [
                      {
                        type: 'Integer',
                        value: eventTypeWrapper.type 
                      },
                      {
                        type: 'Integer',
                        value: eventTypeWrapper.maxMint 
                      },
                      {
                        type: 'Array',
                        value: argsBuffer
                      }
                    ]
                  }
                )
              }
            )
          }
        ]
      })
    )
  }

  return {
    scriptHash,
    operation: 'create_trait',
    args: [
			{type: 'Integer', value: params.generatorId},
			{type: 'String', value: params.trait.label},
			{type: 'Integer', value: params.trait.slots},
      traitLevelsBuffer
		]
  }
}

export function buildGetGeneratorInstanceJSONInvocation(scriptHash: string, params: {instanceId: number}): ContractInvocation{
  return {
    scriptHash,
    operation: 'get_generator_instance_json',
    args: [
			{type: 'Integer', value: params.instanceId},
		]
  }
}

export function buildCreateInstanceInvocation(scriptHash: string, params: {generatorId: number}): ContractInvocation{
  return {
    scriptHash,
    operation: 'create_instance',
    args: [
			{type: 'Integer', value: params.generatorId},
		]
  }
}

export function buildMintFromInstanceInvocation(scriptHash: string, params: {instanceId: number}): ContractInvocation{
  return {
    scriptHash,
    operation: 'mint_from_instance',
    args: [
			{type: 'String', value: ""},
			{type: 'Integer', value: params.instanceId},
		]
  }
}

export function buildSetInstanceAccessModeInvocation(scriptHash: string, params: {instanceId: number, accessMode: InstanceAccessMode}): ContractInvocation{
  return {
    scriptHash,
    operation: 'set_instance_access_mode',
    args: [
			{type: 'Integer', value: params.instanceId},
			{type: 'Integer', value: params.accessMode},
		]
  }
}

export function buildSetInstanceAuthorizedUsersInvocation(scriptHash: string, params: {instanceId: number, authorizedUsers: string[]}): ContractInvocation{
  return {
    scriptHash,
    operation: 'set_instance_authorized_users',
    args: [
			{type: 'Integer', value: params.instanceId},
			{type: 'Array', value: params.authorizedUsers.map(authorizedUser => ({type: 'Hash160', value: authorizedUser}))},
		]
  }
}

export function buildSetInstanceAuthorizedContractsInvocation(scriptHash: string, params: {instanceId: number, authorizedContracts: InstanceAuthorizedContracts[]}): ContractInvocation{
  return {
    scriptHash,
    operation: 'set_instance_authorized_contracts',
    args: [
			{type: 'Integer', value: params.instanceId},
			{type: 'Array', value: params.authorizedContracts.map(
        authorizedContract => (
          {type: 'Array', value: [
            {type: 'Hash160', value: authorizedContract.scriptHash},
            {type: 'Integer', value: authorizedContract.code},
          ]}
        ))
      },
		]
  }
}

export function buildSetInstanceFeeInvocation(scriptHash: string, params: {instanceId: number, fee: number}): ContractInvocation{
  return {
    scriptHash,
    operation: 'set_instance_fee',
    args: [
			{type: 'Integer', value: params.instanceId},
			{type: 'Integer', value: params.fee},
		]
  }
}

export function buildTotalGeneratorsInvocation(scriptHash: string): ContractInvocation{
  return {
    scriptHash,
    operation: 'total_generators',
    args: []
  }
}

export function buildTotalGeneratorInstancesInvocation(scriptHash: string): ContractInvocation{
  return {
    scriptHash,
    operation: 'total_generator_instances',
    args: []
  }
}

export class Generator {
  node: any
  
  constructor(
    private config: SmartContractConfig
  ) {}

  async createGenerator(options: {label: string, baseGeneratorFee: number}): Promise<string> {    
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildCreateGeneratorInvocation(
          this.config.scriptHash, {label: options.label, baseGeneratorFee: options.baseGeneratorFee}
        )
      ],
      signers: [],
    })
  }

  async createGeneratorFromFile(path: string): Promise<[string, GeneratorType]> {    
    const localGenerator = JSON.parse(fs.readFileSync(path).toString()) as GeneratorType

    return [ await this.config.invoker.invokeFunction({
      invocations: [
        buildCreateGeneratorInvocation(
          this.config.scriptHash, {label: localGenerator.label, baseGeneratorFee: localGenerator.baseGeneratorFee}
        )
      ],
      signers: [],
    }), 
    localGenerator]
  }

  async createTraits(options: {generatorId: number, traits: TraitType[]}): Promise<string>{    

    return await this.config.invoker.invokeFunction({
      invocations: options.traits.map(
        (trait)=>{
          return buildCreateTraitInvocation(
            this.config.scriptHash, { generatorId: options.generatorId, trait }
          )
        }
      ),
      signers: [],
    })
  }

  async getGeneratorJSON(options: {generatorId: number}): Promise<GeneratorType> {
    const res = await this.config.invoker.testInvoke({
			invocations: [
				buildGetGeneratorJSONInvocation(
					this.config.scriptHash, {generatorId: options.generatorId}
				)
			],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}

		const generator = this.config.parser.parseRpcResponse(res.stack[0])
    const gType = generator as GeneratorType

    const traits: TraitType[] = []
    for (let i = 0; i< gType.traits.length; i++){
      const trait = await this.config.invoker.testInvoke({
        invocations: [
          buildGetTraitJSONInvocation(
            this.config.scriptHash, {traitId: gType.traits[i] as string}
          )
        ],
        signers: [],
      })

      if (res.stack.length === 0) {
        throw new Error(res.exception ?? 'unrecognized response')
      }
    
      traits.push(this.config.parser.parseRpcResponse(res.stack[0]) as TraitType)
    }
    gType.traits = traits
    return gType

  }

  async createTrait(options: {generatorId: number, trait: TraitType}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildCreateTraitInvocation(
          this.config.scriptHash, {generatorId: options.generatorId, trait: options.trait}
        )
      ],
      signers: [],
    })
  }

  async getGeneratorInstanceJSON(options: {instanceId: number}): Promise<any> {
		const res = await this.config.invoker.testInvoke({
			invocations: [
				buildGetGeneratorInstanceJSONInvocation(
					this.config.scriptHash, {instanceId: options.instanceId}
				)
			],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}

		return this.config.parser.parseRpcResponse(res.stack[0])
  }
 
  async createInstance(options: {generatorId: number}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildCreateInstanceInvocation(
          this.config.scriptHash, {generatorId: options.generatorId}
        )
      ],
      signers: [],
    })
  }
 
  async mintFromInstance(options: {instanceId: number}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildMintFromInstanceInvocation(
          this.config.scriptHash, {instanceId: options.instanceId}
        )
      ],
      signers: [],
    })
  }
 
  async setInstanceAccessMode(options: {instanceId: number, accessMode: InstanceAccessMode}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildSetInstanceAccessModeInvocation(
          this.config.scriptHash, {instanceId: options.instanceId, accessMode: options.accessMode}
        )
      ],
      signers: [],
    })
  }
 
  async setInstanceAuthorizedUsers(options: {instanceId: number, authorizedUsers: string[]}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildSetInstanceAuthorizedUsersInvocation(
          this.config.scriptHash, {instanceId: options.instanceId, authorizedUsers: options.authorizedUsers}
        )
      ],
      signers: [],
    })
  }
 
  async setInstanceAuthorizedContracts(options: {instanceId: number, authorizedContracts: InstanceAuthorizedContracts[]}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildSetInstanceAuthorizedContractsInvocation(
          this.config.scriptHash, {instanceId: options.instanceId, authorizedContracts: options.authorizedContracts}
        )
      ],
      signers: [],
    })
  }
 
  async setInstanceFee(options: {instanceId: number, fee: number}): Promise<string> {
    return await this.config.invoker.invokeFunction({
      invocations: [
        buildSetInstanceFeeInvocation(
          this.config.scriptHash, {instanceId: options.instanceId, fee: options.fee}
        )
      ],
      signers: [],
    })
  }
 
  async totalGenerators(): Promise<number> {
		const res = await this.config.invoker.testInvoke({
			invocations: [
        buildTotalGeneratorsInvocation(this.config.scriptHash)
			],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}

		return this.config.parser.parseRpcResponse(res.stack[0])
  }
 
  async totalGeneratorInstances(): Promise<number> {
		const res = await this.config.invoker.testInvoke({
			invocations: [
        buildTotalGeneratorInstancesInvocation(this.config.scriptHash)
			],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}

		return this.config.parser.parseRpcResponse(res.stack[0])
  }
 
}