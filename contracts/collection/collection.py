from typing import Any, Dict, cast
from boa3.builtin.type import UInt160
from boa3.builtin import CreateNewEvent, NeoMetadata, metadata, public, contract
from boa3.builtin.interop.blockchain import Transaction
from boa3.builtin.interop.runtime import script_container
from boa3.builtin.interop.contract import update_contract
from boa3.builtin.interop.storage import get, put
from collection.helpers.collection import Collection, create_collection_internal, get_collection_json_internal, \
    get_collection_internal, total_collections_internal


OWNER_KEY = b'OWNER'


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
    return meta


new_collection = CreateNewEvent(
    [
        ('collection_id', bytes),
    ],
    'NewCollection'
)


@public
def create_collection(description: bytes, collection_type: bytes, extra: bytes,  vals: [bytes]) -> int:
    """
    Creates a new collection
    :param description: A brief string formatted description of the collection
    :param collection_type: A string formatted type definition.  Where possible, use naming the Neo type naming syntax
    :param extra: An option payload for supplemental data
    :param vals: The array of values in the collection
    :return: The collection id
    """
    tx = cast(Transaction, script_container)
    author: UInt160 = tx.sender

    collection_id: bytes = create_collection_internal(author, description, collection_type, extra, vals)
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
    vals: [bytes] = collection.get_values()
    idx: int = Dice.map_bytes_onto_range(0, len(vals) - 1, entropy)
    return vals[idx]


@public
def sample_from_collection(collection_id: bytes, samples: int) -> [bytes]:
    """
    Gets values from a uniform-random sampled index of a colection
    :param collection_id: The collection_id of the collection to sample from
    :param samples: the number of samples to return
    :return: The value at the sampled index
    """
    collection: Collection = get_collection_internal(collection_id)
    collection_values: [bytes] = collection.get_values()

    result: [bytes] = []
    for x in range(samples):
        idx: int = Dice.rand_between(0, len(collection_values) - 1)
        result.append(collection_values[idx])
    return result


@public
def sample_from_runtime_collection(vals: [bytes], samples: int, pick: bool) -> [bytes]:
    """
    Gets values from a uniform-random sampled index an array.  The user has the option of replacement.
    :param vals: the values to uniformly sample from
    :param samples: the number of samples to return
    :return: The value at the sampled index
    """
    assert (not pick) or \
           (len(vals) >= samples)

    result: [bytes] = []
    for x in range(samples):
        idx: int = Dice.rand_between(0, len(vals) - 1)
        result.append(vals[idx])

        if pick:
            # if pick, remove the index as a selectable option
            vals.pop(idx)

    return result


@public
def total_collections() -> int:
    """
    Gets the total collection count
    :return: An integer representing the total collections in the contract
    """
    return total_collections_internal()


@public
def update(script: bytes, manifest: bytes, data: Any):
    """
    Updates the smart contract script
    :param script: The new script to update to
    :param manifest: The new manifest to update to
    :param data: additional data field
    :return:
    :raise AssertionError: raised if the user lacks the "update" permission
    """
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    owner: UInt160 = get(OWNER_KEY)

    assert owner == signer, "User Permission Denied"

    update_contract(script, manifest, data)


@public
def _deploy(data: Any, update: bool):
    if not update:
        tx = cast(Transaction, script_container)
        signer: UInt160 = tx.sender
        put(OWNER_KEY, signer)


@contract('0x16d6a0be0506b26e0826dd352724cda0defa7131')
class Dice:

    @staticmethod
    def rand_between(start: int, end: int) -> int:
        pass

    @staticmethod
    def map_bytes_onto_range(start: int, end: int, entropy: bytes) -> int:
        pass

