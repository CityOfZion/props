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

[Generator.ts:236](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L236)

## Properties

### config

• `Private` **config**: [`SmartContractConfig`](../modules.md#smartcontractconfig)

#### Defined in

[Generator.ts:237](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L237)

___

### node

• **node**: `any`

#### Defined in

[Generator.ts:234](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L234)

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

[Generator.ts:240](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L240)

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

[Generator.ts:251](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L251)

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

[Generator.ts:346](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L346)

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

[Generator.ts:318](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L318)

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

[Generator.ts:265](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L265)

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

[Generator.ts:329](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L329)

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

[Generator.ts:279](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L279)

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

[Generator.ts:357](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L357)

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

[Generator.ts:368](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L368)

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

[Generator.ts:390](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L390)

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

[Generator.ts:379](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L379)

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

[Generator.ts:401](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L401)

___

### totalGeneratorInstances

▸ **totalGeneratorInstances**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Generator.ts:427](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L427)

___

### totalGenerators

▸ **totalGenerators**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Generator.ts:412](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L412)
