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
- [IconDApp](classes/IconDApp.md)
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

### IconProperties

Ƭ **IconProperties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `icon25x25` | `string` \| ``null`` |
| `icon288x288` | `string` \| ``null`` |

#### Defined in

[types/index.ts:124](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/types/index.ts#L124)

___

### SmartContractConfig

Ƭ **SmartContractConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `invoker` | `Neo3Invoker` |
| `parser` | `Neo3Parser` |
| `scriptHash` | `string` |

#### Defined in

[types/index.ts:4](https://github.com/CityOfZion/props/blob/40afa9e/sdk/src/types/index.ts#L4)
