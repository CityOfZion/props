---
id: "Dice"
title: "Class: Dice"
sidebar_label: "Dice"
sidebar_position: 0
custom_edit_url: null
---

The dice prop normalizes a lot of behaviors associated with random number generation to improve usability within
projects.

All of the props smart contract interface classes will need a scripthash, and a `Neo3-Invoker` and `Neo3Parser` to be initialized.  For more information on deploying
contract packages, refer to the [quickstart](https://props.coz.io/d/docs/sdk/ts/#quickstart).

To use this class:
```typescript
import { Dice } from "@cityofzion/props"

const node = //refer to dora.coz.io/monitor for a list of nodes.
const scriptHash = //refer to the scriptHashes section above
const account = // need to send either an wallet.Account() or undefined, testInvokes don't need an account
const neo3Invoker = await NeonInvoker.init(node, account) // need to instantiate a Neo3Invoker, currently only NeonInvoker implements this interface
const neo3Parser = NeonParser // need to use a Neo3Parser, currently only NeonParser implements this interface
const dice = await new Dice({
      scriptHash,
      invoker: neo3Invoker,
      parser: neo3Parser,
})

const randomNumber = await dice.randBetween({ start: 0, end: 100 })
console.log(randomNumber)
```

## Constructors

### constructor

• **new Dice**(`configOptions`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `configOptions` | [`SmartContractConfig`](../modules.md#smartcontractconfig) |

#### Defined in

[Dice.ts:40](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L40)

## Properties

### config

• `Private` **config**: [`SmartContractConfig`](../modules.md#smartcontractconfig)

#### Defined in

[Dice.ts:38](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L38)

___

### MAINNET

▪ `Static` **MAINNET**: `string` = `'0x4380f2c1de98bb267d3ea821897ec571a04fe3e0'`

#### Defined in

[Dice.ts:35](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L35)

___

### TESTNET

▪ `Static` **TESTNET**: `string` = `''`

#### Defined in

[Dice.ts:36](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L36)

## Methods

### mapBytesOntoRange

▸ **mapBytesOntoRange**(`options`): `Promise`<`string` \| `number`\>

Maps bytes onto a range of numbers:

[0 -> Max(entropy.length)][entropy] --> [start, end]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.end` | `number` | the maximum value for the selection range. |
| `options.entropy` | `string` | the bytes used in the sampling. |
| `options.start` | `number` | the minimum value for the selection range. |

#### Returns

`Promise`<`string` \| `number`\>

The resulting number from the mapping.

#### Defined in

[Dice.ts:82](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L82)

___

### randBetween

▸ **randBetween**(`options`): `Promise`<`string`\>

Gets a random number of range [start -> end] inclusive. This method supports negative integer ranges.

**Note:**
This method must include a signer to produce truly random numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.end` | `number` | the maximum value for the selection range. |
| `options.start` | `number` | the minimum value for the selection range. |

#### Returns

`Promise`<`string`\>

The transaction id of a transaction that will return the random number.

#### Defined in

[Dice.ts:56](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L56)

___

### rollDiceWithEntropy

▸ **rollDiceWithEntropy**(`options`): `Promise`<`string`\>

Calculates dice rolls using provided entropy.  This method will return and array of length `entropy.length / precision`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.die` | `string` | The die to roll. The input format can support arbitarilly large dice which are effectively spherical..  or more traditional ones. e.g. 'd6' |
| `options.entropy` | `string` | The bytes of data used to seed the sampling. |
| `options.precision` | `number` | The number of bytes to use for each sample.  Sampling at a precision below the fidelity of your range  will succeed, but your results will be overly-discrete. |

#### Returns

`Promise`<`string`\>

The transaction id of a transaction that will return the result an array of dice rolls.

#### Defined in

[Dice.ts:131](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L131)

___

### rollDie

▸ **rollDie**(`options`): `Promise`<`string`\>

Rolls for a `dX` formatted random number.

**Note:**
This method must include a signer to produce truly random numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.die` | `string` | The die to roll. The input format can support arbitarilly large dice which are effectively spherical..  or more traditional ones. e.g. 'd6' |

#### Returns

`Promise`<`string`\>

The transaction id of a transaction that will return the result of the die roll.

#### Defined in

[Dice.ts:111](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L111)

___

### buildMapBytesOntoRangeInvocation

▸ `Static` **buildMapBytesOntoRangeInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.end` | `number` |
| `params.entropy` | `string` |
| `params.start` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Dice.ts:152](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L152)

___

### buildRandBetweenInvocation

▸ `Static` **buildRandBetweenInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.end` | `number` |
| `params.start` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Dice.ts:141](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L141)

___

### buildRollDieInvocation

▸ `Static` **buildRollDieInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.die` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Dice.ts:164](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L164)

___

### buildRollDieWithEntropyInvocation

▸ `Static` **buildRollDieWithEntropyInvocation**(`scriptHash`, `parser`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `parser` | `Neo3Parser` |
| `params` | `Object` |
| `params.die` | `string` |
| `params.precision` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Dice.ts:174](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Dice.ts#L174)
