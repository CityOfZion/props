from ..util import dice, constants

# TODO: Proficiency Bonus

class Character:
    _charisma = 0
    _constitution = 0
    _dexterity = 0
    _intelligence = 0
    _strength = 0
    _wisdom = 0
    _experience = 0
    _level = 0 # TODO: remove this and replace it with an experience map
    _hit_die = "d4"
    _total_hit_points = 0


    def generate(self):

        # generate base attributes
        self._charisma = dice.roll_initial_stat()
        self._constitution = dice.roll_initial_stat()
        self._dexterity = dice.roll_initial_stat()
        self._intelligence = dice.roll_initial_stat()
        self._strength = dice.roll_initial_stat()
        self._wisdom = dice.roll_initial_stat()

        # generate hit die and total HP
        self._level = 1
        self._hit_die = [
            "d6", "d8", "d10", "d12"
        ][dice.roll_die("d4") - 1]

        self._total_hit_points = dice.roll_dice(1, self._hit_die, constants.ATTRIBUTE_MODIFIERS[self._constitution])

    def get_armor_class(self) -> int:
        return 10 + constants.ATTRIBUTE_MODIFIERS[self.get_dexterity()]

    def get_attack_modifier(self, attribute: str, proficient: bool):
        # consider other approaches to make this more efficient
        attributes = {
            "charisma": self._charisma,
            "constitution": self._constitution,
            "dexterity": self._dexterity,
            "intelligence": self._intelligence,
            "strength": self._strength,
            "wisdom": self._wisdom
        }
        proficiency: int = self.get_proficiency_bonus() if proficient else 0

        return attributes[attribute] + proficiency

    def get_charisma(self) -> int:
        return self._charisma

    def get_constitution(self) -> int:
        return self._constitution

    def get_dexterity(self) -> int:
        return self._dexterity

    def get_intelligence(self) -> int:
        return self._intelligence

    def get_strength(self) -> int:
        return self._strength

    def get_total_hit_points(self) -> int:
        return self._total_hit_points

    def get_wisdom(self) -> int:
        return self._wisdom

    def get_proficiency_bonus(self) -> int:
        return (self._level - 1) // 4 + 2



