---
sidebar_label: dice
title: dice.dice
---

#### manifest\_metadata

```python
@metadata
def manifest_metadata() -> NeoMetadata
```

Defines this smart contract&#x27;s metadata information

#### rand\_between

```python
@public
def rand_between(start: int, end: int) -> int
```

Gets a random number of range [start, end] inclusive.

**Arguments**:

- `start`: The starting index (inclusive)
- `end`: The ending index (inclusive)

**Returns**:

An integer representing the result

#### map\_bytes\_onto\_range

```python
@public
def map_bytes_onto_range(start: int, end: int, entropy: bytes) -> int
```

Maps entropy bytes onto a range of values as returns the result this mapping is done as follows:

([0, max_int(len(entropy))] -&gt; [start, end])[entropy]

**Arguments**:

- `start`: The starting index to sample from (inclusive)
- `end`: The ending index to sample from (inclusive)
- `entropy`: The entropy to sample at

**Returns**:

An integer representing the result

#### roll\_die

```python
@public
def roll_die(die: str) -> int
```

Rolls a dX formatted die

**Arguments**:

- `die`: the dX notation of the die to roll

**Returns**:

An integer representing the result of the roll

#### roll\_dice\_with\_entropy

```python
@public
def roll_dice_with_entropy(die: str, precision: int, entropy: bytes) -> [int]
```

Rolls multiple dice using the entropy provided.  This method will return floor(len(entropy)/precision) integers

representing dice roles on a dX formatted die

**Arguments**:

- `die`: The dX formatted die to roll
- `precision`: The byte length to use for each die roll.  Note that if the max value for the die exceeds the max
unsigned int for a byte array of length &quot;precision&quot;, the range will be subsampled.
- `entropy`: The byte entropy used to sample with

**Returns**:

an integer array representing the dice rolls

#### update

```python
@public
def update(script: bytes, manifest: bytes, data: Any)
```

Updates the smart contract script

**Arguments**:

- `script`: The new script to update to
- `manifest`: The new manifest to update to
- `data`: additional data field

**Raises**:

- `AssertionError`: raised if the user lacks the &quot;update&quot; permission

