---
id: "Collection"
title: "Class: Collection"
sidebar_label: "Collection"
sidebar_position: 0
custom_edit_url: null
---

The Collection prop is designed to store static-immutable data for reference in other projects. Storing static data
in contracts is very expensive and inefficient, especially for new projects.  This contract resolves that issue by creating
library for static data. This class exposes the interface along with a number of helpful features to make the smart
contract easy to use for typescript developers.

All of the props smart contract interface classes will need a scripthash, and a `Neo3-Invoker` and `Neo3Parser` to be initialized.  For more information on deploying
contract packages, refer to the [quickstart](https://props.coz.io/d/docs/sdk/ts/#quickstart).

To use this class:
```typescript
import { Collection } from "@cityofzion/props"

const node = //refer to dora.coz.io/monitor for a list of nodes.
const scriptHash = //refer to the scriptHashes section above
const neo3Invoker = await NeonInvoker.init(node) // need to instantiate a Neo3Invoker, currently only NeonInvoker implements this interface
const neo3Parser = NeonParser // need to use a Neo3Parser, currently only NeonParser implements this interface
const puppet = await new Collection({
      scriptHash,
      invoker: neo3Invoker,
      parser: neo3Parser,
})

const total = await collection.totalCollections()
console.log(total) // outputs the total collection count in the contract
```

## Constructors

### constructor

• **new Collection**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`SmartContractConfig`](../modules.md#smartcontractconfig) |

#### Defined in

[Collection.ts:39](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L39)

## Properties

### config

• `Private` **config**: [`SmartContractConfig`](../modules.md#smartcontractconfig)

#### Defined in

[Collection.ts:40](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L40)

___

### MAINNET

▪ `Static` **MAINNET**: `string` = `'0xf05651bc505fd5c7d36593f6e8409932342f9085'`

#### Defined in

[Collection.ts:36](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L36)

___

### TESTNET

▪ `Static` **TESTNET**: `string` = `''`

#### Defined in

[Collection.ts:37](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L37)

## Methods

### createCollection

▸ **createCollection**(`options`): `Promise`<`string`\>

Publishes an array of immutable data to the smart contract along with some useful metadata.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionType` | `string` | The type of the data being store.  This is an unregulated field.  Standard NVM datatypes should  adhere to existing naming conventions. |
| `options.description` | `string` | A useful description of the collection. |
| `options.extra` | `string` | An unregulated field for unplanned feature development. |
| `options.values` | (`string` \| `number`)[] | An array of values that represent the body of the collection. |

#### Returns

`Promise`<`string`\>

The transaction id of a transaction that will return the new collection id.

#### Defined in

[Collection.ts:56](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L56)

___

### createFromFile

▸ **createFromFile**(`path`): `Promise`<`string`\>

Loads a [CollectionType](../interfaces/CollectionType.md) formatted JSON file and pushes it to the smart contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The path to the file. |

#### Returns

`Promise`<`string`\>

The transaction id of a transaction that will return the new collection id.

#### Defined in

[Collection.ts:82](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L82)

___

### getCollection

▸ **getCollection**(`options`): `Promise`<`string`\>

Gets the bytestring representation of the collection.  This is primarilly used for inter-contract interfacing,
but we include it here for completeness.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |

#### Returns

`Promise`<`string`\>

The requested collection.

#### Defined in

[Collection.ts:136](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L136)

___

### getCollectionElement

▸ **getCollectionElement**(`options`): `Promise`<`string`\>

Returns the value of a collection from a requested index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |
| `options.index` | `number` | The index of the array element being requested. |

#### Returns

`Promise`<`string`\>

The value of the collection element.

#### Defined in

[Collection.ts:162](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L162)

___

### getCollectionJSON

▸ **getCollectionJSON**(`options`): `Promise`<[`CollectionType`](../interfaces/CollectionType.md)\>

Gets a JSON formatting collection from the smart contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |

#### Returns

`Promise`<[`CollectionType`](../interfaces/CollectionType.md)\>

The requested collection.

#### Defined in

[Collection.ts:110](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L110)

___

### getCollectionLength

▸ **getCollectionLength**(`options`): `Promise`<`number`\>

Gets the array length of a requested collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |

#### Returns

`Promise`<`number`\>

The length of the collection.

#### Defined in

[Collection.ts:187](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L187)

___

### getCollectionValues

▸ **getCollectionValues**(`options`): `Promise`<(`string` \| `number`)[]\>

Gets the values of a collection, omitting the metadata.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |

#### Returns

`Promise`<(`string` \| `number`)[]\>

The values in the collection.

#### Defined in

[Collection.ts:212](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L212)

___

### mapBytesOntoCollection

▸ **mapBytesOntoCollection**(`options`): `Promise`<`string`\>

Maps byte entropy onto a collection's values and returns the index of the result.  The mapping is made as follows:

[0 -> MAX(entropyBytes.length)][entropy] -> [0 -> collection.length][index]

This method is primarily useful for computationally efficient contract interfacing. For random sampling, or
sampling from a distribution, use [getCollectionLength](Collection.md#getcollectionlength) in combination with [getCollectionElement](Collection.md#getcollectionelement) or
[sampleFromCollection](Collection.md#samplefromcollection).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |
| `options.entropy` | `string` | Bytes to use for the mapping. |

#### Returns

`Promise`<`string`\>

The element from the mapping.

#### Defined in

[Collection.ts:244](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L244)

___

### sampleFromCollection

▸ **sampleFromCollection**(`options`): `Promise`<`string`\>

Samples a uniform random value from the collection using a Contract.Call to the [Dice](Dice.md) contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |
| `options.samples` | `number` | The number of samples to return |

#### Returns

`Promise`<`string`\>

The transaction id of a transaction that will return a uniform random sample from the collection.

**Note:** This method will not randomly generate unless the transaction is published so use the signer field for
testing.

#### Defined in

[Collection.ts:276](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L276)

___

### sampleFromRuntimeCollection

▸ **sampleFromRuntimeCollection**(`options`): `Promise`<`string`\>

Samples uniformly from a collection provided at the time of invocation.  Users have the option to 'pick', which
prevents a value from being selected multiple times.  The results are published as outputs on the transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.pick` | `boolean` | Are selected values removed from the list of options for future samples? |
| `options.samples` | `number` | the number of samples to fairly select from the values |
| `options.values` | `string`[] | an array of values to sample from |

#### Returns

`Promise`<`string`\>

The transaction id of a transaction that will return a uniform random sample from the collection.

**Note:** This method will not randomly generate unless the transaction is published so use the signer field for
testing.

#### Defined in

[Collection.ts:304](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L304)

___

### totalCollections

▸ **totalCollections**(): `Promise`<`number`\>

Gets the total collections.  Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
planning to iterate of their collection IDs.

#### Returns

`Promise`<`number`\>

The total number of collections stored in the contract.

#### Defined in

[Collection.ts:322](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L322)

___

### update

▸ **update**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.data?` | `any` |
| `options.manifest` | `string` |
| `options.script` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Collection.ts:339](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L339)

___

### buildCreateCollectionInvocation

▸ `Static` **buildCreateCollectionInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionType` | `string` |
| `params.description` | `string` |
| `params.extra` | `string` |
| `params.values` | (`string` \| `number`)[] |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:354](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L354)

___

### buildGetCollectionElementInvocation

▸ `Static` **buildGetCollectionElementInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |
| `params.index` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:387](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L387)

___

### buildGetCollectionInvocation

▸ `Static` **buildGetCollectionInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:377](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L377)

___

### buildGetCollectionJSONInvocation

▸ `Static` **buildGetCollectionJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:367](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L367)

___

### buildGetCollectionLengthInvocation

▸ `Static` **buildGetCollectionLengthInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:398](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L398)

___

### buildGetCollectionValuesInvocation

▸ `Static` **buildGetCollectionValuesInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:408](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L408)

___

### buildMapBytesOntoCollectionInvocation

▸ `Static` **buildMapBytesOntoCollectionInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |
| `params.entropy` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:418](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L418)

___

### buildSampleFromCollectionInvocation

▸ `Static` **buildSampleFromCollectionInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |
| `params.samples` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:429](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L429)

___

### buildSampleFromRuntimeCollectionInvocation

▸ `Static` **buildSampleFromRuntimeCollectionInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.pick` | `boolean` |
| `params.samples` | `number` |
| `params.values` | `string`[] |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:440](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L440)

___

### buildTotalCollectionsInvocation

▸ `Static` **buildTotalCollectionsInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:452](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L452)

___

### buildUpdateInvocation

▸ `Static` **buildUpdateInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.data` | `any` |
| `params.manifest` | `string` |
| `params.script` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:460](https://github.com/CityOfZion/props/blob/cdf3f2f/sdk/src/Collection.ts#L460)
