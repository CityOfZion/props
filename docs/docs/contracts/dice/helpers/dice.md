---
sidebar_label: dice
title: dice.helpers.dice
---

#### rand\_between\_internal

```python
def rand_between_internal(start: int, end: int) -> int
```

Samples from a random data stream and returns a uniform random integer between start and end inclusively.

This method support both positive and negative starting and ending values so long as start &lt; end.

**Arguments**:

- `start`: the starting integer
- `end`: the ending integer

**Returns**:

a random integer of range start-end

#### map\_bytes\_onto\_range\_internal

```python
def map_bytes_onto_range_internal(start: int, end: int, entropy: bytes) -> int
```

Scales a byte range from [0, MAX_INT(len(bytes))] to [start, end]

**Arguments**:

- `start`: the starting integer in the return range
- `end`: the ending integer in the return range
- `entropy`: the entropy bytes used to scale

**Returns**:

an integer of range start-end

#### roll\_die\_internal

```python
def roll_die_internal(die: str) -> int
```

Rolls a requested die and returns the result.

**Arguments**:

- `die`: a string indicating the die format in &quot;dX&quot; format (i.e d10)

**Returns**:

The integer result of the roll.

#### roll\_dice\_with\_entropy\_internal

```python
def roll_dice_with_entropy_internal(die: str, precision: int,
                                    entropy: bytes) -> [int]
```

A deterministic conversation of entropy into dice rolls.

**Arguments**:

- `precision`: a byte length to use in each roll
- `die`: A dX formatted string representing the dice to roll range(d4-d1000)
- `entropy`: 4-bytes of entropy to use for the dice roll

**Returns**:

an array of integer dice rolls.  The length is floor( len(entropy)/precision )

