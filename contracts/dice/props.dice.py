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
    meta.description = "A public smart contract with some random methods."
    meta.email = "contact@coz.io"
    meta.supported_standards = []
    meta.permissions = [{"contract": "*", "methods": "*"}]
    return meta

@public
def rand_between(start: int, end: int) -> int:
    """
    Gets a random number of range [start, end] inclusive.
    :param start: The starting index (inclusive)
    :param end: The ending index (inclusive)
    :return: An integer representing the result
    """
    return rand_between_internal(start, end)


@public
def map_bytes_onto_range(start: int, end: int, entropy: bytes) -> int:
    """
    Maps entropy bytes onto a range of values as returns the result this mapping is done as follows:
    ([0, max_int(len(entropy))] -> [start, end])[entropy]
    :param start: The starting index to sample from (inclusive)
    :param end: The ending index to sample from (inclusive)
    :param entropy: The entropy to sample at
    :return: An integer representing the result
    """
    return map_bytes_onto_range_internal(start, end, entropy)


@public
def roll_die(die: str) -> int:
    """
    Rolls a dX formatted die
    :param die: the dX notation of the die to roll
    :return: An integer representing the result of the roll
    """
    return roll_die_internal(die)


@public
def roll_dice_with_entropy(die: str, precision: int, entropy: bytes) -> [int]:
    """
    Rolls multiple dice using the entropy provided.  This method will return floor(len(entropy)/precision) integers
    representing dice roles on a dX formatted die
    :param die: The dX formatted die to roll
    :param precision: The byte length to use for each die roll.  Note that if the max value for the die exceeds the max
    unsigned int for a byte array of length "precision", the range will be subsampled.
    :param entropy: The byte entropy used to sample with
    :return: an integer array representing the dice rolls
    """
    return roll_dice_with_entropy_internal(die, precision, entropy)
