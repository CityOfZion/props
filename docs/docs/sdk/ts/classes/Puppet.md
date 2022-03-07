---
id: "Puppet"
title: "Class: Puppet"
sidebar_label: "Puppet"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new Puppet**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`PropConstructorOptions`](../interfaces/types.PropConstructorOptions.md) |

#### Defined in

[Puppet.ts:16](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L16)

## Properties

### networkMagic

• `Private` **networkMagic**: `number` = `-1`

#### Defined in

[Puppet.ts:14](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L14)

___

### options

• `Private` **options**: [`PropConstructorOptions`](../interfaces/types.PropConstructorOptions.md)

#### Defined in

[Puppet.ts:13](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L13)

## Accessors

### node

• `get` **node**(): `RPCClient`

#### Returns

`RPCClient`

#### Defined in

[Puppet.ts:25](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L25)

___

### scriptHash

• `get` **scriptHash**(): `string`

#### Returns

`string`

#### Defined in

[Puppet.ts:32](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L32)

## Methods

### balanceOf

▸ **balanceOf**(`address`, `signer?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:39](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L39)

___

### createEpoch

▸ **createEpoch**(`generatorId`, `mintFee`, `sysFee`, `maxSupply`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `generatorId` | `number` |
| `mintFee` | `number` |
| `sysFee` | `number` |
| `maxSupply` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:43](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L43)

___

### decimals

▸ **decimals**(`signer?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer?` | `Account` |

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:47](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L47)

___

### deploy

▸ **deploy**(`signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:51](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L51)

___

### getAttributeMod

▸ **getAttributeMod**(`attributeValue`, `signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `attributeValue` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[Puppet.ts:55](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L55)

___

### getEpochJSON

▸ **getEpochJSON**(`epochId`, `signer?`): `Promise`<`string` \| [`EpochType`](../interfaces/types.EpochType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `epochId` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| [`EpochType`](../interfaces/types.EpochType.md)\>

#### Defined in

[Puppet.ts:59](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L59)

___

### getPuppetJSON

▸ **getPuppetJSON**(`tokenId`, `signer?`): `Promise`<`string` \| [`PuppetType`](../interfaces/types.PuppetType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenId` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| [`PuppetType`](../interfaces/types.PuppetType.md)\>

#### Defined in

[Puppet.ts:63](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L63)

___

### getPuppetRaw

▸ **getPuppetRaw**(`tokenId`, `signer?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenId` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:67](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L67)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[Puppet.ts:20](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L20)

___

### offlineMint

▸ **offlineMint**(`epochId`, `owner`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `epochId` | `number` |
| `owner` | `string` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:75](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L75)

___

### ownerOf

▸ **ownerOf**(`tokenId`, `signer?`): `Promise`<`string` \| `Account`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenId` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `Account`\>

#### Defined in

[Puppet.ts:71](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L71)

___

### properties

▸ **properties**(`tokenId`, `signer?`): `Promise`<`string` \| [`PuppetType`](../interfaces/types.PuppetType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenId` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| [`PuppetType`](../interfaces/types.PuppetType.md)\>

#### Defined in

[Puppet.ts:79](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L79)

___

### purchase

▸ **purchase**(`epochId`, `signer`): `Promise`<`undefined` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `epochId` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[Puppet.ts:83](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L83)

___

### setMintFee

▸ **setMintFee**(`epochId`, `fee`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `epochId` | `number` |
| `fee` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:114](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L114)

___

### symbol

▸ **symbol**(`signer?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer?` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:118](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L118)

___

### tokens

▸ **tokens**(`signer?`): `Promise`<`string` \| `number`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`[]\>

#### Defined in

[Puppet.ts:122](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L122)

___

### tokensOf

▸ **tokensOf**(`address`, `signer?`): `Promise`<`string` \| `string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `string`[]\>

#### Defined in

[Puppet.ts:126](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L126)

___

### totalAccounts

▸ **totalAccounts**(`signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[Puppet.ts:130](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L130)

___

### totalEpochs

▸ **totalEpochs**(`signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[Puppet.ts:134](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L134)

___

### totalSupply

▸ **totalSupply**(`signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[Puppet.ts:138](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L138)

___

### transfer

▸ **transfer**(`to`, `tokenId`, `signer`, `data`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `string` |
| `tokenId` | `string` |
| `signer` | `Account` |
| `data` | `any` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:142](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L142)

___

### update

▸ **update**(`script`, `manifest`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `script` | `string` |
| `manifest` | `string` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:146](https://github.com/CityOfZion/isengard/blob/5015463/sdk/src/Puppet.ts#L146)
