---
sidebar_position: 3
---

# collection
The collection contract is designed to store and provision immutable arrays of things.  These can be particularly useful due to storage costs or
the need to quickly sample from a range of data (like a discrete probability distribution).

### Where Am I:
* **PrivateNet:** `0x3b5c2a785510b712ee16074702b585c61e0054ba` or [`refer to the sdk`](https://props.coz.io/d/sdk/ts/classes/Collection.html#scriptHash)
* **Testnet:** [`0x429ba9252c761b6119ab9442d9fbe2e60f3c6f3e`](https://dora.coz.io/contract/neo3/testnet_rc4/0x429ba9252c761b6119ab9442d9fbe2e60f3c6f3e)
* **Mainnet:** TBD

### Using the collection contract:
To use the collection contract, begin by adding the interface to your smart contract.  Below, we provide an example.  Make sure to also include the methods you would like to use. For `SCRIPT_HASH`, refer to the [Where am I?](#where-am-i) section.

```python
from boa3.builtin import contract

@contract({{SCRIPT_HASH}})
class Collection:

  @staticmethod
  def get_collection_element(collection:id: bytes, index: int) -> bytes:
      pass

  @staticmethod
  def sample_from_collection(collection_id: int) -> bytes:
      pass
```

### Creating a new collection:
To create a new collection, you can either use the contract interface on-chain or side-load via the [SDK](/docs/sdk/typescript/collection#creating-a-collection).




