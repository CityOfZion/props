---
id: "Generator"
title: "Class: Generator"
sidebar_label: "Generator"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new Generator**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PropConstructorOptions`](../interfaces/types.PropConstructorOptions.md) |

#### Defined in

[Generator.ts:22](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L22)

## Properties

### networkMagic

• `Private` **networkMagic**: `number` = `-1`

#### Defined in

[Generator.ts:20](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L20)

___

### options

• `Private` **options**: [`PropConstructorOptions`](../interfaces/types.PropConstructorOptions.md) = `DEFAULT_OPTIONS`

#### Defined in

[Generator.ts:19](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L19)

## Accessors

### node

• `get` **node**(): `RPCClient`

#### Returns

`RPCClient`

#### Defined in

[Generator.ts:45](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L45)

___

### scriptHash

• `get` **scriptHash**(): `string`

#### Returns

`string`

#### Defined in

[Generator.ts:52](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L52)

## Methods

### createGenerator

▸ **createGenerator**(`generator`, `signer`, `timeConstantMS`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `generator` | [`GeneratorType`](../interfaces/types.GeneratorType.md) |
| `signer` | `Account` |
| `timeConstantMS` | `number` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[Generator.ts:59](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L59)

___

### createGeneratorFromFile

▸ **createGeneratorFromFile**(`path`, `signer`, `timeConstantMS`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `signer` | `Account` |
| `timeConstantMS` | `number` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[Generator.ts:74](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L74)

___

### createInstance

▸ **createInstance**(`generatorId`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `generatorId` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:100](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L100)

___

### createTrait

▸ **createTrait**(`generatorId`, `trait`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `generatorId` | `number` |
| `trait` | [`TraitType`](../interfaces/types.TraitType.md) |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:79](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L79)

___

### getGeneratorInstanceJSON

▸ **getGeneratorInstanceJSON**(`instanceId`, `signer?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`any`\>

#### Defined in

[Generator.ts:96](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L96)

___

### getGeneratorJSON

▸ **getGeneratorJSON**(`generatorId`, `signer?`): `Promise`<`string` \| [`GeneratorType`](../interfaces/types.GeneratorType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `generatorId` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| [`GeneratorType`](../interfaces/types.GeneratorType.md)\>

#### Defined in

[Generator.ts:83](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L83)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[Generator.ts:40](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L40)

___

### mintFromInstance

▸ **mintFromInstance**(`instanceId`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:104](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L104)

___

### setInstanceAccessMode

▸ **setInstanceAccessMode**(`instanceId`, `accessMode`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `number` |
| `accessMode` | [`InstanceAccessMode`](../enums/types.InstanceAccessMode.md) |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:108](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L108)

___

### setInstanceAuthorizedContracts

▸ **setInstanceAuthorizedContracts**(`instanceId`, `authorizedContracts`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `number` |
| `authorizedContracts` | [`InstanceAuthorizedContracts`](../interfaces/types.InstanceAuthorizedContracts.md)[] |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:116](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L116)

___

### setInstanceAuthorizedUsers

▸ **setInstanceAuthorizedUsers**(`instanceId`, `authorizedUsers`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `number` |
| `authorizedUsers` | `string`[] |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:112](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L112)

___

### setInstanceFee

▸ **setInstanceFee**(`instanceId`, `fee`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `number` |
| `fee` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Generator.ts:120](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L120)

___

### totalGeneratorInstances

▸ **totalGeneratorInstances**(`signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[Generator.ts:128](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L128)

___

### totalGenerators

▸ **totalGenerators**(`signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[Generator.ts:124](https://github.com/CityOfZion/isengard/blob/4359a42/sdk/src/Generator.ts#L124)
