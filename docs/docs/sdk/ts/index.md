---
id: "index"
title: "@cityofzion/props"
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
  <br/> Made by <b>COZ.IO</b>
</p>

## Documentation
For a more complete set of
project documentation, visit the [**project documentation**](https://props.coz.io/d/index.html).

For SDK specific documentation, visit our [**sdk documentation**](https://props.coz.io/d/docs/sdk/ts/index.html)

## ScriptHashes:

### N3 Privatenet (like neo-express):
Scripthashes are baked into the sdk, but can be referenced within each class ([example](/docs/sdk/ts/classes/Collection#scripthash))

### N3 Testnet:
* **dice:** `0x4380f2c1de98bb267d3ea821897ec571a04fe3e0`
* **collection:** `0x429ba9252c761b6119ab9442d9fbe2e60f3c6f3e`
* **generator:** `0xdda8055789f0eb3c1d092c714a68ba3e631586c7`
* **puppet:** `0x97857c01d64f846b5fe2eca2d09d2d73928b3f43`

### N3 Mainnet:
TBD

## Quickstart:

#### Setup:
To install the package:
`npm install @cityofzion/props --save`

Each contract interface is represented by a class.  To interface with a contract, create an instance of the interface as follows:

```ts
import Puppet, helpers from '@cityofzion/props'
import Neon from '@cityofzion/neon-js'

const node = //refer to dora.coz.io/monitor for a list of nodes.
const scriptHash = //refer to the scriptHashes section above
puppet = await new Puppet({
  node,
  scriptHash
})
await puppet.init()
```
* **Note:** For a local neo-express deployment, the class can be initialized without a configuration object ( e.g. `new sdk.Collection()`)*

Other contract interfaces are initialized using the same pattern.  Refer to the [SDK documentation](https://props.coz.io/d/docs/sdk/ts/modules.html)
for a list of available interfaces.

From here, you can quickly interface with the smart contract deployed on the target network.

```ts
const symbol = await puppet.symbol() //returns the token symbol
const totalSupply = await puppet.totalSupply() //returns the total supply
const decimals = await puppet.decimals() //returns the decimals
```

All props classes use a variable invoke mechanism.  This means the that method which are traditionally handled by test invocations (like the ones above), can
optionally be relayed to the network by providing a user wallet as an optional parameter.  When populating this optional field, the response will be a transaction id.

```ts
const myAwesomeCOZWallet = new Neon.wallet.Account() //remember that you will need some GAS in the wallet in order to pay the transaction fee
const txid = await puppet.symbol(myAwesomeCOZWallet) //relays the transaction to the network and returns the transaction id

await helpers.sleep(5000) //wait for the transaction to publish to a block.  This time will be dependent on the network you are connected to (try 30000 for testnet and mainnet)

const res = await sdk.helpers.txDidComplete(node, txid, true) //read the logs and parse the result
console.log(res)
```
