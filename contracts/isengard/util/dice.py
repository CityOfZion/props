from boa3.builtin.interop.runtime import get_random

# The demoninator for a random random 1 byte dice roll. 1000 * randomNumber / DICE[x]
DICE: dict[str, int] = {
    'd4': 64000,
    'd6': 42667,
    'd8': 32000,
    'd10': 25600,
    'd12': 21333,
    'd20': 12800,
    'd100': 2560
}


def roll_die(die: str) -> int:
    """
    Rolls a requested die and returns the result.
    :param die: a string indicating the die format in "dX" format (i.e d10)
    :return: The integer result of the roll.
    """
    seed:bytes = get_random().to_bytes()[0]
    roll: int = (1000 * seed.to_int() // DICE[die]) + 1
    return roll


def roll_dice(count: int, die: str, modifier: int) -> int:
    """
    Makes a dice roll analogous to standard game format "xdy + z" (example: 3d20 + 4)
    :param count: The number of dice to roll.
    :param die: The type of dice to roll in dX format.
    :param modifier: A roll modifier which is added after all dice have been rolled.
    :return: The result of the roll.
    """
    roll = 0
    for i in range(count):
        roll += roll_die(die)
    return roll + modifier


def roll_initial_stat() -> int:
    """
    Generates a new initial attribute stat using a roll 4d6 and drop the lowest mechanic.
    :return:
    """
    rolls: [int] = []
    for i in range(4):
        rolls.append(roll_die("d6"))
    min_value = min(rolls)
    rolls.remove(min_value)
    return sum(rolls)