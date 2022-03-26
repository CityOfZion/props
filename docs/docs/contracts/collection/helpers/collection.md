---
sidebar_label: collection
title: collection.helpers.collection
---

#### create\_collection\_internal

```python
def create_collection_internal(author: UInt160, description: bytes,
                               collection_type: bytes, extra: bytes,
                               values: [bytes]) -> bytes
```

Creates a new collection

**Arguments**:

- `author`: The author of the collection
- `description`: The collection description
- `collection_type`: The type of the data being stored
- `extra`: Extra fields
- `values`: The values of the collection

**Returns**:

The collection id

#### get\_collection\_json\_internal

```python
def get_collection_json_internal(collection_id: bytes) -> Dict[str, Any]
```

Gets a JSON formatted collection

**Arguments**:

- `collection_id`: The collection_id being requested

**Returns**:

A dictionary representing the collection

#### get\_collection\_internal

```python
def get_collection_internal(collection_id: bytes) -> Collection
```

Gets a Collection instance

**Arguments**:

- `collection_id`: The collection_id being requested

**Returns**:

A Collection class instance

#### get\_collection\_raw\_internal

```python
def get_collection_raw_internal(collection_id: bytes) -> bytes
```

Gets the raw bytes of a collection

**Arguments**:

- `collection_id`: The collection_id being requested

**Returns**:

The serialized Collection class instance

#### total\_collections\_internal

```python
def total_collections_internal() -> int
```

Gets the total collections

**Returns**:

An integer representation of the total collections

