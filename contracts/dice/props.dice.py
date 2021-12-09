from boa3.builtin import NeoMetadata, metadata, public
from helpers.dice import roll_die_internal, roll_dice_with_entropy_internal, \
    rand_between_internal, map_bytes_onto_range_internal


@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = "COZ, Inc."
    meta.description = "A public prop with some random methods."
    meta.email = "contact@coz.io"
    meta.supportedstandards = []
    meta.permissions = [{"contract": "*", "methods": "*"}]
    return meta

@public
def rand_between(start: int, end: int) -> int:
    return rand_between_internal(start, end)


@public
def map_bytes_onto_range(start: int, end: int, entropy: bytes) -> int:
    return map_bytes_onto_range_internal(start, end, entropy)


@public
def roll_die(die: str) -> int:
    return roll_die_internal(die)


@public
def roll_dice_with_entropy(die: str, precision: int, entropy: bytes) -> [int]:
    return roll_dice_with_entropy_internal(die, precision, entropy)
