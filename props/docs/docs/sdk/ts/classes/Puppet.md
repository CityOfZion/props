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

[Puppet.ts:204](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L204)

## Properties

### config

• `Private` **config**: [`SmartContractConfig`](../modules.md#smartcontractconfig)

#### Defined in

[Puppet.ts:205](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L205)

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

[Puppet.ts:209](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L209)

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

[Puppet.ts:213](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L213)

___

### decimals

▸ **decimals**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:222](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L222)

___

### deploy

▸ **deploy**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:226](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L226)

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

[Puppet.ts:236](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L236)

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

[Puppet.ts:251](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L251)

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

[Puppet.ts:255](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L255)

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

[Puppet.ts:259](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L259)

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

[Puppet.ts:267](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L267)

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

[Puppet.ts:263](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L263)

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

[Puppet.ts:276](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L276)

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

[Puppet.ts:280](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L280)

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

[Puppet.ts:309](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L309)

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

[Puppet.ts:366](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L366)

___

### symbol

▸ **symbol**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[Puppet.ts:318](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L318)

___

### tokens

▸ **tokens**(): `Promise`<`number`[]\>

#### Returns

`Promise`<`number`[]\>

#### Defined in

[Puppet.ts:322](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L322)

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

[Puppet.ts:326](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L326)

___

### totalAccounts

▸ **totalAccounts**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:330](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L330)

___

### totalEpochs

▸ **totalEpochs**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:334](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L334)

___

### totalSupply

▸ **totalSupply**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[Puppet.ts:338](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L338)

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

[Puppet.ts:342](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L342)

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

[Puppet.ts:351](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L351)
