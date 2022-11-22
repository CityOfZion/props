---
id: "IconDApp"
title: "Class: IconDApp"
sidebar_label: "IconDApp"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new IconDApp**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`SmartContractConfig`](../modules.md#smartcontractconfig) |

#### Defined in

[IconDApp.ts:11](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L11)

## Properties

### config

• `Private` **config**: [`SmartContractConfig`](../modules.md#smartcontractconfig)

#### Defined in

[IconDApp.ts:12](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L12)

___

### MAINNET

▪ `Static` **MAINNET**: `string` = `'0x489e98351485bbd85be99618285932172f1862e4'`

#### Defined in

[IconDApp.ts:8](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L8)

___

### TESTNET

▪ `Static` **TESTNET**: `string` = `''`

#### Defined in

[IconDApp.ts:9](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L9)

## Methods

### addProperty

▸ **addProperty**(`options`): `Promise`<`string`\>

Adds a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.description` | `string` |
| `options.propertyName` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[IconDApp.ts:76](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L76)

___

### getContractParent

▸ **getContractParent**(`options`): `Promise`<`string`\>

Returns the parent of a smart contract. If there is no parent it will return null.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.childHash` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[IconDApp.ts:252](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L252)

___

### getMetaData

▸ **getMetaData**(`options`): `Promise`<[`IconProperties`](../modules.md#iconproperties) & `Record`<`string`, `any`\>\>

Returns the metadata of a smart contract. If the smart contract is a child it will return a map with 'parent' as a key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.scriptHash` | `string` |

#### Returns

`Promise`<[`IconProperties`](../modules.md#iconproperties) & `Record`<`string`, `any`\>\>

#### Defined in

[IconDApp.ts:186](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L186)

___

### getMultipleMetaData

▸ **getMultipleMetaData**(`options`): `Promise`<`Map`<`string`, `Map`<`string`, `string`\>\>[]\>

Returns the metadata of multiple smart contracts.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.contractHashes` | `string`[] |

#### Returns

`Promise`<`Map`<`string`, `Map`<`string`, `string`\>\>[]\>

#### Defined in

[IconDApp.ts:204](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L204)

___

### getName

▸ **getName**(): `Promise`<`string`\>

Returns the name of the owner of the smart contract. The owner is the one who deployed the smart contract.

#### Returns

`Promise`<`string`\>

#### Defined in

[IconDApp.ts:36](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L36)

___

### getOwner

▸ **getOwner**(): `Promise`<`string`\>

Returns the name of the owner of the smart contract. The owner is the one who deployed the smart contract.

#### Returns

`Promise`<`string`\>

#### Defined in

[IconDApp.ts:18](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L18)

___

### getProperties

▸ **getProperties**(): `Promise`<[`IconProperties`](../modules.md#iconproperties) & `Record`<`string`, `any`\>\>

Returns all Icon properties.

#### Returns

`Promise`<[`IconProperties`](../modules.md#iconproperties) & `Record`<`string`, `any`\>\>

#### Defined in

[IconDApp.ts:130](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L130)

___

### invokeFunction

▸ **invokeFunction**(`cim`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cim` | `ContractInvocationMulti` |

#### Returns

`Promise`<`string`\>

#### Defined in

[IconDApp.ts:297](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L297)

___

### setContractParent

▸ **setContractParent**(`options`): `Promise`<`string`\>

Sets the parent of a smart contract, children will have the same metadata as the parent. (Admin and deployer only)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.childHash` | `string` |
| `options.parentHash` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[IconDApp.ts:240](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L240)

___

### setMetaData

▸ **setMetaData**(`options`): `Promise`<`string`\>

Adds a property to the metadata of a smart contract. (Admin and deployer only)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.propertyName` | `string` |
| `options.scriptHash` | `string` |
| `options.value` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[IconDApp.ts:170](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L170)

___

### setOwnership

▸ **setOwnership**(`options`): `Promise`<`string`\>

Sets the owner of a smart contract. If sender is not the owner of the smart contract, then it will return false.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.scriptHash` | `string` |
| `options.sender` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[IconDApp.ts:288](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L288)

___

### testAddProperty

▸ **testAddProperty**(`options`): `Promise`<`boolean`\>

Adds a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.description` | `string` |
| `options.propertyName` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[IconDApp.ts:54](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L54)

___

### testSetContractParent

▸ **testSetContractParent**(`options`): `Promise`<`boolean`\>

Sets the parent of a smart contract, children will have the same metadata as the parent. (Admin and deployer only)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.childHash` | `string` |
| `options.parentHash` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[IconDApp.ts:222](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L222)

___

### testSetMetaData

▸ **testSetMetaData**(`options`): `Promise`<`boolean`\>

Adds a property to the metadata of a smart contract. (Admin and deployer only)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.propertyName` | `string` |
| `options.scriptHash` | `string` |
| `options.value` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[IconDApp.ts:148](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L148)

___

### testSetOwnership

▸ **testSetOwnership**(`options`): `Promise`<`boolean`\>

Sets the owner of a smart contract. If sender is not the owner of the smart contract, then it will return false.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.scriptHash` | `string` |
| `options.sender` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[IconDApp.ts:270](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L270)

___

### testUpdateProperty

▸ **testUpdateProperty**(`options`): `Promise`<`boolean`\>

Updates a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.description` | `string` |
| `options.propertyName` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[IconDApp.ts:92](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L92)

___

### updateProperty

▸ **updateProperty**(`options`): `Promise`<`string`\>

Updates a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.description` | `string` |
| `options.propertyName` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[IconDApp.ts:114](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L114)

___

### buildAddPropertyInvocation

▸ `Static` **buildAddPropertyInvocation**(`scriptHash`, `parser`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `parser` | `Neo3Parser` |
| `params` | `Object` |
| `params.description` | `string` |
| `params.propertyName` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:317](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L317)

___

### buildGetContractParentInvocation

▸ `Static` **buildGetContractParentInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.childHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:386](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L386)

___

### buildGetMetaDataInvocation

▸ `Static` **buildGetMetaDataInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:359](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L359)

___

### buildGetMultipleMetaDataInvocation

▸ `Static` **buildGetMultipleMetaDataInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.contractHashes` | `string`[] |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:367](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L367)

___

### buildGetOwnerInvocation

▸ `Static` **buildGetOwnerInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:301](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L301)

___

### buildGetPropertiesInvocation

▸ `Static` **buildGetPropertiesInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:339](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L339)

___

### buildNameInvocation

▸ `Static` **buildNameInvocation**(`scriptHash`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:309](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L309)

___

### buildSetContractParentInvocation

▸ `Static` **buildSetContractParentInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.childHash` | `string` |
| `params.parentHash` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:375](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L375)

___

### buildSetMetaDataInvocation

▸ `Static` **buildSetMetaDataInvocation**(`scriptHash`, `parser`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `parser` | `Neo3Parser` |
| `params` | `Object` |
| `params.propertyName` | `string` |
| `params.scriptHash` | `string` |
| `params.value` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:347](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L347)

___

### buildSetOwnershipInvocation

▸ `Static` **buildSetOwnershipInvocation**(`scriptHash`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `params` | `Object` |
| `params.scriptHash` | `string` |
| `params.sender` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:394](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L394)

___

### buildUpdatePropertyInvocation

▸ `Static` **buildUpdatePropertyInvocation**(`scriptHash`, `parser`, `params`): `ContractInvocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |
| `parser` | `Neo3Parser` |
| `params` | `Object` |
| `params.description` | `string` |
| `params.propertyName` | `string` |

#### Returns

`ContractInvocation`

#### Defined in

[IconDApp.ts:328](https://github.com/CityOfZion/props/blob/88e04c4/sdk/src/IconDApp.ts#L328)
