# Fair Sampling

This example walks users through a scenario where they need to sample from a list of options in an honest way.
This functionality is extremely useful in the scenario of a giveaway where the host wants to execute the event in a
manner which is completely transparent and fair. Because the selection process is handled on-chain and the contract
code as well as the execution path are transparent, anyone can verify the honesty of the selection process.

This feature is available out of the box and is very straight forward using the props ecosystem:

```typescript
import { Collection } from "@cityofzion/props"
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'
import { rpc } from '@cityofzion/neon-core' // will be used to check the result of the transaction

const node = //refer to dora.coz.io/monitor for a list of nodes.
const scriptHash = //refer to the scriptHashes section above
const account = // need to send either an wallet.Account() or undefined, testInvokes don't need an account
const neo3Invoker = await NeonInvoker.init(node, account) // need to instantiate a Neo3Invoker, currently only NeonInvoker implements this interface
const neo3Parser = NeonParser // need to use a Neo3Parser, currently only NeonParser implements this interface

// initialize our collection prop instance
const collection = new Collection({
  scriptHash,
  invoker: neo3Invoker,
  parser: neo3Parser,
})

// our list of options that the network will be choosing from
const options = ["A", "B", "C", "D", "E", "F", "G"]

// pick 5 from the list of options; do not replace the selections in the options once selected (no repeat selections)
const txid = await collection.sampleFromRuntimeCollection({
  values: options,
  samples: 5,
  pick: true
})

//its a good idea to log this for reference via https://dora.coz.io
console.log(txid);

// wait for the transaction to publish to MainNet
await helpers.sleep(30000) // the approximate block time is 15 seconds on N3 so we use 2 * period to ensure the transaction publishes.

// get the result of the transaction
const client = new rpc.RPCClient(node)
const tx = await client.getApplicationLog(txid)
const result = tx.executions[0].stack!.map( (item) => {
  return NeonParser.parseRpcResponse(item)
})

// log the selection
console.log(`Your selections are: ${result[0]}`)
```

If you wanted to allow an option to be selectable multiple times (choose mode), you would invoke the method as follows:

```typescript
const txid = await collection.sampleFromRuntimeCollection(
  values: options,
  samples: 5,
  pick: false,
);
```

## Real world example:

The NeoF1 community recently hosted an event for an airdrop of 10 Puppet utility NFTs. Over 100 unique
members participated in the event by providing their addresses in a public discord channel for a chance to win a Puppet.
Generally, once the addresses for a competition like this are collected, there isn't any visibility to the participants
with regard to the selection process. We've coordinated with the NeoF1 team to ensure a completely transparent
selection process.

In our case, we can use the collection prop to select winners with **100% transparency**:

```typescript
import { Collection } from "@cityofzion/props"
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'
import { rpc, u } from '@cityofzion/neon-core' // will be used to check the result of the transaction

const node = //refer to dora.coz.io/monitor for a list of nodes.
const scriptHash = //refer to the scriptHashes section above
const account = // need to send either an wallet.Account() or undefined, testInvokes don't need an account
const neo3Invoker = await NeonInvoker.init(node, account) // need to instantiate a Neo3Invoker, currently only NeonInvoker implements this interface
const neo3Parser = NeonParser // need to use a Neo3Parser, currently only NeonParser implements this interface

// initialize our collection prop instance
const collection = new Collection({
  scriptHash,
  invoker: neo3Invoker,
  parser: neo3Parser,
})

const options = [
  // a bunch of Neo N3 addresses or some other identifier
]

// lets filter out all the users who submitted their address twice because they were super excited!
const uniqueContestants = options.filter(onlyUnique)

// We'll use the first few characters of the sha256 of their address to select from.  This allows users to verify
// that the contest was fair without dumping a ton of data onto the chain or communicating all the participating
// addresses.  In this case, 4 characters was enough to guarantee that every value was unique. Make sure to
//check this before invoking
const contestantsClean = uniqueContestants.map((item) => {
  return u.sha256(item).slice(0, 4);
});
assert(contestantsClean.length === contestantsClean.filter(onlyUnique).length);

const txid = await collection.sampleFromRuntimeCollection(
  values: contestantsClean,
  samples: 10,
  pick: true
);
console.log(txid); // https://dora.coz.io/transaction/neo3/mainnet/0xd049accd037666973883dd35704daeeb35b42b9358c710600606a20f777c7bb4

await helpers.sleep(30000);

const client = new rpc.RPCClient(node)
const tx = await client.getApplicationLog(txid)
const result = tx.executions[0].stack!.map( (item) => {
  return NeonParser.parseRpcResponse(item)
})

// log the selection
console.log(`Your selections are: ${result[0]}`);
//[
//    '86e2', '6b6c',
//    '7789', 'b4ed',
//    'e416', 'e367',
//    '57bf', 'c37b',
//    '0fb4', '72fe'
//]

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
```

We can then use the short hashes to identify which addresses were selected and mint puppets to the winners.
