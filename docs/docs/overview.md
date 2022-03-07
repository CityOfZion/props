---
sidebar_position: 1
---

<p align="center">
  <img
    src="https://raw.githubusercontent.com/CityOfZion/wallet-connect-sdk/develop/.github/resources/images/coz.png"
    width="200px;"></img>
</p>

<h1 align="center">props</h1>

<p align="center">
  General purpose smart contracts and developer framework for Neo N3
  <br/> Made with ❤ by <b>COZ.IO</b>
</p>

# Overview

In an effort to enhance the developer experience of the Neo N3 platform, COZ has developed the props project.  This project is the first of many which
will significantly improve the ease of use and scalability of both smart contracts and off-chain integrations within our ecosystem.

The props project has 3 primary goals:
1. Produce a Smart Contract package ecosystem which provides developers with the tools they need to deliver complex on-chain routines to their users out-of-the-box.
2. Provide a straight-forward framework/template for new projects to clone and build upon.
3. Deliver real-world contracts with off-chain integrations for developer reference.

The props project is ambiguous in scope outside of those goals.  Included within this scope is the minting of `puppet` NFTs which
are defined as `General Purpose Utility NFTs`.  In addition to the value of having a general use utility NFT in the ecosystem for developers to leverage,
this particular contract provide multiple great examples of how the other props contracts can be leveraged.  Further, it is an excellent reference for
new developers who are interesting in NFT development.

While the `Puppet` NFTs are designed with `metaverse` applications in-mind, we make no assertions which limit their
utility in other product spaces.  The contracts and their tokens are permissionless.  **Use them how you see fit.**

## Quickstart

### Quickstart Dependencies:
* Neo-Express (This can be installed from [here](https://github.com/neo-project/neo-express) or as part of the toolkit [here](https://github.com/neo-project/neo-debugger))
* node v14/16

### Setup
get the project: `git clone git@github.com:CityOfZion/props.git`

1. `neoxp run -s 1` from project root
2. `npm install` from project root *(in a second terminal from here on)*
3.
   ```
   neoxp policy set FeePerByte 100 genesis
   neoxp policy set ExecFeeFactor 3 genesis
   neoxp policy set StoragePrice 10000 genesis
   neoxp transfer 10000 GAS genesis coz
   ```

4. `npm run deploy` to deploy the contracts
5. `npm run initialize` to load static data into the contracts
6. `npm run mintPuppets` to mint a bunch of puppets to the coz account.
7. start developing; You can reference the sdk tests for usage.  To reset the network refer to [Running a Local Private Network](https://props.coz.io/d/docs/contracts/#running-a-local-private-network).

## Project Structure
The props project can be found [here](https://github.com/CityOfZion/props) and includes everything required to develop
a complete decentralized application on Neo N3 (besides a few dependencies...more on that later).

### contracts
This directory contains all of the smart contracts encompassed by the props project.  Each directory contains both the
source ([boa](https://github.com/CityOfZion/neo3-boa)) and compiled version of the contracts.
Contract developers should consider simply adding a new directory for their contract as a way to get started quickly.
For more information about contract development in the props ecosystem, refer to the contract development
documentation [here](/d/docs/contracts)

### sdk
In addition to the smart contracts, this project includes a complete, well documented SDK which outlines best practices for
integrating with smart contracts in the Neo N3 ecosystem from off-chain applications.  The SDK includes many design patterns and parsing examples as well as
a complete integration with the pre-packaged `props` smart contracts. **Complete SDK documentation is linked in the header of this site.**
Developers who are interested in interfacing with smart contracts off-chain can simply build off the included SDK, expanding it to meet their needs.
Refer to [here](/d/docs/sdk/ts/) for more complete information about how to use the SDK to interface with the existing props or to expand its
features to meet your needs.

### parameters
Smart Contracts present a number of unique features when treated as packages.  One of these features is the mutability of storage.
Two of the included props: `collection`, and `generator` leverage user-defined constants.  The parameters directory includes a number of examples of these constants, which can be
pre-loaded into the contract using some included setup scripts.  They are good references to developers who want to use the collection and generator contracts.

**Note:** Make sure to verify the pointers to these constants (generatorID and collectionID) on public networks before deploying your contracts.  We can ensure the pointers in a
private development environment, but not on a public testnet or mainnet.

Further information about parameters and constants is covered in the Contracts and SDK sections of this resource.

### scripts
The scripts directory contains a number of scripts which are useful for configuring the environment.  Feel free to reference them for examples and expand upon them.