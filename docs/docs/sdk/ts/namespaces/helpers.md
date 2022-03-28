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

[helpers/helpers.ts:142](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/helpers/helpers.ts#L142)

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

[helpers/helpers.ts:68](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/helpers/helpers.ts#L68)

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

[helpers/helpers.ts:6](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/helpers/helpers.ts#L6)

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

[helpers/helpers.ts:100](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/helpers/helpers.ts#L100)

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

[helpers/helpers.ts:34](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/helpers/helpers.ts#L34)

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

[helpers/helpers.ts:106](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/helpers/helpers.ts#L106)

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

[helpers/helpers.ts:38](https://github.com/CityOfZion/isengard/blob/bbb1dd3/sdk/src/helpers/helpers.ts#L38)
