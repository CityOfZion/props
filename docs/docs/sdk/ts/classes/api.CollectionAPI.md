---
id: "api.CollectionAPI"
title: "Class: CollectionAPI"
sidebar_label: "CollectionAPI"
custom_edit_url: null
---

[api](../namespaces/api.md).CollectionAPI

## Constructors

### constructor

• **new CollectionAPI**()

## Methods

### createCollection

▸ `Static` **createCollection**(`node`, `networkMagic`, `contractHash`, `description`, `collection_type`, `extra`, `values`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `description` | `string` |
| `collection_type` | `string` |
| `extra` | `any` |
| `values` | `string`[] |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/collection.ts:10](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L10)

___

### createCollectionRaw

▸ `Static` **createCollectionRaw**(`node`, `networkMagic`, `contractHash`, `description`, `collection_type`, `extra`, `values`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `description` | `string` |
| `collection_type` | `string` |
| `extra` | `any` |
| `values` | `ContractParamLike`[] |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/collection.ts:40](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L40)

___

### getCollection

▸ `Static` **getCollection**(`node`, `networkMagic`, `contractHash`, `collectionId`, `signer?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `collectionId` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/collection.ts:125](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L125)

___

### getCollectionElement

▸ `Static` **getCollectionElement**(`node`, `networkMagic`, `contractHash`, `collectionId`, `index`, `signer?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `collectionId` | `number` |
| `index` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/collection.ts:143](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L143)

___

### getCollectionJSON

▸ `Static` **getCollectionJSON**(`node`, `networkMagic`, `contractHash`, `collectionId`, `signer?`): `Promise`<`string` \| [`CollectionType`](../interfaces/types.CollectionType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `collectionId` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| [`CollectionType`](../interfaces/types.CollectionType.md)\>

#### Defined in

[api/collection.ts:66](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L66)

___

### getCollectionLength

▸ `Static` **getCollectionLength**(`node`, `networkMagic`, `contractHash`, `collectionId`, `signer?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `collectionId` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`number`\>

#### Defined in

[api/collection.ts:163](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L163)

___

### getCollectionValues

▸ `Static` **getCollectionValues**(`node`, `networkMagic`, `contractHash`, `collectionId`, `signer?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `collectionId` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`any`\>

#### Defined in

[api/collection.ts:181](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L181)

___

### mapBytesOntoCollection

▸ `Static` **mapBytesOntoCollection**(`node`, `networkMagic`, `contractHash`, `collectionId`, `entropy`, `signer?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `collectionId` | `number` |
| `entropy` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/collection.ts:202](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L202)

___

### sampleFromCollection

▸ `Static` **sampleFromCollection**(`node`, `networkMagic`, `contractHash`, `collectionId`, `samples`, `signer?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `collectionId` | `number` |
| `samples` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/collection.ts:222](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L222)

___

### totalCollections

▸ `Static` **totalCollections**(`node`, `networkMagic`, `contractHash`, `signer?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`number`\>

#### Defined in

[api/collection.ts:242](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L242)

___

### update

▸ `Static` **update**(`node`, `networkMagic`, `contractHash`, `script`, `manifest`, `data`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `script` | `string` |
| `manifest` | `string` |
| `data` | `any` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/collection.ts:260](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/api/collection.ts#L260)
