---
sidebar_label: generator
title: generator.generator
---

#### manifest\_metadata

```python
@metadata
def manifest_metadata() -> NeoMetadata
```

Defines this smart contract&#x27;s metadata information

#### get\_generator\_instance\_json

```python
@public
def get_generator_instance_json(instance_id: bytes) -> Dict[str, Any]
```

Gets the JSON formatted representation of an generator instance

**Arguments**:

- `instance_id`: the byte formatted instance_id

**Returns**:

A dictionary representation of an instance_id

#### get\_generator\_instance

```python
@public
def get_generator_instance(instance_id: bytes) -> GeneratorInstance
```

Gets an GeneratorInstance class instance

**Arguments**:

- `instance_id`: the byte formatted instance_id

**Returns**:

An generator instance class instance

#### get\_generator\_instance\_raw

```python
def get_generator_instance_raw(instance_id: bytes) -> bytes
```

Gets a serialized generator instance

**Arguments**:

- `instance_id`: the byte formatted pointer to the generator instance

**Returns**:

a serialized generator instance

#### total\_generator\_instances

```python
@public
def total_generator_instances() -> int
```

Gets the total generator instances

**Returns**:

An integer representing the total generator instances

#### create\_trait

```python
@public
def create_trait(generator_id: bytes, label: bytes, slots: int,
                 trait_levels: List) -> bytes
```

Binds a new trait to an generator

**Arguments**:

- `generator_id`: the generator_id to bind the trait to
- `label`: the trait&#x27;s label
- `slots`: the maximum number of events that can mint on this trait
- `trait_levels`: a list of the trait levels

**Returns**:

the trait_id

#### get\_trait\_json

```python
@public
def get_trait_json(trait_id: bytes) -> Dict[str, Any]
```

Gets the JSON formatted representation of an trait

**Arguments**:

- `trait_id`: the byte formatted trait_id

**Returns**:

A dictionary representation of a trait

#### total\_generators

```python
@public
def total_generators() -> int
```

Gets the total generator count

**Returns**:

An integer representing the total generator count

#### create\_generator

```python
@public
def create_generator(label: bytes, base_generator_fee: int) -> int
```

Creates a new generator

**Arguments**:

- `label`: A byte formatted string defining the generator
- `base_generator_fee`: The base GAS fee to use this generator

**Returns**:

An integer representing the generator_id

#### get\_generator\_json

```python
@public
def get_generator_json(generator_id: bytes) -> Dict[str, Any]
```

Gets the JSON formatted representation of an generator

**Arguments**:

- `generator_id`: the byte formatted generator_id

**Returns**:

A dictionary representation of an generator

#### get\_generator

```python
@public
def get_generator(generator_id: bytes) -> Generator
```

Gets an Generator class instance

**Arguments**:

- `generator_id`: the byte formatted generator_id

**Returns**:

An generator class instance

#### get\_generator\_raw

```python
def get_generator_raw(generator_id: bytes) -> bytes
```

Gets a serialized generator

**Arguments**:

- `generator_id`: the byte formatted pointer to the generator

**Returns**:

a serialized generator

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

