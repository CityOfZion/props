from typing import Any, Dict, cast
from boa3.builtin.type import UInt160
from boa3.builtin.interop.storage import get, put
from boa3.builtin.interop.stdlib import serialize, deserialize

####################################
####################################

COLLECTION_KEY = b'c'
TOTAL_COLLECTIONS = b'!TOTAL_COLLECTIONS'


class Collection:

    def __init__(self):
        self._id: bytes = b''
        self._author: UInt160 = b''
        self._description: bytes = b''
        self._type: bytes = b''
        self._extra: bytes = b''
        self._values: [bytes] = []

    def get_id(self) -> bytes:
        return self._id

    def get_values(self) -> [bytes]:
        return self._values

    def get_value(self, index: int) -> bytes:
        collection_values: [bytes] = self._values
        return collection_values[index]

    def set_author(self, author: UInt160) -> bool:
        self._author = author
        return True

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
            'author': self._author,
            'description': self._description,
            'extra': self._extra,
            'type': self._type,
            'values': self._values
        }
        return exported


def create_collection_internal(author: UInt160, description: bytes, collection_type: bytes, extra: bytes, values: [bytes]) -> bytes:
    """
    Creates a new collection
    :param author: The author of the collection
    :param description: The collection description
    :param collection_type: The type of the data being stored
    :param extra: Extra fields
    :param values: The values of the collection
    :return: The collection id
    """
    collection: Collection = Collection()
    collection_id: bytes = (total_collections_internal() + 1).to_bytes()
    collection.set_id(collection_id)
    collection.set_author(author)
    collection.set_description(description)
    collection.set_values(values)
    collection.set_extra(extra)
    collection.set_type(collection_type)

    key: bytes = mk_collection_key(collection_id)
    put(key, serialize(collection))
    put(TOTAL_COLLECTIONS, collection_id)
    return collection_id


def get_collection_json_internal(collection_id: bytes) -> Dict[str, Any]:
    """
    Gets a JSON formatted collection
    :param collection_id: The collection_id being requested
    :return: A dictionary representing the collection
    """
    collection: Collection = get_collection_internal(collection_id)
    return collection.export()


def get_collection_internal(collection_id: bytes) -> Collection:
    """
    Gets a Collection instance
    :param collection_id: The collection_id being requested
    :return: A Collection class instance
    """
    collection_bytes: bytes = get_collection_raw_internal(collection_id)
    return cast(Collection, deserialize(collection_bytes))


def get_collection_raw_internal(collection_id: bytes) -> bytes:
    """
    Gets the raw bytes of a collection
    :param collection_id: The collection_id being requested
    :return: The serialized Collection class instance
    """
    key: bytes = mk_collection_key(collection_id)
    return get(key)


def total_collections_internal() -> int:
    """
    Gets the total collections
    :return: An integer representation of the total collections
    """
    total: bytes = get(TOTAL_COLLECTIONS)
    if len(total) == 0:
        return 0
    return total.to_int()


def mk_collection_key(collection_id: bytes) -> bytes:
    return COLLECTION_KEY + collection_id
