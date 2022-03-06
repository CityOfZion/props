---
id: "api.GeneratorAPI"
title: "Class: GeneratorAPI"
sidebar_label: "GeneratorAPI"
custom_edit_url: null
---

[api](../namespaces/api.md).GeneratorAPI

## Constructors

### constructor

• **new GeneratorAPI**()

## Methods

### createGenerator

▸ `Static` **createGenerator**(`node`, `networkMagic`, `contractHash`, `label`, `baseGeneratorFee`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `label` | `string` |
| `baseGeneratorFee` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/generator.ts:18](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L18)

___

### createInstance

▸ `Static` **createInstance**(`node`, `networkMagic`, `contractHash`, `generatorId`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `generatorId` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/generator.ts:36](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L36)

___

### createTrait

▸ `Static` **createTrait**(`node`, `networkMagic`, `contractHash`, `generatorId`, `label`, `slots`, `levels`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `generatorId` | `number` |
| `label` | `string` |
| `slots` | `number` |
| `levels` | [`TraitLevel`](../interfaces/types.TraitLevel.md)[] |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/generator.ts:52](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L52)

___

### getGeneratorInstanceJSON

▸ `Static` **getGeneratorInstanceJSON**(`node`, `networkMagic`, `contractHash`, `instanceId`, `signer?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `instanceId` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`any`\>

#### Defined in

[api/generator.ts:155](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L155)

___

### getGeneratorJSON

▸ `Static` **getGeneratorJSON**(`node`, `networkMagic`, `contractHash`, `generatorId`, `signer?`): `Promise`<`string` \| [`GeneratorType`](../interfaces/types.GeneratorType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `generatorId` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| [`GeneratorType`](../interfaces/types.GeneratorType.md)\>

#### Defined in

[api/generator.ts:113](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L113)

___

### getTraitJSON

▸ `Static` **getTraitJSON**(`node`, `networkMagic`, `contractHash`, `traitId`, `signer?`): `Promise`<`string` \| [`TraitType`](../interfaces/types.TraitType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `traitId` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| [`TraitType`](../interfaces/types.TraitType.md)\>

#### Defined in

[api/generator.ts:133](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L133)

___

### mintFromInstance

▸ `Static` **mintFromInstance**(`node`, `networkMagic`, `contractHash`, `instanceId`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `instanceId` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/generator.ts:175](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L175)

___

### setInstanceAccessMode

▸ `Static` **setInstanceAccessMode**(`node`, `networkMagic`, `contractHash`, `instanceId`, `accessMode`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `instanceId` | `number` |
| `accessMode` | [`InstanceAccessMode`](../enums/types.InstanceAccessMode.md) |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/generator.ts:192](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L192)

___

### setInstanceAuthorizedContracts

▸ `Static` **setInstanceAuthorizedContracts**(`node`, `networkMagic`, `contractHash`, `instanceId`, `authorizedContracts`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `instanceId` | `number` |
| `authorizedContracts` | [`InstanceAuthorizedContracts`](../interfaces/types.InstanceAuthorizedContracts.md)[] |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/generator.ts:232](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L232)

___

### setInstanceAuthorizedUsers

▸ `Static` **setInstanceAuthorizedUsers**(`node`, `networkMagic`, `contractHash`, `instanceId`, `authorizedUsers`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `instanceId` | `number` |
| `authorizedUsers` | `string`[] |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/generator.ts:210](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L210)

___

### setInstanceFee

▸ `Static` **setInstanceFee**(`node`, `networkMagic`, `contractHash`, `instanceId`, `fee`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `instanceId` | `number` |
| `fee` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/generator.ts:257](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L257)

___

### totalGeneratorInstances

▸ `Static` **totalGeneratorInstances**(`node`, `networkMagic`, `contractHash`, `signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[api/generator.ts:290](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L290)

___

### totalGenerators

▸ `Static` **totalGenerators**(`node`, `networkMagic`, `contractHash`, `signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[api/generator.ts:275](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/generator.ts#L275)
