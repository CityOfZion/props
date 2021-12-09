from typing import Any, Dict, cast
from boa3.builtin.type import UInt160
from boa3.builtin import CreateNewEvent, NeoMetadata, metadata, public, contract
from boa3.builtin.interop.blockchain import Transaction
from boa3.builtin.interop.runtime import script_container
from boa3.builtin.interop.storage import get, put
from boa3.builtin.interop.stdlib import serialize, deserialize

"""
This object is designed to provide 3 services to users:
1) This object is deployed to the Neo N3 mainnet as a contract for direct interfacing via the public methods.
2) This object can be imported and interfaced with using the internal methods as a module for other smart contracts.
3) This object may be imported for use as a decentralized interface for other smart contracts.
"""

@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = "COZ, Inc."
    meta.description = "A public smart contract for storing immutable collections of stuff"
    meta.email = "contact@coz.io"
    meta.supportedstandards = []
    meta.permissions = [{"contract": "*", "methods": "*"}]
    return meta


debug = CreateNewEvent(
    [
        ('params', list),
    ],
    'Debug'
)

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

    tx = cast(Transaction, script_container)
    author: UInt160 = tx.sender

    collection_id: bytes = create_collection_internal(author, description, collection_type, extra, values)
    new_collection(collection_id)
    return collection_id.to_int()


@public
def get_collection_json(collection_id: bytes) -> Dict[str, Any]:
    return get_collection_json_internal(collection_id)


@public
def get_collection(collection_id: bytes) -> Collection:
    return get_collection_internal(collection_id)


@public
def get_collection_element(collection_id: bytes, index: int) -> bytes:
    collection: Collection = get_collection_internal(collection_id)
    return collection.get_value(index)


@public
def get_collection_length(collection_id: bytes) -> int:
    collection_values: [bytes] = get_collection_values(collection_id)
    return len(collection_values)


@public
def get_collection_values(collection_id: bytes) -> [bytes]:
    collection: Collection = get_collection_internal(collection_id)
    collection_values: [bytes] = collection.get_values()
    return collection_values


@public
def map_bytes_onto_collection(collection_id: bytes, entropy: bytes) -> bytes:
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
    collection: Collection = get_collection_internal(collection_id)
    collection_values: [bytes] = collection.get_values()

    idx: int = Dice.rand_between(0, len(collection_values) - 1)
    return collection_values[idx]


@public
def total_collections() -> int:
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



@contract('0x68021f61e872098627da52dc82ca793575c83826')
class Dice:

    @staticmethod
    def rand_between(start: int, end: int) -> int:
        pass

    @staticmethod
    def map_bytes_onto_range(start: int, end: int, entropy: bytes) -> int:
        pass

