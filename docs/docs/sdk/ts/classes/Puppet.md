---
id: "Puppet"
title: "Class: Puppet"
sidebar_label: "Puppet"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new Puppet**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`SmartContractConfig`](../modules.md#smartcontractconfig) |

#### Defined in

[Puppet.ts:10](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L10)

## Properties

### config

• `Private` **config**: [`SmartContractConfig`](../modules.md#smartcontractconfig)

#### Defined in

[Puppet.ts:11](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L11)

___

### MAINNET

▪ `Static` **MAINNET**: `string` = `'0x76a8f8a7a901b29a33013b469949f4b08db15756'`

#### Defined in

[Puppet.ts:7](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L7)

___

### TESTNET

▪ `Static` **TESTNET**: `string` = `''`

#### Defined in

[Puppet.ts:8](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L8)

## Methods

### balanceOf

▸ **balanceOf**(`options`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.address` | `string` |

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:15](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L15)

___

### createEpoch

▸ **createEpoch**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.generatorInstanceId` | `number` |
| `options.initialRollCollectionId` | `number` |
| `options.label` | `string` |
| `options.maxSupply` | `number` |
| `options.mintFee` | `number` |
| `options.sysFee` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:19](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L19)

___

### decimals

▸ **decimals**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:28](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L28)

___

### deploy

▸ **deploy**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:32](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L32)

___

### getAttributeMod

▸ **getAttributeMod**(`options`): `Promise`<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.attributeValue` | `number` |

#### Returns

`Promise`<`string` \| `number`\>

#### Defined in

[Puppet.ts:42](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L42)

___

### getEpochJSON

▸ **getEpochJSON**(`options`): `Promise`<[`EpochType`](../interfaces/EpochType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.epochId` | `number` |

#### Returns

`Promise`<[`EpochType`](../interfaces/EpochType.md)\>

#### Defined in

[Puppet.ts:57](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L57)

___

### getPuppetJSON

▸ **getPuppetJSON**(`options`): `Promise`<[`PuppetType`](../interfaces/PuppetType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.tokenId` | `string` |

#### Returns

`Promise`<[`PuppetType`](../interfaces/PuppetType.md)\>

#### Defined in

[Puppet.ts:61](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L61)

___

### getPuppetRaw

▸ **getPuppetRaw**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.tokenId` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:65](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L65)

___

### offlineMint

▸ **offlineMint**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.epochId` | `number` |
| `options.owner` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:73](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L73)

___

### ownerOf

▸ **ownerOf**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.tokenId` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:69](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L69)

___

### properties

▸ **properties**(`options`): `Promise`<`string` \| [`PuppetType`](../interfaces/PuppetType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.tokenId` | `string` |

#### Returns

`Promise`<`string` \| [`PuppetType`](../interfaces/PuppetType.md)\>

#### Defined in

[Puppet.ts:82](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L82)

___

### purchase

▸ **purchase**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.epochId` | `number` |
| `options.signerAddress` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:86](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L86)

___

### setMintFee

▸ **setMintFee**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.epochId` | `number` |
| `options.fee` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:115](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L115)

___

### singleInvocationTestInvoke

▸ `Private` **singleInvocationTestInvoke**<`Type`\>(`args`, `buildInvocationFunction`): `Promise`<`any`\>

#### Type parameters

| Name |
| :------ |
| `Type` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Type` |
| `buildInvocationFunction` | (`scriptHash`: `string`, `params`: `Type`) => `ContractInvocation` |

#### Returns

`Promise`<`any`\>

#### Defined in

[Puppet.ts:172](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L172)

___

### symbol

▸ **symbol**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:124](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L124)

___

### tokens

▸ **tokens**(): `Promise`<`number`[]\>

#### Returns

`Promise`<`number`[]\>

#### Defined in

[Puppet.ts:128](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L128)

___

### tokensOf

▸ **tokensOf**(`options`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.address` | `string` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[Puppet.ts:132](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L132)

___

### totalAccounts

▸ **totalAccounts**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:136](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L136)

___

### totalEpochs

▸ **totalEpochs**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:140](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L140)

___

### totalSupply

▸ **totalSupply**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:144](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L144)

___

### transfer

▸ **transfer**(`options`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.data` | `any` |
| `options.to` | `string` |
| `options.tokenId` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:148](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L148)

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

[Puppet.ts:157](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L157)

___

### buildBalanceOfInvocation

▸ `Static` **buildBalanceOfInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.address` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:187](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L187)

___

### buildCreateEpochInvocation

▸ `Static` **buildCreateEpochInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.generatorInstanceId` | `number` |
| `params.initialRollCollectionId` | `number` |
| `params.label` | `string` |
| `params.maxSupply` | `number` |
| `params.mintFee` | `number` |
| `params.sysFee` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:197](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L197)

___

### buildDecimalsInvocation

▸ `Static` **buildDecimalsInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:212](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L212)

___

### buildDeployInvocation

▸ `Static` **buildDeployInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:220](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L220)

___

### buildGetAttributeModInvocation

▸ `Static` **buildGetAttributeModInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.attributeValue` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:228](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L228)

___

### buildGetEpochJSONInvocation

▸ `Static` **buildGetEpochJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.epochId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:238](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L238)

___

### buildGetPuppetJSONInvocation

▸ `Static` **buildGetPuppetJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.tokenId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:249](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L249)

___

### buildGetPuppetRawInvocation

▸ `Static` **buildGetPuppetRawInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.tokenId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:259](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L259)

___

### buildOfflineMintInvocation

▸ `Static` **buildOfflineMintInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.epochId` | `number` |
| `params.owner` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:279](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L279)

___

### buildOwnerOfInvocation

▸ `Static` **buildOwnerOfInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.tokenId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:269](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L269)

___

### buildPropertiesInvocation

▸ `Static` **buildPropertiesInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.tokenId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:290](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L290)

___

### buildSetMintFeeInvocation

▸ `Static` **buildSetMintFeeInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.epochId` | `number` |
| `params.fee` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:300](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L300)

___

### buildSymbolInvocation

▸ `Static` **buildSymbolInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:311](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L311)

___

### buildTokensInvocation

▸ `Static` **buildTokensInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:319](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L319)

___

### buildTokensOfInvocation

▸ `Static` **buildTokensOfInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.address` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:327](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L327)

___

### buildTotalAccountsInvocation

▸ `Static` **buildTotalAccountsInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:337](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L337)

___

### buildTotalEpochsInvocation

▸ `Static` **buildTotalEpochsInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:345](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L345)

___

### buildTotalSupplyInvocation

▸ `Static` **buildTotalSupplyInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:353](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L353)

___

### buildTransferInvocation

▸ `Static` **buildTransferInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.data` | `any` |
| `params.to` | `string` |
| `params.tokenId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:361](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L361)

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

[Puppet.ts:373](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/Puppet.ts#L373)
