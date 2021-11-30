from typing import Dict
from boa3.builtin.interop.runtime import get_random
from boa3.builtin import NeoMetadata, metadata, public

@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = "COZ, Inc."
    meta.description = "A public prop for dice interations"
    meta.email = "contact@coz.io"
    meta.supportedstandards = []
    meta.permissions = [{"contract": "*", "methods": "*"}]
    return meta

#############################
#######Dice##################
#############################
#############################

# A discrete representation of the distribution representing 4d6 drop one for indexing using a halfword.
INITIAL_STAT_PROBABILITY = [3, 4, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                            8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10,
                            10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
                            10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
                            11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
                            11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
                            12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13,
                            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
                            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14,
                            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
                            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15,
                            15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                            15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
                            16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18,
                            18, 18, 18, 18]

MAX_INT = [
    0,
    128,
    32768,
    8388608,
    2147483648
]

ENTROPY_MAP: Dict[
    str,
    Dict[str, int]
] = {
    'd4': {
        'min_entropy': 1,
        'num_scalar': 4,
    },
    'd6': {
        'min_entropy': 1,
        'num_scalar': 6,
    },
    'd8': {
        'min_entropy': 1,
        'num_scalar': 8,
    },
    'd10': {
        'min_entropy': 1,
        'num_scalar': 10,
    },
    'd12': {
        'min_entropy': 1,
        'num_scalar': 12,
    },
    'd20': {
        'min_entropy': 1,
        'num_scalar': 20,
    },
    'd100': {
        'min_entropy': 1,
        'num_scalar': 100,
    },
    'd1000': {
        'min_entropy': 2,
        'num_scalar': 1000,
    },
    'd10000': {
        'min_entropy': 2,
        'num_scalar': 10000,
    }
}


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


def roll_die_internal(die: str) -> int:
    """
    Rolls a requested die and returns the result.
    @param die: a string indicating the die format in "dX" format (i.e d10)
    @return: The integer result of the roll.
    """
    constants = ENTROPY_MAP[die]
    entropy: bytes = get_random().to_bytes()

    return roll_dice_with_entropy_internal(die, constants['min_entropy'], entropy[:constants['min_entropy']])[0]


def roll_dice_with_entropy_internal(die: str, precision: int, entropy: bytes) -> [int]:
    """
    A deterministic conversation of entropy into dice rolls.
    @param precision: a byte length to use in each roll
    @param die: A dX formatted string representing the dice to roll range(d4-d1000)
    @param entropy: 4-bytes of entropy to use for the dice roll
    @return: an array of integer dice rolls.  The length is floor( len(entropy)/precision )
    """
    constants: Dict[str, int] = ENTROPY_MAP[die]
    entropy_length = len(entropy)

    assert entropy_length >= constants['min_entropy'], "Not enough entropy"

    rolls: [int] = []
    roll: int
    for i in range(entropy_length // precision):
        e = entropy[i * precision : (i + 1) * precision]
        numerator: int = constants['num_scalar'] * MAX_INT[precision] * abs(e.to_int())
        denominator: int = MAX_INT[precision] ** 2
        roll = numerator // denominator + 1
        rolls.append(roll)
    return rolls


def roll_initial_stat_internal() -> int:
    """
    Generates a new initial attribute stat using a roll 4d6 and drop the lowest mechanic. We use a discrete distribution
    to make this computationally cheap.
    @return: Returns an integer representing an initial puppet stat range(3-18)
    """
    entropy: bytes = get_random().to_bytes()[:2]
    return roll_initial_stat_with_entropy_internal(entropy)


def roll_initial_stat_with_entropy_internal(entropy: bytes) -> int:
    """
    Rolls an initial attribute using existing entropy
    @param entropy: 2 bytes of entropy
    @return: an integer representing initial stats
    """
    return INITIAL_STAT_PROBABILITY[entropy.to_int() // 100]
