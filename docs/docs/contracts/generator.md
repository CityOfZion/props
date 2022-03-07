---
sidebar_position: 3
---

# generator
The generator contract is designed to provide probabilistic event features.  It can be used for a number of processes ranging from
procedural object generation to probabilistic event execution.

### Where Am I:
* **PrivateNet:** `0xd9a1fa61f48db26507ed746dd3019709e210e812`
* **Testnet:** [`0xdda8055789f0eb3c1d092c714a68ba3e631586c7`](https://dora.coz.io/contract/neo3/testnet_rc4/0xdda8055789f0eb3c1d092c714a68ba3e631586c7)
* **Mainnet:** TBD

### Using the generator contract:
To use the generator contract, begin by adding the interface to your smart contract.  Below, we provide an example.  Make sure to also include the methods you would like to use. For `SCRIPT_HASH`, refer to the [Where am I?](#where-am-i) section.

```python
from boa3.builtin import contract

@contract({{SCRIPT_HASH}})
class Generator:

    @staticmethod
    def mint_from_instance(from_code: bytes, to_instance_id: bytes) -> Dict[str, Any]:
        pass

```

### Creating a new generator:
To create a new generator, you can either use the contract interface on-chain or side-load via the [SDK](/docs/sdk/ts/classes/Generator#createGenerator).



