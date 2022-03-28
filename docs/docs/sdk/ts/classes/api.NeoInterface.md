---
id: "api.NeoInterface"
title: "Class: NeoInterface"
sidebar_label: "NeoInterface"
custom_edit_url: null
---

[api](../namespaces/api.md).NeoInterface

## Constructors

### constructor

• **new NeoInterface**()

## Methods

### publishInvoke

▸ `Static` **publishInvoke**(`rpcAddress`, `networkMagic`, `scriptHash`, `operation`, `args`, `account`): `Promise`<`undefined` \| `string`\>

A method for publishing contract invocations on the Neo Blockchain.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rpcAddress` | `string` |
| `networkMagic` | `number` |
| `scriptHash` | `string` |
| `operation` | `string` |
| `args` | `any`[] |
| `account` | `Account` |

#### Returns

`Promise`<`undefined` \| `string`\>

#### Defined in

[api/interface.ts:51](https://github.com/CityOfZion/isengard/blob/aaf6827/sdk/src/api/interface.ts#L51)

___

### testInvoke

▸ `Static` **testInvoke**(`rpcAddress`, `networkMagic`, `scriptHash`, `operation`, `args`): `Promise`<`undefined` \| `StackItemJson`[] \| [`InteropInterface`](../interfaces/api.InteropInterface.md)[]\>

A method for executing test invocations on the Neo blockchain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rpcAddress` | `string` | the rpc endpoint for a neo full node |
| `networkMagic` | `number` | the network magic for the target network.  Query |
| `scriptHash` | `string` |  |
| `operation` | `string` |  |
| `args` | `any`[] |  |

#### Returns

`Promise`<`undefined` \| `StackItemJson`[] \| [`InteropInterface`](../interfaces/api.InteropInterface.md)[]\>

#### Defined in

[api/interface.ts:23](https://github.com/CityOfZion/isengard/blob/aaf6827/sdk/src/api/interface.ts#L23)
