---
id: "Generator"
title: "Class: Generator"
sidebar_label: "Generator"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new Generator**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`SmartContractConfig`](../modules.md#smartcontractconfig) |

#### Defined in

[Generator.ts:13](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L13)

## Properties

### config

• `Private` **config**: [`SmartContractConfig`](../modules.md#smartcontractconfig)

#### Defined in

[Generator.ts:14](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L14)

___

### node

• **node**: `any`

#### Defined in

[Generator.ts:11](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L11)

___

### MAINNET

▪ `Static` **MAINNET**: `string` = `'0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9'`

#### Defined in

[Generator.ts:8](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L8)

___

### TESTNET

▪ `Static` **TESTNET**: `string` = `''`

#### Defined in

[Generator.ts:9](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L9)

## Methods

### createGenerator

▸ **createGenerator**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.baseGeneratorFee` | `number` |
| `options.label` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:17](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L17)

___

### createGeneratorFromFile

▸ **createGeneratorFromFile**(`path`): `Promise`<[`string`, [`GeneratorType`](../interfaces/GeneratorType.md)]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<[`string`, [`GeneratorType`](../interfaces/GeneratorType.md)]\>

#### Defined in

[Generator.ts:28](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L28)

___

### createInstance

▸ **createInstance**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.generatorId` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:123](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L123)

___

### createTrait

▸ **createTrait**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.generatorId` | `number` |
| `options.trait` | [`TraitType`](../interfaces/TraitType.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:95](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L95)

___

### createTraits

▸ **createTraits**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.generatorId` | `number` |
| `options.traits` | [`TraitType`](../interfaces/TraitType.md)[] |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:42](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L42)

___

### getGeneratorInstanceJSON

▸ **getGeneratorInstanceJSON**(`options`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.instanceId` | `number` |

#### Returns

`Promise`<`any`\>

#### Defined in

[Generator.ts:106](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L106)

___

### getGeneratorJSON

▸ **getGeneratorJSON**(`options`): `Promise`<[`GeneratorType`](../interfaces/GeneratorType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.generatorId` | `number` |

#### Returns

`Promise`<[`GeneratorType`](../interfaces/GeneratorType.md)\>

#### Defined in

[Generator.ts:56](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L56)

___

### mintFromInstance

▸ **mintFromInstance**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.instanceId` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:134](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L134)

___

### setInstanceAccessMode

▸ **setInstanceAccessMode**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.accessMode` | [`InstanceAccessMode`](../enums/InstanceAccessMode.md) |
| `options.instanceId` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:145](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L145)

___

### setInstanceAuthorizedContracts

▸ **setInstanceAuthorizedContracts**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.authorizedContracts` | [`InstanceAuthorizedContracts`](../interfaces/InstanceAuthorizedContracts.md)[] |
| `options.instanceId` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:167](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L167)

___

### setInstanceAuthorizedUsers

▸ **setInstanceAuthorizedUsers**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.authorizedUsers` | `string`[] |
| `options.instanceId` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:156](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L156)

___

### setInstanceFee

▸ **setInstanceFee**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.fee` | `number` |
| `options.instanceId` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:178](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L178)

___

### totalGeneratorInstances

▸ **totalGeneratorInstances**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Generator.ts:204](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L204)

___

### totalGenerators

▸ **totalGenerators**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Generator.ts:189](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L189)

___

### buildCreateGeneratorInvocation

▸ `Static` **buildCreateGeneratorInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.baseGeneratorFee` | `number` |
| `params.label` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:220](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L220)

___

### buildCreateInstanceInvocation

▸ `Static` **buildCreateInstanceInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.generatorId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:360](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L360)

___

### buildCreateTraitInvocation

▸ `Static` **buildCreateTraitInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.generatorId` | `number` |
| `params.trait` | [`TraitType`](../interfaces/TraitType.md) |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:251](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L251)

___

### buildGetGeneratorInstanceJSONInvocation

▸ `Static` **buildGetGeneratorInstanceJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:350](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L350)

___

### buildGetGeneratorJSONInvocation

▸ `Static` **buildGetGeneratorJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.generatorId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:231](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L231)

___

### buildGetTraitJSONInvocation

▸ `Static` **buildGetTraitJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.traitId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:241](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L241)

___

### buildMintFromInstanceInvocation

▸ `Static` **buildMintFromInstanceInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:370](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L370)

___

### buildSetInstanceAccessModeInvocation

▸ `Static` **buildSetInstanceAccessModeInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.accessMode` | [`InstanceAccessMode`](../enums/InstanceAccessMode.md) |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:381](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L381)

___

### buildSetInstanceAuthorizedContractsInvocation

▸ `Static` **buildSetInstanceAuthorizedContractsInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.authorizedContracts` | [`InstanceAuthorizedContracts`](../interfaces/InstanceAuthorizedContracts.md)[] |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:403](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L403)

___

### buildSetInstanceAuthorizedUsersInvocation

▸ `Static` **buildSetInstanceAuthorizedUsersInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.authorizedUsers` | `string`[] |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:392](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L392)

___

### buildSetInstanceFeeInvocation

▸ `Static` **buildSetInstanceFeeInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.fee` | `number` |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:421](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L421)

___

### buildTotalGeneratorInstancesInvocation

▸ `Static` **buildTotalGeneratorInstancesInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:440](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L440)

___

### buildTotalGeneratorsInvocation

▸ `Static` **buildTotalGeneratorsInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:432](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Generator.ts#L432)
