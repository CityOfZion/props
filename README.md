<p align="center">
  <img
    src="https://raw.githubusercontent.com/CityOfZion/wallet-connect-sdk/develop/.github/resources/images/coz.png"
    width="200px;"></img>
</p>

<h1 align="center">PROPS</h1>

<p align="center">
  General purpose smart contracts and developer framework for Neo N3
  <br/> Made with ❤ by <b>COZ.IO</b>
</p>

## Documentation

For a more complete set of
project documentation, visit the [**project documentation**](https://props.coz.io/d).

For SDK specific documentation, visit our [**sdk documentation**](https://props.coz.io/d/docs/sdk/ts/)

# Overview

In an effort to enhance the developer experience of the Neo N3 platform, COZ has developed the PROPS project. This project is the first of many which
will significantly improve the ease of use and scalability of both smart contracts and off-chain integrations within our ecosystem.

The PROPS project has 3 primary goals:

1. Produce a Smart Contract package ecosystem which provides developers with the tools they need to deliver complex on-chain routines to their users out-of-the-box.
2. Provide a straight-forward framework/template for new projects to clone and build upon.
3. Deliver real-world contracts with off-chain integrations for developer reference.

The PROPS project is ambiguous in scope outside of those goals. Included within this scope is the minting of `puppet` NFTs which
are defined as `General Purpose Utility NFTs`. In addition to the value of having a general use utility NFT in the ecosystem for developers to leverage,
this particular contract provides multiple great examples of how the other PROPS contracts can be leveraged. Further, it is an excellent reference for
new developers who are interesting in NFT development.

While the `Puppet` NFTs are designed with `metaverse` applications in-mind, we make no assertions which limit their
utility in other product spaces. In most cases, the contracts and their tokens are permissionless. **Use them how you see fit.**

## Quickstart

### Quickstart Dependencies:

- Neo-Express (This can be installed from [here](https://github.com/neo-project/neo-express) or as part of the toolkit [here](https://github.com/neo-project/neo-debugger))
- node v14/16

### Setup

get the project: `git clone git@github.com:CityOfZion/props.git`

1. `neoxp run -s 1` from project root
2. `npm install` from project root _(in a second terminal from here on)_
3. Configure neo-express:

   ```
   neoxp policy sync MainNet genesis
   neoxp transfer 200000 GAS genesis coz
   ```

4. `npm run deploy` to deploy the contracts
5. `npm run initialize` to load static data into the contracts
6. `npm run mintPuppets` to mint a bunch of puppets to the coz account.
7. `npm run setIconDAppIcons` to set some smart contracts' icons.
8. start developing; You can reference the sdk tests for usage, to run the sdk tests you also need a checkpoint, you can create it by running `npm run createTestCheckpoint`. To reset the network refer to [Running a Local Private Network](https://props.coz.io/d/docs/contracts/#running-a-local-private-network).

## Project Structure

The PROPS project can be found [here](https://github.com/CityOfZion/props) and includes everything required to develop
a complete decentralized application on Neo N3.

### contracts

This directory contains all of the smart contracts encompassed by the PROPS project. Each directory contains both the
source ([boa](https://github.com/CityOfZion/neo3-boa)) and compiled version of the contracts.
Contract developers should consider simply adding a new directory for their contract as a way to get started quickly.
For more information about contract development in the props ecosystem, refer to the contract development
documentation [here](https://props.coz.io/d/docs/contracts/)

### sdk

In addition to the smart contracts, this project includes a complete, well documented SDK which outlines best practices for
integrating with smart contracts in the Neo N3 ecosystem from off-chain applications. The SDK includes many design patterns and parsing examples as well as
a complete integration with the pre-packaged `PROPS` smart contracts. **Complete SDK documentation is available [here](https://props.coz.io/d/docs/sdk/ts/)**
Developers who are interested in interfacing with smart contracts off-chain can simply build off the included SDK, expanding it to meet their needs.
Refer to [here](https://props.coz.io/d/docs/sdk/ts/) for more complete information about how to use the SDK to interface with the existing PROPS or to expand its
features to meet your needs.

It is also available on NPM: `@cityofzion/props`

### parameters

Smart Contracts present a number of unique features when treated as packages. One of these features is the mutability of storage.
Two of the included PROPS: `collection`, and `generator` leverage user-defined constants. The parameters directory includes a number of examples of these constants, which can be
pre-loaded into the contract using some included setup scripts. They are good references to developers who want to use the collection and generator contracts.

**Note:** Make sure to verify the pointers to these constants (generatorID and collectionID) on public networks before deploying your contracts. We can ensure the pointers in a
private development environment, but not on a public testnet or mainnet.

Further information about parameters and constants is covered in the Contracts and SDK sections of this resource.

### scripts

The scripts directory contains a number of scripts which are useful for configuring the environment. Feel free to reference them for examples and expand upon them.
