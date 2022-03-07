
# Overview


## Development Environment
This project assumes that the developer is deploying a complete development environment.

As such, the following dependencies are assumed:
* Neo-Express (This can be installed from [here](https://github.com/neo-project/neo-express) or as part of the toolkit [here](https://github.com/neo-project/neo-debugger))
* python v3.8/9
* node v14/16

## Quickstart
If you're here to get started quickly with the existing props, simply run the following:

1. From project root, `npm install`
2. Configure a private network the environment:

   ```
      neoxp policy set FeePerByte 100 genesis
      neoxp policy set ExecFeeFactor 3 genesis
      neoxp policy set StoragePrice 10000 genesis
      neoxp transfer 10000 GAS genesis coz
      npm run deploy
      npm run initialize
   ```

**Note:** Refer to [Running A Local Private Network](#running-a-local-private-network) to reset the environment.


## Contract Development Setup
1. **Clone the project:**

  `git clone git@github.com:CityOfZion/props.git`

2. **Configure the environment:**

    navigate to the `contracts` directory and:

   * OSX/Linux: `source venv/bin/activate`
   * Windows: `venv\Scripts\activate`

3. **Install the dependencies:**

  `pip install -r requirements.txt`

4. **Begin developing your contracts**


## Compiling a contract
Before deploying a smart contract to the network, you must first compile it to NVM bytecode.  To do this, use the following command:

```
neo3-boa {{path to .py file}}
```

## Running a Local Private Network
The props project includes a neo-express config file [here](https://github.com/CityOfZion/props/blob/develop/default.neo-express). That is designed to be used for local developement environments.
If you plan to do development locally, we recommending using this configuration since it is heavily referenced in the project.

1. To spin up a local network, navigate to project root and execute:

   `neoxp run -s 1`

   This command will start a local N3 private network with a 1 second block time.

2. Configure your privatenet to mirror the public networks and transfer GAS to the developer account:

   ```bash
   neoxp policy set FeePerByte 100 genesis
   neoxp policy set ExecFeeFactor 3 genesis
   neoxp policy set StoragePrice 10000 genesis
   neoxp transfer 10000 GAS genesis coz
   ```

   If you ever need to reset the network for testing, simply run:

   `neoxp reset --force`

   Then execute the `neoxp run -s 1` command again.


## Deploying contracts:

1. With exception of smart contract compilation, the majority of this project will be managed in Node.  To deploy our contract, first install the dependencies at project root:

   `npm install`

2. Then deploy:

   `npm run deploy`

   This helper script, located [here](https://github.com/CityOfZion/props/blob/develop/scripts/deploy.js) will handle the deployment of all of our contracts to the privatenet.

   To add additional smart contracts, simply add another entry to the deployment script that points to the .nef file produced when you compile.

   This script can also be used to deploy to `public testnet` and `public mainnet` by providing runtime args as follows:

   `npm run deploy {{NODE}} {{PRIVATE_KEY}} {{TIME_CONSTANT}}`

      ```
      where:
      * **node:** the url of a node on your target network
      * **PRIVATE_KEY:** a private key you want to use to sign the transaction (must have GAS)
      * **TIME_CONSTANT:** the network time constant, for testnet/mainnet, we recommend `30000`
      ```
   **NOTE:** When deploying to testnet/mainnet, make sure to comment out the deployment lines for the other contracts in the script or you will burn GAS by deploying unnecessary code.*

## Initializing the props:

  A number of the props projects have stateful components.  These are not mandatory for use, but include a number of features which are designed to enable high level applications.  To initialize these constants, run:

  `npm run initialize`

  This script will load the various assets into the smart contracts.

  **Note:** The initialize script uses supports the same input parameters as the deploy script and can be used as a reference for preloading your contracts with data.

