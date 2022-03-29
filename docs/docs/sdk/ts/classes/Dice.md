---
id: "Dice"
title: "Class: Dice"
sidebar_label: "Dice"
sidebar_position: 0
custom_edit_url: null
---

The dice prop normalizes a lot of behaviors associated with random number generation to improve usability within
projects.

All of the prop helper classes will auto-configure your network settings.  The default configuration will interface with
the contract compiled with this project and deployed locally at http://localhost:50012.  For more information on deploying
contract packages, refer to the quickstart.

All methods support a signer.  If the method can be run as a test-invoke, optionally populating the signer parameter
will publish the invocation and return the txid instead of the method response.

To use this class:
```typescript
import {Dice} from "../../dist" //import {Dice} from "@cityofzion/props

const dice: Dice = new Dice()
await dice.init() // interfaces with the node to resolve network magic

const randomNumber = await dice.randBetween(0, 100)
console.log(randomNumber) // outputs the random number. You should include a signer to the method above
for a truly random number.
```

## Constructors

### constructor

• **new Dice**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PropConstructorOptions`](../interfaces/types.PropConstructorOptions.md) |

#### Defined in

[Dice.ts:38](https://github.com/CityOfZion/isengard/blob/98f6c55/sdk/src/Dice.ts#L38)

## Properties

### networkMagic

• `Private` **networkMagic**: `number` = `-1`

#### Defined in

[Dice.ts:36](https://github.com/CityOfZion/isengard/blob/98f6c55/sdk/src/Dice.ts#L36)

___

### options

• `Private` **options**: [`PropConstructorOptions`](../interfaces/types.PropConstructorOptions.md) = `DEFAULT_OPTIONS`

#### Defined in

[Dice.ts:35](https://github.com/CityOfZion/isengard/blob/98f6c55/sdk/src/Dice.ts#L35)

## Accessors

### node

• `get` **node**(): `RPCClient`

The the node that the instance is connected to.

#### Returns

`RPCClient`

#### Defined in

[Dice.ts:67](https://github.com/CityOfZion/isengard/blob/98f6c55/sdk/src/Dice.ts#L67)

___

### scriptHash

• `get` **scriptHash**(): `string`

The contract script hash that is being interfaced with.

#### Returns

`string`

#### Defined in

[Dice.ts:77](https://github.com/CityOfZion/isengard/blob/98f6c55/sdk/src/Dice.ts#L77)

## Methods

### init

▸ **init**(): `Promise`<`void`\>

Gets the magic number for the network and configures the class instance.

#### Returns

`Promise`<`void`\>

#### Defined in

[Dice.ts:59](https://github.com/CityOfZion/isengard/blob/98f6c55/sdk/src/Dice.ts#L59)

___

### mapBytesOntoRange

▸ **mapBytesOntoRange**(`start`, `end`, `entropy`, `signer?`): `Promise`<`string` \| `number`\>

Maps bytes onto a range of numbers:

[0 -> Max(entropy.length)][entropy] --> [start, end]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | the minimum value for the selection range. |
| `end` | `number` | the maximum value for the selection range. |
| `entropy` | `string` | the bytes used in the sampling. |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`string` \| `number`\>

The resulting number from the mapping. **OR** a txid if the signer parameter is populated.

#### Defined in

[Dice.ts:114](https://github.com/CityOfZion/isengard/blob/98f6c55/sdk/src/Dice.ts#L114)

___

### randBetween

▸ **randBetween**(`start`, `end`, `signer?`): `Promise`<`string` \| `number`\>

Gets a random number of range [start -> end] inclusive. This method supports negative integer ranges.

**Note:**
This method must include a  signer to produce truly random numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | the minimum value for the selection range. |
| `end` | `number` | the maximum value for the selection range. |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`string` \| `number`\>

The pseudo-random number. **OR** a txid if the signer parameter is populated.

#### Defined in

[Dice.ts:97](https://github.com/CityOfZion/isengard/blob/98f6c55/sdk/src/Dice.ts#L97)

___

### rollDiceWithEntropy

▸ **rollDiceWithEntropy**(`die`, `precision`, `entropy`, `signer?`): `Promise`<`any`\>

Calculates dice rolls using provided entropy.  This method will return and array of length `entropy.length / precision`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `die` | `string` | The die to roll. The input format can support arbitarilly large dice which are effectively spherical.. or more traditional ones. e.g. 'd6' |
| `precision` | `number` | The number of bytes to use for each sample.  Sampling at a precision below the fidelity of your range will succeed, but your results will be overly-discrete. |
| `entropy` | `string` | The bytes of data used to seed the sampling. |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`any`\>

An array of dice rolls. **OR** a txid if the signer parameter is populated.

#### Defined in

[Dice.ts:148](https://github.com/CityOfZion/isengard/blob/98f6c55/sdk/src/Dice.ts#L148)

___

### rollDie

▸ **rollDie**(`die`, `signer?`): `Promise`<`string` \| `number`\>

Rolls for a `dX` formatted random number.

**Note:**
This method must include a  signer to produce truly random numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `die` | `string` | The die to roll. The input format can support arbitarilly large dice which are effectively spherical.. or more traditional ones. e.g. 'd6' |
| `signer?` | `Account` | An optional signer. Populating this field will publish the transaction and return a txid instead of running the invocation as a test invoke. |

#### Returns

`Promise`<`string` \| `number`\>

The result of the die roll **OR** a txid if the signer parameter is populated.

#### Defined in

[Dice.ts:131](https://github.com/CityOfZion/isengard/blob/98f6c55/sdk/src/Dice.ts#L131)
