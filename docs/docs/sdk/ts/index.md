---
id: "index"
title: "@cityofzion/props"
slug: "/sdk/ts/"
sidebar_label: "Readme"
sidebar_position: 0
custom_edit_url: null
---

<p align="center">
  <img
    src="https://raw.githubusercontent.com/CityOfZion/wallet-connect-sdk/develop/.github/resources/images/coz.png"
    width="200px;"></img>
</p>

<h1 align="center">props</h1>

<p align="center">
  Typescript SDK for the props ecosystem on Neo N3
  <br/> Made with ❤ by <b>COZ.IO</b>
</p>

To install the package: `npm install @cityofzion/props --save`

## Documentation

For a more complete set of
project documentation, visit the [**project documentation**](https://props.coz.io/d).

For SDK specific documentation, visit our [**sdk documentation**](https://props.coz.io/d/docs/sdk/ts/)

## ScriptHashes:

Refer to the relevant contract in the [contracts](../contracts/) documentation.

## Quickstart:

#### Setup:

To install the package:
`npm install @cityofzion/props --save`

Each contract interface is represented by a class. To interface with a contract, create an instance of the interface as follows:

```ts
import { Puppet } from '@cityofzion/props'
import { wallet } from '@cityofzion/neon-core'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'

const node = //refer to dora.coz.io/monitor for a list of nodes.
const scriptHash = //refer to the scriptHashes section above
const account = // need to send either an wallet.Account() or undefined, testInvokes don't need an account
const neo3Invoker = await NeonInvoker.init(node, account) // need to instantiate a Neo3Invoker, currently only NeonInvoker implements this interface
const neo3Parser = NeonParser // need to use a Neo3Parser, currently only NeonParser implements this interface
const puppet = await new Puppet({
      scriptHash,
      invoker: neo3Invoker,
      parser: neo3Parser,
})
```

Other contract interfaces are initialized using the same pattern. Refer to the [SDK documentation](./ts/modules#classes)
for a list of classes available.

From here, you can quickly interface with the smart contract deployed on the target network.

```ts
const symbol = await puppet.symbol(); //returns the token symbol
const totalSupply = await puppet.totalSupply(); //returns the total supply
const decimals = await puppet.decimals(); //returns the decimals
```

Currently, the SDK does not permit the user to invoke a function instead of test invoking, however it's possible to use a Neo3Invoker implementation to do this.

```ts
import { Puppet } from "@cityofzion/props";

const myAwesomeCOZWallet = new wallet.Account(); //remember that you will need some GAS in the wallet in order to pay the transaction fee

const txid = await neo3Invoker.invokeFunction({
  invocations: Puppet.buildSymbolInvocation(),
  signers: [],
});
```

- **Note:** In the example above a [`buildInvocation`](./ts/modules#functions) function was used, however it's not necessary to use it if the user doesn't want to, it could have been any implementation of `ContractInvocation`
