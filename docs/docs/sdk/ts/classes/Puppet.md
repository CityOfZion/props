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

[Puppet.ts:15](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L15)

## Properties

### networkMagic

• `Private` **networkMagic**: `number` = `-1`

#### Defined in

[Puppet.ts:13](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L13)

___

### options

• `Private` **options**: [`PropConstructorOptions`](../interfaces/types.PropConstructorOptions.md) = `DEFAULT_OPTIONS`

#### Defined in

[Puppet.ts:12](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L12)

## Accessors

### node

• `get` **node**(): `RPCClient`

#### Returns

`RPCClient`

#### Defined in

[Puppet.ts:38](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L38)

___

### scriptHash

• `get` **scriptHash**(): `string`

#### Returns

`string`

#### Defined in

[Puppet.ts:45](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L45)

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

[Puppet.ts:52](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L52)

___

### createEpoch

▸ **createEpoch**(`label`, `generatorId`, `initialRollCollectionId`, `mintFee`, `sysFee`, `maxSupply`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `label` | `string` |
| `generatorId` | `number` |
| `initialRollCollectionId` | `number` |
| `mintFee` | `number` |
| `sysFee` | `number` |
| `maxSupply` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:56](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L56)

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

[Puppet.ts:60](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L60)

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

[Puppet.ts:64](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L64)

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

[Puppet.ts:68](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L68)

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

[Puppet.ts:72](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L72)

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

[Puppet.ts:76](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L76)

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

[Puppet.ts:80](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L80)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[Puppet.ts:33](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L33)

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

[Puppet.ts:88](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L88)

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

[Puppet.ts:84](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L84)

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

[Puppet.ts:92](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L92)

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

[Puppet.ts:96](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L96)

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

[Puppet.ts:127](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L127)

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

[Puppet.ts:131](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L131)

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

[Puppet.ts:135](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L135)

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

[Puppet.ts:139](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L139)

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

[Puppet.ts:143](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L143)

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

[Puppet.ts:147](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L147)

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

[Puppet.ts:151](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L151)

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

[Puppet.ts:155](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L155)

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

[Puppet.ts:159](https://github.com/CityOfZion/isengard/blob/1a0270b/sdk/src/Puppet.ts#L159)
