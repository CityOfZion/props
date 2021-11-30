from typing import Any, Dict, cast
from boa3.builtin.interop.stdlib import serialize, deserialize
from boa3.builtin.interop.storage import get, put

"""
INTERNAL MODULE:
These methods and the class can be imported and used in other smart contracts to expand upon the features.  This can
be done natively (in-contract) or by interfacing with the deployed version of this contract by making a contract call to
`get_collection`, then deserializing and casting to the Collection class.
"""

COLLECTION_KEY = b'c'
TOTAL_COLLECTIONS = b'!TOTAL_COLLECTIONS'


class Collection:

    def __init__(self):
        self._id: bytes = b''
        self._description: bytes = b''
        self._type: bytes = b''
        self._extra: bytes = b''
        self._values: [bytes] = []

    def get_id(self) -> bytes:
        return self._id

    def get_value(self, index: int) -> bytes:
        collection_values: [bytes] = self._values
        return collection_values[index]

    def set_extra(self, extra: bytes) -> bool:
        self._extra = extra
        return True

    def set_id(self, collection_id: bytes) -> bool:
        self._id = collection_id
        return True

    def set_description(self, description: bytes) -> bool:
        self._description = description
        return True

    def set_type(self, collection_type: bytes) -> bool:
        self._type = collection_type
        return True

    def set_values(self, values: [bytes]) -> bool:
        self._values = values
        return True

    def export(self) -> Dict[str, Any]:
        exported = {
            'id': self._id,
            'description': self._description,
            'extra': self._extra,
            'type': self._type,
            'values': self._values
        }
        return exported


def create_collection_internal(description: bytes, collection_type: bytes, extra: bytes, values: [bytes]) -> bytes:
    collection: Collection = Collection()
    collection_id: bytes = (total_collections_internal() + 1).to_bytes()
    x: bool = collection.set_id(collection_id)
    x = collection.set_description(description)
    x = collection.set_values(values)
    x = collection.set_extra(extra)
    x = collection.set_type(collection_type)

    key: bytes = mk_collection_key(collection_id)
    put(key, serialize(collection))
    put(TOTAL_COLLECTIONS, collection_id)
    return collection_id


def get_collection_json_internal(collection_id: bytes) -> Dict[str, Any]:
    collection: Collection = get_collection_internal(collection_id)
    return collection.export()


def get_collection_internal(collection_id: bytes) -> Collection:
    collection_bytes: bytes = get_collection_raw_internal(collection_id)
    return cast(Collection, deserialize(collection_bytes))


def get_collection_raw_internal(collection_id: bytes) -> bytes:
    key: bytes = mk_collection_key(collection_id)
    return get(key)


def total_collections_internal() -> int:
    total: bytes = get(TOTAL_COLLECTIONS)
    if len(total) == 0:
        return 0
    return total.to_int()


def mk_collection_key(collection_id: bytes) -> bytes:
    return COLLECTION_KEY + collection_id
