---
id: "helpers"
title: "Namespace: helpers"
sidebar_label: "helpers"
sidebar_position: 0
custom_edit_url: null
---

## Functions

### chiSquared

▸ **chiSquared**(`samples`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `samples` | `string`[] |

#### Returns

`number`

#### Defined in

[helpers/helpers.ts:177](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/helpers/helpers.ts#L177)

___

### deployContract

▸ **deployContract**(`node`, `networkMagic`, `pathToNEF`, `signer`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `networkMagic` | `number` |
| `pathToNEF` | `string` |
| `signer` | `Account` |

#### Returns

`Promise`<`string`\>

#### Defined in

[helpers/helpers.ts:103](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/helpers/helpers.ts#L103)

___

### formatter

▸ **formatter**(`field`, `num?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `field` | `any` | `undefined` |
| `num` | `boolean` | `false` |

#### Returns

`any`

#### Defined in

[helpers/helpers.ts:38](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/helpers/helpers.ts#L38)

___

### getEvents

▸ **getEvents**(`node`, `txid`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `string` |
| `txid` | `string` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

[helpers/helpers.ts:135](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/helpers/helpers.ts#L135)

___

### parseToJSON

▸ **parseToJSON**(`entries`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entries` | `any`[] |

#### Returns

`any`

#### Defined in

[helpers/helpers.ts:6](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/helpers/helpers.ts#L6)

___

### sleep

▸ **sleep**(`ms`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[helpers/helpers.ts:69](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/helpers/helpers.ts#L69)

___

### txDidComplete

▸ **txDidComplete**(`node`, `txid`, `showStats?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `node` | `string` | `undefined` |
| `txid` | `string` | `undefined` |
| `showStats` | `boolean` | `false` |

#### Returns

`Promise`<`any`\>

#### Defined in

[helpers/helpers.ts:141](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/helpers/helpers.ts#L141)

___

### variableInvoke

▸ **variableInvoke**(`node`, `networkMagic`, `contractHash`, `method`, `param?`, `signer?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `node` | `string` | `undefined` |
| `networkMagic` | `number` | `undefined` |
| `contractHash` | `string` | `undefined` |
| `method` | `string` | `undefined` |
| `param` | `any`[] | `[]` |
| `signer?` | `Account` | `undefined` |

#### Returns

`Promise`<`any`\>

#### Defined in

[helpers/helpers.ts:73](https://github.com/CityOfZion/isengard/blob/87233a5/sdk/src/helpers/helpers.ts#L73)
