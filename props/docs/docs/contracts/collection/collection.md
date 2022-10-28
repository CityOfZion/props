---
sidebar_label: collection
title: collection.collection
---

#### manifest\_metadata

```python
@metadata
def manifest_metadata() -> NeoMetadata
```

Defines this smart contract&#x27;s metadata information

#### create\_collection

```python
@public
def create_collection(description: bytes, collection_type: bytes, extra: bytes,
                      vals: List[bytes]) -> int
```

Creates a new collection

**Arguments**:

- `description`: A brief string formatted description of the collection
- `collection_type`: A string formatted type definition.  Where possible, use naming the Neo type naming syntax
- `extra`: An option payload for supplemental data
- `vals`: The array of values in the collection

**Returns**:

The collection id

#### get\_collection\_json

```python
@public
def get_collection_json(collection_id: bytes) -> Dict[str, Any]
```

Gets the JSON formatted collection

**Arguments**:

- `collection_id`: The byte formatted collection_id

**Returns**:

A dictionary representing the collection

#### get\_collection

```python
@public
def get_collection(collection_id: bytes) -> Collection
```

Gets a Collection class instance

**Arguments**:

- `collection_id`: The byte formatted collection_id

**Returns**:

A Collection instance of the requested collection_id

#### get\_collection\_element

```python
@public
def get_collection_element(collection_id: bytes, index: int) -> bytes
```

Gets the value at a requested index in a collection

**Arguments**:

- `collection_id`: The collection_id to reference
- `index`: The index of the value to get

**Returns**:

bytes at the requested index

#### get\_collection\_length

```python
@public
def get_collection_length(collection_id: bytes) -> int
```

Gets the length of a collection

**Arguments**:

- `collection_id`: The collection_id to get the length of

**Returns**:

An integer representing the length of the collection

#### get\_collection\_values

```python
@public
def get_collection_values(collection_id: bytes) -> List[bytes]
```

Gets the values of a collection

**Arguments**:

- `collection_id`: The collection_id to get the values of

**Returns**:

An array containing the values of a collection

#### map\_bytes\_onto\_collection

```python
@public
def map_bytes_onto_collection(collection_id: bytes, entropy: bytes) -> bytes
```

Returns the value of a collection at an index defined by byte entropy which has been mapped onto the array.

**Arguments**:

- `collection_id`: The collection_id of the collection to sample from
- `entropy`: The entropy value to sample

**Returns**:

The bytes at the sample location

#### sample\_from\_collection

```python
@public
def sample_from_collection(collection_id: bytes, samples: int) -> List[bytes]
```

Gets values from a uniform-random sampled index of a colection

**Arguments**:

- `collection_id`: The collection_id of the collection to sample from
- `samples`: the number of samples to return

**Returns**:

The value at the sampled index

#### sample\_from\_runtime\_collection

```python
@public
def sample_from_runtime_collection(vals: List[bytes], samples: int,
                                   pick: bool) -> List[bytes]
```

Gets values from a uniform-random sampled index an array.  The user has the option of replacement.

**Arguments**:

- `vals`: the values to uniformly sample from
- `samples`: the number of samples to return

**Returns**:

The value at the sampled index

#### total\_collections

```python
@public
def total_collections() -> int
```

Gets the total collection count

**Returns**:

An integer representing the total collections in the contract

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

