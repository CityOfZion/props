from typing import List 
from boa3.builtin.interop.runtime import get_random
from boa3.builtin.interop.stdlib import atoi


# ############################
# ######Dice##################
# ############################
# ############################


def rand_between_internal(start: int, end: int) -> int:
    """
    Samples from a random data stream and returns a uniform random integer between start and end inclusively.
    This method support both positive and negative starting and ending values so long as start < end.
    :param start: the starting integer
    :param end: the ending integer
    :return: a random integer of range start-end
    """
    entropy: bytes = get_random().to_bytes()
    return map_bytes_onto_range_internal(start, end, entropy[0:8])


def map_bytes_onto_range_internal(start: int, end: int, entropy: bytes) -> int:
    """
    Scales a byte range from [0, MAX_INT(len(bytes))] to [start, end]
    :param start: the starting integer in the return range
    :param end: the ending integer in the return range
    :param entropy: the entropy bytes used to scale
    :return: an integer of range start-end
    """
    max_entropy: int = 2 ** (len(entropy) * 8)
    half_max_entropy: int = (max_entropy // 2)
    entropy_int: int = entropy.to_int()
    u_entropy_int: int = entropy_int + half_max_entropy

    numerator: int = ((end + 1) - start) * u_entropy_int

    return (numerator // max_entropy) + start


def roll_die_internal(die: str) -> int:
    """
    Rolls a requested die and returns the result.
    :param die: a string indicating the die format in "dX" format (i.e d10)
    :return: The integer result of the roll.
    """
    entropy: bytes = get_random().to_bytes()
    pruned_entropy: bytes = entropy[0:8]
    return roll_dice_with_entropy_internal(die, len(pruned_entropy), pruned_entropy)[0]


def roll_dice_with_entropy_internal(die: str, precision: int, entropy: bytes) -> List[int]:
    """
    A deterministic conversation of entropy into dice rolls.
    :param precision: a byte length to use in each roll
    :param die: A dX formatted string representing the dice to roll range(d4-d1000)
    :param entropy: 4-bytes of entropy to use for the dice roll
    :return: an array of integer dice rolls.  The length is floor( len(entropy)/precision )
    """
    entropy_length = len(entropy)
    dice_sides: int = atoi(die[1:], 10)
    dice_sides_bytes: bytes = dice_sides.to_bytes()
    assert entropy_length >= len(dice_sides_bytes), "Not enough entropy"

    rolls: List[int] = []
    roll: int
    for i in range(entropy_length // precision):
        e: bytes = entropy[i * precision: (i + 1) * precision]
        roll = map_bytes_onto_range_internal(1, dice_sides, e)
        rolls.append(roll)
    return rolls
