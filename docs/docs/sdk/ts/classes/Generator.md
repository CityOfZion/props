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

[Generator.ts:23](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L23)

## Properties

### networkMagic

• `Private` **networkMagic**: `number` = `-1`

#### Defined in

[Generator.ts:21](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L21)

___

### options

• `Private` **options**: [`PropConstructorOptions`](../interfaces/types.PropConstructorOptions.md)

#### Defined in

[Generator.ts:20](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L20)

## Accessors

### node

• `get` **node**(): `RPCClient`

#### Returns

`RPCClient`

#### Defined in

[Generator.ts:32](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L32)

___

### scriptHash

• `get` **scriptHash**(): `string`

#### Returns

`string`

#### Defined in

[Generator.ts:39](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L39)

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

[Generator.ts:46](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L46)

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

[Generator.ts:61](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L61)

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

[Generator.ts:87](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L87)

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

[Generator.ts:66](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L66)

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

[Generator.ts:83](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L83)

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

[Generator.ts:70](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L70)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[Generator.ts:27](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L27)

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

[Generator.ts:91](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L91)

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

[Generator.ts:95](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L95)

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

[Generator.ts:103](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L103)

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

[Generator.ts:99](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L99)

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

[Generator.ts:107](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L107)

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

[Generator.ts:115](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L115)

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

[Generator.ts:111](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/Generator.ts#L111)
