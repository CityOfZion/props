from typing import Any, Dict
from boa3.builtin import CreateNewEvent, NeoMetadata, metadata, public
from helpers.collection import Collection, create_collection_internal, get_collection_json_internal, \
    get_collection_raw_internal, get_collection_internal, total_collections_internal

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
    meta.supportedstandards = ["NEP-11"]
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
def create_collection(description: bytes, collection_type: bytes, extra: bytes,  values: [bytes]) -> bool:
    collection_id: bytes = create_collection_internal(description, collection_type, extra, values)
    new_collection(collection_id)
    return True


@public
def get_collection_json(collection_id: bytes) -> Dict[str, Any]:
    return get_collection_json_internal(collection_id)


@public
def get_collection(collection_id: bytes) -> bytes:
    return get_collection_raw_internal(collection_id)


@public
def get_collection_element(collection_id: bytes, index: int) -> bytes:
    collection: Collection = get_collection_internal(collection_id)
    return collection.get_value(index)


@public
def total_collections() -> int:
    return total_collections_internal()

