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

All of the prop helper classes will auto-configure your network settings.  The default configuration will interface with
the contract compiled with this project and deployed locally at http://localhost:50012.  For more information on deploying
contract packages, refer to the quickstart.

All methods support a signer.  If the method can be run as a test-invoke, optionally populating the signer parameter
will publish the invocation and return the txid instead of the method response.

To use this class:
```typescript
import {Collection} from "../../dist" //import {Collection} from "@cityofzion/props

const collection: Collection = new Collection()
await collection.init() // interfaces with the node to resolve network magic

const total = await collection.totalCollections()
console.log(total) // outputs the total collection count in the contract
```

## Constructors

### constructor

• **new Collection**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PropConstructorOptions`](../interfaces/types.PropConstructorOptions.md) |

#### Defined in

[Collection.ts:41](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L41)

## Properties

### networkMagic

• `Private` **networkMagic**: `number` = `-1`

#### Defined in

[Collection.ts:39](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L39)

___

### options

• `Private` **options**: [`PropConstructorOptions`](../interfaces/types.PropConstructorOptions.md) = `DEFAULT_OPTIONS`

#### Defined in

[Collection.ts:38](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L38)

## Accessors

### node

• `get` **node**(): `RPCClient`

The the node that the instance is connected to.

#### Returns

`RPCClient`

#### Defined in

[Collection.ts:70](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L70)

___

### scriptHash

• `get` **scriptHash**(): `string`

The contract script hash that is being interfaced with.

#### Returns

`string`

#### Defined in

[Collection.ts:80](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L80)

## Methods

### createCollection

▸ **createCollection**(`description`, `collectionType`, `extra`, `values`, `signer`): `Promise`<`string`\>

Publishes an array of immutable data to the smart contract along with some useful metadata.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `description` | `string` | A useful description of the collection. |
| `collectionType` | `string` | The type of the data being store.  This is an unregulated field.  Standard NVM datatypes should adhere to existing naming conventions. |
| `extra` | `string` | An unregulated field for unplanned feature development. |
| `values` | `string`[] | An array of values that represent the body of the collection. |
| `signer` | `Account` | The signer of the transaction. |

#### Returns

`Promise`<`string`\>

A transaction ID.  Refer to [helpers.txDidComplete](../namespaces/helpers.md#txdidcomplete) for parsing.

#### Defined in

[Collection.ts:99](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L99)

___

### createFromFile

▸ **createFromFile**(`path`, `signer`): `Promise`<`string`\>

Loads a [CollectionType](../interfaces/types.CollectionType.md) formatted JSON file and pushes it to the smart contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The path to the file. |
| `signer` | `Account` | The signer of the transaction. |

#### Returns

`Promise`<`string`\>

A transaction ID. Refer to {@link helper.txDidComplete} for parsing.

#### Defined in

[Collection.ts:111](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L111)

___

### getCollection

▸ **getCollection**(`collectionId`, `signer?`): `Promise`<`string`\>

Gets the bytestring representation of the collection.  This is primarilly used for inter-contract interfacing,
but we include it here for completeness.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`string`\>

The bytestring representation of the collection. **OR** a txid if the signer parameter is populated.

#### Defined in

[Collection.ts:147](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L147)

___

### getCollectionElement

▸ **getCollectionElement**(`collectionId`, `index`, `signer?`): `Promise`<`string`\>

Returns the value of a collection from a requested index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |
| `index` | `number` | The index of the array element being requested. |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`string`\>

The value of the collection element **OR** a txid if the signer parameter is populated.

#### Defined in

[Collection.ts:161](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L161)

___

### getCollectionJSON

▸ **getCollectionJSON**(`collectionId`, `signer?`): `Promise`<`string` \| [`CollectionType`](../interfaces/types.CollectionType.md)\>

Gets a JSON formatting collection from the smart contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`string` \| [`CollectionType`](../interfaces/types.CollectionType.md)\>

The requested collection **OR** a txid if the signer parameter is populated.

#### Defined in

[Collection.ts:133](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L133)

___

### getCollectionLength

▸ **getCollectionLength**(`collectionId`, `signer?`): `Promise`<`number`\>

Gets the array length of a requested collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`number`\>

The length of the collection **OR** a txid if the signer parameter is populated.

#### Defined in

[Collection.ts:174](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L174)

___

### getCollectionValues

▸ **getCollectionValues**(`collectionId`, `signer?`): `Promise`<`any`\>

Gets the values of a collection, omitting the metadata.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`any`\>

The values in the collection **OR** a txid if the signer parameter is populated.

#### Defined in

[Collection.ts:187](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L187)

___

### init

▸ **init**(): `Promise`<`void`\>

Gets the magic number for the network and configures the class instance.

#### Returns

`Promise`<`void`\>

#### Defined in

[Collection.ts:62](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L62)

___

### mapBytesOntoCollection

▸ **mapBytesOntoCollection**(`collectionId`, `entropy`, `signer?`): `Promise`<`string`\>

Maps byte entropy onto a collection's values and returns the index of the result.  The mapping is made as follows:

[0 -> MAX(entropyBytes.length)][entropy] -> [0 -> collection.length][index]

This method is primarily useful for computationally efficient contract interfacing. For random sampling, or
sampling from a distribution, use [getCollectionLength](Collection.md#getcollectionlength) in combination with [getCollectionElement](Collection.md#getcollectionelement) or
[sampleFromCollection](Collection.md#samplefromcollection).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |
| `entropy` | `string` | Bytes to use for the mapping. |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`string`\>

The element from the mapping **OR** a txid if the signer parameter is populated.

#### Defined in

[Collection.ts:207](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L207)

___

### sampleFromCollection

▸ **sampleFromCollection**(`collectionId`, `samples`, `signer?`): `Promise`<`string`\>

Samples a uniform random value from the collection using a Contract.Call to the [Dice](Dice.md) contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `number` | The collectionID being requested.  Refer to [https://props.coz.io](https://props.coz.io) for a formatted list. |
| `samples` | `number` | The number of samples to return |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`string`\>

A uniform random sample from the collection. **OR** a txid if the signer parameter is populated.
**Note:** This method will not randomly generate unless the transaction is published so use the signer field for
testing.

#### Defined in

[Collection.ts:223](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L223)

___

### totalCollections

▸ **totalCollections**(`signer?`): `Promise`<`undefined` \| `number`\>

Gets the total collections.  Collection IDs are autogenerated on range [1 -> totalCollections] inclusive if you are
planning to iterate of their collection IDs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`undefined` \| `number`\>

The total number of collections stored in the contract. **OR** a txid if the signer parameter is populated.

#### Defined in

[Collection.ts:236](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L236)

___

### update

▸ **update**(`script`, `manifest`, `signer`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `script` | `string` |
| `manifest` | `string` |
| `signer` | `Account` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[Collection.ts:240](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/Collection.ts#L240)
