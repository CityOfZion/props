---
sidebar_position: 2
---

# dice
The dice contract wraps the random number generation features of Neo N3 and exposes some higher level utility.

### Where Am I:
* **PrivateNet:** `0x16d6a0be0506b26e0826dd352724cda0defa7131` or [`refer to the sdk`](https://props.coz.io/d/sdk/ts/classes/Dice.html#scriptHash)
* **Testnet:** [`0x4380f2c1de98bb267d3ea821897ec571a04fe3e0`](https://dora.coz.io/contract/neo3/testnet_rc4/0x4380f2c1de98bb267d3ea821897ec571a04fe3e0)
* **Mainnet:** TBD

### Using the dice contract:
To use the dice contract, begin by adding the interface to your smart contract.  Below, we provide an example.  Make sure to also include the methods you would like to use. For `SCRIPT_HASH`, refer to the [Where am I?](#where-am-i) section.

```python
from boa3.builtin import contract

@contract({{SCRIPT_HASH}})
class Dice:

    @staticmethod
    def rand_between(start: int, end: int) -> int:
        pass

    @staticmethod
    def map_bytes_onto_range(start: int, end: int, entropy: bytes) -> int:
        pass

```

