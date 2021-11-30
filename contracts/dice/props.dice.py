from boa3.builtin import NeoMetadata, metadata, public
from helpers.dice import roll_die_internal, roll_dice_with_entropy_internal, roll_initial_stat_internal, \
    roll_initial_stat_with_entropy_internal

@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = "COZ, Inc."
    meta.description = "A public prop for dice interactions"
    meta.email = "contact@coz.io"
    meta.supportedstandards = []
    meta.permissions = [{"contract": "*", "methods": "*"}]
    return meta

@public
def roll_die(die: str) -> int:
    return roll_die_internal(die)


@public
def roll_dice_with_entropy(die: str, precision: int, entropy: bytes) -> [int]:
    return roll_dice_with_entropy_internal(die, precision, entropy)


@public
def roll_initial_stat() -> int:
    return roll_initial_stat_internal()


@public
def roll_initial_stat_with_entropy(entropy: bytes) -> int:
    return roll_initial_stat_with_entropy_internal(entropy)
