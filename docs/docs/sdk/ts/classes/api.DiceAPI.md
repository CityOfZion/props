---
id: "api.DiceAPI"
title: "Class: DiceAPI"
sidebar_label: "DiceAPI"
custom_edit_url: null
---

[api](../namespaces/api.md).DiceAPI

## Constructors

### constructor

• **new DiceAPI**()

## Methods

### mapBytesOntoRange

▸ `Static` **mapBytesOntoRange**(`node`, `networkMagic`, `contractHash`, `start`, `end`, `entropy`, `signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `start` | `number` |
| `end` | `number` |
| `entropy` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[api/dice.ts:68](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/dice.ts#L68)

___

### randBetween

▸ `Static` **randBetween**(`node`, `networkMagic`, `contractHash`, `start`, `end`, `signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `start` | `number` |
| `end` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[api/dice.ts:48](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/dice.ts#L48)

___

### rollDiceWithEntropy

▸ `Static` **rollDiceWithEntropy**(`node`, `networkMagic`, `contractHash`, `die`, `precision`, `entropy`, `signer?`): `Promise`<`string` \| `number`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `die` | `string` |
| `precision` | `number` |
| `entropy` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`[]\>

#### Defined in

[api/dice.ts:26](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/dice.ts#L26)

___

### rollDie

▸ `Static` **rollDie**(`node`, `networkMagic`, `contractHash`, `die`, `signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `die` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[api/dice.ts:8](https://github.com/CityOfZion/isengard/blob/78e7dfb/sdk/src/api/dice.ts#L8)
