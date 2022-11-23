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

## Documentation

For a more complete set of
project documentation, visit the [**project documentation**](https://props.coz.io/d).

For SDK specific documentation, visit our [**sdk documentation**](https://props.coz.io/d/docs/sdk/ts/)

## Quickstart:

#### Setup:

Install the props package using:
`npm install @cityofzion/props`

It's also necessary to install an implementation of the neo3-parser and neo3-invoker interfaces. For example, this could be done by installing Neon-Parser: `npm i @CityOfZion/neon-parser` and choosing to install either Neon-JS via npm: `npm i @CityOfZion/neon-invoker` or [WalletConnect](https://github.com/CityOfZion/wallet-connect-sdk)

Each contract interface is represented by a class. To interface with a contract, create an instance of the interface as follows:

```ts
import { Puppet } from '@cityofzion/props'
import { wallet } from '@cityofzion/neon-core'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'


const node = NeonInvoker.MAINNET // You can choose to use any node here, refer to dora.coz.io/monitor for a list of nodes.
const scriptHash = //refer to the scriptHashes section above
const account = // need to send either an wallet.Account() or undefined, testInvokes don't need an account
const neo3Invoker = await NeonInvoker.init(node, account) // need to instantiate a Neo3Invoker
// If you installed WalletConnect instead of NeonInvoker, it also implements this interface. 
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

## Tests:

To run the tests on the sdk it's necessary to create a checkpoint named "postSetup" after setting up the private net. This checkpoint should already exist on the repository, but if the user wants to they can overwrite it by running `neoxp checkpoint create -f postSetup` on the parent directory.
