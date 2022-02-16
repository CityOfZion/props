from typing import Any, Dict, cast
from boa3.builtin.type import UInt160
from boa3.builtin import CreateNewEvent, NeoMetadata, metadata, public, contract
from boa3.builtin.interop.blockchain import Transaction
from boa3.builtin.interop.runtime import script_container
from boa3.builtin.interop.storage import get, put
from boa3.builtin.interop.stdlib import serialize, deserialize


@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = "COZ, Inc."
    meta.description = "A public smart contract for storing immutable collections of stuff"
    meta.email = "contact@coz.io"
    meta.supported_standards = []
    meta.permissions = [{"contract": "*", "methods": "*"}]
    return meta


new_collection = CreateNewEvent(
    [
        ('collection_id', bytes),
    ],
    'new_collection'
)


"""
PUBLIC API LAYER METHODS:
These methods are publicly exposed on the deployed smart contract.  An SDK is available as part of the props project.
"""


@public
def create_collection(description: bytes, collection_type: bytes, extra: bytes,  values: [bytes]) -> int:
    """
    Creates a new collection
    :param description: A brief string formatted description of the collection
    :param collection_type: A string formatted type definition.  Where possible, use naming the Neo type naming syntax
    :param extra: An option payload for supplemental data
    :param values: The array of values in the collection
    :return: The collection id
    """
    tx = cast(Transaction, script_container)
    author: UInt160 = tx.sender

    collection_id: bytes = create_collection_internal(author, description, collection_type, extra, values)
    new_collection(collection_id)
    return collection_id.to_int()


@public
def get_collection_json(collection_id: bytes) -> Dict[str, Any]:
    """
    Gets the JSON formatted collection
    :param collection_id: The byte formatted collection_id
    :return: A dictionary representing the collection
    """
    return get_collection_json_internal(collection_id)


@public
def get_collection(collection_id: bytes) -> Collection:
    """
    Gets a Collection class instance
    :param collection_id: The byte formatted collection_id
    :return: A Collection instance of the requested collection_id
    """
    return get_collection_internal(collection_id)


@public
def get_collection_element(collection_id: bytes, index: int) -> bytes:
    """
    Gets the value at a requested index in a collection
    :param collection_id: The collection_id to reference
    :param index: The index of the value to get
    :return: bytes at the requested index
    """
    collection: Collection = get_collection_internal(collection_id)
    return collection.get_value(index)


@public
def get_collection_length(collection_id: bytes) -> int:
    """
    Gets the length of a collection
    :param collection_id: The collection_id to get the length of
    :return: An integer representing the length of the collection
    """
    collection_values: [bytes] = get_collection_values(collection_id)
    return len(collection_values)


@public
def get_collection_values(collection_id: bytes) -> [bytes]:
    """
    Gets the values of a collection
    :param collection_id: The collection_id to get the values of
    :return: An array containing the values of a collection
    """
    collection: Collection = get_collection_internal(collection_id)
    collection_values: [bytes] = collection.get_values()
    return collection_values


@public
def map_bytes_onto_collection(collection_id: bytes, entropy: bytes) -> bytes:
    """
    Returns the value of a collection at an index defined by byte entropy which has been mapped onto the array.
    :param collection_id: The collection_id of the collection to sample from
    :param entropy: The entropy value to sample
    :return: The bytes at the sample location
    """
    collection: Collection = get_collection_internal(collection_id)
    values: [bytes] = collection.get_values()
    idx: int = Dice.map_bytes_onto_range(0, len(values) - 1, entropy)
    return values[idx]
    #collection_raw: bytes = get_collection_raw_internal(collection_id)
    #debug(['got the collection', collection_raw])
    #collection: Collection = cast(Collection, collection_raw)
    #collection_values: [bytes] = collection.get_values()
    #debug(['values: ', collection_values])
    #collection_values: [bytes] = collection.get_values()
    #debug(['value 0: ', collection_values[0]])
    #idx: int = Dice.map_bytes_onto_range(0, len(collection_values) - 1, entropy)
    #return collection_values[idx]


@public
def sample_from_collection(collection_id: bytes) -> bytes:
    """
    Gets the value for a uniform-random index of a colection
    :param collection_id: The collection_id of the collection to sample from
    :return: The value at the sampled index
    """
    collection: Collection = get_collection_internal(collection_id)
    collection_values: [bytes] = collection.get_values()

    idx: int = Dice.rand_between(0, len(collection_values) - 1)
    return collection_values[idx]


@public
def total_collections() -> int:
    """
    Gets the total collection count
    :return: An integer representing the total collections in the contract
    """
    return total_collections_internal()


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
    x: bool = collection.set_id(collection_id)
    x = collection.set_author(author)
    x = collection.set_description(description)
    x = collection.set_values(values)
    x = collection.set_extra(extra)
    x = collection.set_type(collection_type)

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


@contract('0xbb01a4973fe466282757d5e55e6433b080691cab')
class Dice:

    @staticmethod
    def rand_between(start: int, end: int) -> int:
        pass

    @staticmethod
    def map_bytes_onto_range(start: int, end: int, entropy: bytes) -> int:
        pass

