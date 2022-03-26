---
id: "api.PuppetAPI"
title: "Class: PuppetAPI"
sidebar_label: "PuppetAPI"
custom_edit_url: null
---

[api](../namespaces/api.md).PuppetAPI

## Constructors

### constructor

• **new PuppetAPI**()

## Methods

### balanceOf

▸ `Static` **balanceOf**(`node`, `networkMagic`, `contractHash`, `address`, `signer?`): `Promise`<`number`\>

Returns the balance of an account

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `address` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`number`\>

#### Defined in

[api/puppet.ts:18](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L18)

___

### createEpoch

▸ `Static` **createEpoch**(`node`, `networkMagic`, `contractHash`, `label`, `generatorInstanceId`, `initialRollCollectionId`, `mintFee`, `sysFee`, `maxSupply`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `label` | `string` |
| `generatorInstanceId` | `number` |
| `initialRollCollectionId` | `number` |
| `mintFee` | `number` |
| `sysFee` | `number` |
| `maxSupply` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/puppet.ts:35](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L35)

___

### decimals

▸ `Static` **decimals**(`node`, `networkMagic`, `contractHash`, `signer?`): `Promise`<`number`\>

Returns the decimals of the token

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

[api/puppet.ts:66](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L66)

___

### deploy

▸ `Static` **deploy**(`node`, `networkMagic`, `contractHash`, `signer`): `Promise`<`string`\>

Initializes the smart contract on first deployment (REQUIRED)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `string` |  |
| `networkMagic` | `number` |  |
| `contractHash` | `string` |  |
| `signer` | `Account` | The signing account, which will become the first admin if upgrade == false |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/puppet.ts:88](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L88)

___

### getAttributeMod

▸ `Static` **getAttributeMod**(`node`, `networkMagic`, `contractHash`, `attributeValue`, `signer?`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `attributeValue` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[api/puppet.ts:99](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L99)

___

### getEpochJSON

▸ `Static` **getEpochJSON**(`node`, `networkMagic`, `contractHash`, `epochId`, `signer?`): `Promise`<`string` \| [`EpochType`](../interfaces/types.EpochType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `epochId` | `number` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| [`EpochType`](../interfaces/types.EpochType.md)\>

#### Defined in

[api/puppet.ts:461](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L461)

___

### getPuppetJSON

▸ `Static` **getPuppetJSON**(`node`, `networkMagic`, `contractHash`, `tokenId`, `signer?`): `Promise`<`string` \| [`PuppetType`](../interfaces/types.PuppetType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `tokenId` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| [`PuppetType`](../interfaces/types.PuppetType.md)\>

#### Defined in

[api/puppet.ts:117](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L117)

___

### getPuppetJSONFlat

▸ `Static` **getPuppetJSONFlat**(`node`, `networkMagic`, `contractHash`, `tokenId`, `signer?`): `Promise`<`string` \| [`PuppetType`](../interfaces/types.PuppetType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `tokenId` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| [`PuppetType`](../interfaces/types.PuppetType.md)\>

#### Defined in

[api/puppet.ts:135](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L135)

___

### getPuppetRaw

▸ `Static` **getPuppetRaw**(`node`, `networkMagic`, `contractHash`, `tokenId`, `signer?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `tokenId` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/puppet.ts:151](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L151)

___

### offlineMint

▸ `Static` **offlineMint**(`node`, `networkMagic`, `contractHash`, `epochId`, `owner`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `epochId` | `number` |
| `owner` | `string` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/puppet.ts:194](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L194)

___

### ownerOf

▸ `Static` **ownerOf**(`node`, `networkMagic`, `contractHash`, `tokenId`, `signer?`): `Promise`<`string` \| `Account`\>

Gets the owner account of a tokenId

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `string` |  |
| `networkMagic` | `number` |  |
| `contractHash` | `string` |  |
| `tokenId` | `string` | The tokenId to return the owner of |
| `signer?` | `Account` |  |

#### Returns

`Promise`<`string` \| `Account`\>

#### Defined in

[api/puppet.ts:176](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L176)

___

### properties

▸ `Static` **properties**(`node`, `networkMagic`, `contractHash`, `tokenId`, `signer?`): `Promise`<`string` \| [`PuppetType`](../interfaces/types.PuppetType.md)\>

Gets the properties of a token

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `string` |  |
| `networkMagic` | `number` |  |
| `contractHash` | `string` |  |
| `tokenId` | `string` | The tokenId of the token being requested |
| `signer?` | `Account` | An optional signer.  Populating this value will publish a transaction and return a txid |

#### Returns

`Promise`<`string` \| [`PuppetType`](../interfaces/types.PuppetType.md)\>

#### Defined in

[api/puppet.ts:219](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L219)

___

### setMintFee

▸ `Static` **setMintFee**(`node`, `networkMagic`, `contractHash`, `epochId`, `fee`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `epochId` | `number` |
| `fee` | `number` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/puppet.ts:235](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L235)

___

### symbol

▸ `Static` **symbol**(`node`, `networkMagic`, `contractHash`, `signer?`): `Promise`<`string`\>

Returns the token symbol

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/puppet.ts:259](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L259)

___

### tokens

▸ `Static` **tokens**(`node`, `networkMagic`, `contractHash`, `signer?`): `Promise`<`string` \| `number`[]\>

Gets and array of strings(tokenIds) representing all the tokens associated with the contract

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `signer?` | `Account` |

#### Returns

`Promise`<`string` \| `number`[]\>

#### Defined in

[api/puppet.ts:281](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L281)

___

### tokensOf

▸ `Static` **tokensOf**(`node`, `networkMagic`, `contractHash`, `address`, `signer?`): `Promise`<`string` \| `string`[]\>

Gets an array of strings(tokenId) owned by an address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `string` |  |
| `networkMagic` | `number` |  |
| `contractHash` | `string` |  |
| `address` | `string` | The string formatted address of an account |
| `signer?` | `Account` |  |

#### Returns

`Promise`<`string` \| `string`[]\>

#### Defined in

[api/puppet.ts:319](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L319)

___

### totalAccounts

▸ `Static` **totalAccounts**(`node`, `networkMagic`, `contractHash`, `signer?`): `Promise`<`string` \| `number`\>

Gets the total number of accounts stored in the contract

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

[api/puppet.ts:354](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L354)

___

### totalEpochs

▸ `Static` **totalEpochs**(`node`, `networkMagic`, `contractHash`, `signer?`): `Promise`<`string` \| `number`\>

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

[api/puppet.ts:369](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L369)

___

### totalSupply

▸ `Static` **totalSupply**(`node`, `networkMagic`, `contractHash`, `signer?`): `Promise`<`string` \| `number`\>

Returns the total supply of the token

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

[api/puppet.ts:391](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L391)

___

### transfer

▸ `Static` **transfer**(`node`, `networkMagic`, `contractHash`, `toAddress`, `tokenId`, `signer`, `data?`): `Promise`<`string`\>

Transfers a token to another account

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `contractHash` | `string` |
| `toAddress` | `string` |
| `tokenId` | `string` |
| `signer` | `Account` |
| `data?` | `any` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api/puppet.ts:416](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L416)

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

[api/puppet.ts:435](https://github.com/CityOfZion/isengard/blob/f78053a/sdk/src/api/puppet.ts#L435)
