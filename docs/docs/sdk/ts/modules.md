---
id: "modules"
title: "@cityofzion/props"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Enumerations

- [EventTypeEnum](enums/EventTypeEnum.md)
- [InstanceAccessMode](enums/InstanceAccessMode.md)

## Classes

- [Collection](classes/Collection.md)
- [Dice](classes/Dice.md)
- [Generator](classes/Generator.md)
- [Puppet](classes/Puppet.md)

## Interfaces

- [BaseStats](interfaces/BaseStats.md)
- [CollectionType](interfaces/CollectionType.md)
- [EpochType](interfaces/EpochType.md)
- [EventCollectionPointer](interfaces/EventCollectionPointer.md)
- [EventCollectionSampleFrom](interfaces/EventCollectionSampleFrom.md)
- [EventInstanceCall](interfaces/EventInstanceCall.md)
- [EventTypeWrapper](interfaces/EventTypeWrapper.md)
- [EventValue](interfaces/EventValue.md)
- [GeneratorType](interfaces/GeneratorType.md)
- [InstanceAuthorizedContracts](interfaces/InstanceAuthorizedContracts.md)
- [PuppetType](interfaces/PuppetType.md)
- [TraitLevel](interfaces/TraitLevel.md)
- [TraitType](interfaces/TraitType.md)

## Type Aliases

### SmartContractConfig

Ƭ **SmartContractConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `invoker` | `Neo3Invoker` |
| `parser` | `Neo3Parser` |
| `scriptHash` | `string` |

#### Defined in

[types/index.ts:4](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/types/index.ts#L4)

## Functions

### buildBalanceOfInvocation

▸ **buildBalanceOfInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.address` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:4](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L4)

___

### buildCreateCollectionInvocation

▸ **buildCreateCollectionInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Collection.ts:7](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Collection.ts#L7)

___

### buildCreateEpochInvocation

▸ **buildCreateEpochInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Puppet.ts:14](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L14)

___

### buildCreateGeneratorInvocation

▸ **buildCreateGeneratorInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.baseGeneratorFee` | `number` |
| `params.label` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:5](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L5)

___

### buildCreateInstanceInvocation

▸ **buildCreateInstanceInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.generatorId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:145](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L145)

___

### buildCreateTraitInvocation

▸ **buildCreateTraitInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.generatorId` | `number` |
| `params.trait` | [`TraitType`](interfaces/TraitType.md) |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:36](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L36)

___

### buildDecimalsInvocation

▸ **buildDecimalsInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:29](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L29)

___

### buildDeployInvocation

▸ **buildDeployInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:37](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L37)

___

### buildGetAttributeModInvocation

▸ **buildGetAttributeModInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.attributeValue` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:45](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L45)

___

### buildGetCollectionElementInvocation

▸ **buildGetCollectionElementInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Collection.ts:40](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Collection.ts#L40)

___

### buildGetCollectionInvocation

▸ **buildGetCollectionInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:30](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Collection.ts#L30)

___

### buildGetCollectionJSONInvocation

▸ **buildGetCollectionJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:20](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Collection.ts#L20)

___

### buildGetCollectionLengthInvocation

▸ **buildGetCollectionLengthInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:51](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Collection.ts#L51)

___

### buildGetCollectionValuesInvocation

▸ **buildGetCollectionValuesInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.collectionId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:61](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Collection.ts#L61)

___

### buildGetEpochJSONInvocation

▸ **buildGetEpochJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.epochId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:55](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L55)

___

### buildGetGeneratorInstanceJSONInvocation

▸ **buildGetGeneratorInstanceJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:135](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L135)

___

### buildGetGeneratorJSONInvocation

▸ **buildGetGeneratorJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.generatorId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:16](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L16)

___

### buildGetPuppetJSONInvocation

▸ **buildGetPuppetJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.tokenId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:66](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L66)

___

### buildGetPuppetRawInvocation

▸ **buildGetPuppetRawInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.tokenId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:76](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L76)

___

### buildGetTraitJSONInvocation

▸ **buildGetTraitJSONInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.traitId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:26](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L26)

___

### buildMapBytesOntoCollectionInvocation

▸ **buildMapBytesOntoCollectionInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Collection.ts:71](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Collection.ts#L71)

___

### buildMapBytesOntoRangeInvocation

▸ **buildMapBytesOntoRangeInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Dice.ts:17](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Dice.ts#L17)

___

### buildMintFromInstanceInvocation

▸ **buildMintFromInstanceInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:155](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L155)

___

### buildOfflineMintInvocation

▸ **buildOfflineMintInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Puppet.ts:96](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L96)

___

### buildOwnerOfInvocation

▸ **buildOwnerOfInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.tokenId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:86](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L86)

___

### buildPropertiesInvocation

▸ **buildPropertiesInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.tokenId` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:107](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L107)

___

### buildRandBetweenInvocation

▸ **buildRandBetweenInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Dice.ts:6](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Dice.ts#L6)

___

### buildRollDieInvocation

▸ **buildRollDieInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.die` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Dice.ts:29](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Dice.ts#L29)

___

### buildRollDieWithEntropyInvocation

▸ **buildRollDieWithEntropyInvocation**(`scriptHash`, `parser`, `params`): `ContractInvocation`

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

[Dice.ts:39](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Dice.ts#L39)

___

### buildSampleFromCollectionInvocation

▸ **buildSampleFromCollectionInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Collection.ts:82](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Collection.ts#L82)

___

### buildSampleFromRuntimeCollectionInvocation

▸ **buildSampleFromRuntimeCollectionInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Collection.ts:93](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Collection.ts#L93)

___

### buildSetInstanceAccessModeInvocation

▸ **buildSetInstanceAccessModeInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.accessMode` | [`InstanceAccessMode`](enums/InstanceAccessMode.md) |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:166](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L166)

___

### buildSetInstanceAuthorizedContractsInvocation

▸ **buildSetInstanceAuthorizedContractsInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.authorizedContracts` | [`InstanceAuthorizedContracts`](interfaces/InstanceAuthorizedContracts.md)[] |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:188](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L188)

___

### buildSetInstanceAuthorizedUsersInvocation

▸ **buildSetInstanceAuthorizedUsersInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.authorizedUsers` | `string`[] |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:177](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L177)

___

### buildSetInstanceFeeInvocation

▸ **buildSetInstanceFeeInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.fee` | `number` |
| `params.instanceId` | `number` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:206](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L206)

___

### buildSetMintFeeInvocation

▸ **buildSetMintFeeInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Puppet.ts:117](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L117)

___

### buildSymbolInvocation

▸ **buildSymbolInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:128](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L128)

___

### buildTokensInvocation

▸ **buildTokensInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:136](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L136)

___

### buildTokensOfInvocation

▸ **buildTokensOfInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.address` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:144](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L144)

___

### buildTotalAccountsInvocation

▸ **buildTotalAccountsInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:154](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L154)

___

### buildTotalCollectionsInvocation

▸ **buildTotalCollectionsInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Collection.ts:105](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Collection.ts#L105)

___

### buildTotalEpochsInvocation

▸ **buildTotalEpochsInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:162](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L162)

___

### buildTotalGeneratorInstancesInvocation

▸ **buildTotalGeneratorInstancesInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:225](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L225)

___

### buildTotalGeneratorsInvocation

▸ **buildTotalGeneratorsInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Generator.ts:217](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Generator.ts#L217)

___

### buildTotalSupplyInvocation

▸ **buildTotalSupplyInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[Puppet.ts:170](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L170)

___

### buildTransferInvocation

▸ **buildTransferInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Puppet.ts:178](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L178)

___

### buildUpdateInvocation

▸ **buildUpdateInvocation**(`scriptHash`, `params`): `ContractInvocation`

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

[Puppet.ts:190](https://github.com/simplitech/meta-dapp/blob/8e62abf/props/sdk/src/Puppet.ts#L190)
