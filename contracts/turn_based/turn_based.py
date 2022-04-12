from typing import Dict, List
from boa3.builtin import NeoMetadata, metadata, public, contract, CreateNewEvent
from boa3.builtin.type import UInt160
from boa3.builtin.interop.blockchain import Transaction
from boa3.builtin.interop.contract import update_contract
from boa3.builtin.interop.runtime import script_container
from boa3.builtin.interop.stdlib import serialize, deserialize
from boa3.builtin.interop.storage import get, put
from typing import Any, cast

OWNER_KEY = b'OWNER'
TOTAL_GAMES = b'TOTAL_GAMES'
PENDING_GAME = b'PENDING_GAME'

ELEMENTS = ['water', 'fire', 'earth', 'wind']
ELEMENTAL_EFFECTIVENESS = [
    [10,    20,    5,     10],
    [5,     10,    20,    10],
    [20,    5,     10,    10],
    [10,    10,    10,    10]
]

COLORS_ELEMENT_MAP = {
    'blue':       'water',
    'teal':       'water',
    'purple':     'water',

    'red':        'fire',
    'yellow':     'fire',
    'orange':     'fire',
    'black':      'fire',

    'green':      'earth',
    'brown':      'earth',
    'beige':      'earth',
    'grey':       'earth',

    'ghost':      'wind',
    'obsidian':   'wind',
    'opalescent': 'wind',
    'white':      'wind'
}

ATTRIBUTES = ['strength', 'constitution', 'dexterity', 'intelligence', 'wisdom', 'charisma']
ATTRIBUTE_EFFECTIVENESS = [
    [10,   5,    10,   10,   10,   20],
    [20,   10,   5,    10,   10,   10],
    [10,   20,   10,   5,    10,   10],
    [10,   10,   20,   10,   5,    10],
    [10,   10,   10,   20,   10,   5],
    [5,    10,   10,   10,   20,   10],
]

PLAYERS_PER_GAME: int = 2
ENEMY_HP_COLLECTION_ID: int = 7
ENEMY_GENERATOR_INSTANCE_ID: bytes = (2).to_bytes()
ENEMY_GENERATOR_CODE: bytes = (1).to_bytes()

@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = "COZ, Inc."
    meta.description = "A turn-based multi-player demo prop"
    meta.email = "contact@coz.io"
    meta.supported_standards = []
    return meta


debug = CreateNewEvent(
    [
        ('debug', Any),
    ],
    'debug'
)

on_game_begin = CreateNewEvent(
    [
        ('game_id', int),
    ],
    'NewGame'
)

on_monster_vanquished = CreateNewEvent(
    [
        ('token_id', bytes),
        ('monster_id', int),
    ],
    'MonsterVanquished'
)

"""
The Monster
"""


class Monster:
    def __init__(self, id: bytes):
        #Simplification of one monster per "game"
        self._id: bytes = id

        attributes: Dict[str, Any] = {
            'element': 'fire',
            'attribute': 'wood'
        }

        '''
        attributes: Dict[str, Any] = ContractGenerator.mint_from_instance(ENEMY_GENERATOR_CODE,
                                                                          ENEMY_GENERATOR_INSTANCE_ID)
        '''
        self._element: str = attributes['element']
        self._attribute: str = attributes['attribute']

        hit_points_list: [bytes] = ContractCollection.sample_from_collection(ENEMY_HP_COLLECTION_ID, 1)
        self._hit_points: int = hit_points_list[0].to_int()

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            'id': self._id,
            'traits': {
                'element': self._element,
                'attribute': self._attribute
            }
        }
        return exported

    def get_attribute(self) -> str:
        return self._attribute

    def get_element(self) -> str:
        return self._element

    def take_damage(self, amount: int) -> bool:
        if amount >= self._hit_points:
            self._hit_points = 0
            return True
        self._hit_points -= amount
        return False

    def get_id(self) -> bytes:
        return self._id


def save_monster(monster: Monster) -> bool:
    monster_id: bytes = monster.get_id()
    put(b'm' + monster_id, serialize(monster))
    return True


@public
def load_monster(monster_id: bytes) -> Monster:
    monster_bytes: bytes = get(b'm' + monster_id)
    return cast(Monster, deserialize(monster_bytes))


"""
The Game
1. Users will join the game with a puppet.
2. When the game is full of users, the game will instantiate a new "enemy" from a generator created for the game.
    * Enemy traits (primary attribute and element) will come from a generator
    * Enemy HP will come from a collection
    (These could all come from the same place, but we want to show some options)
    
3. The game ends when the enemy's HP drops to 0; the game can also be ended by either player after X time has elapsed
4. Damage, kills, and games played are tracked for all puppets who participate
"""

class Game:
    def __init__(self):
        self._id: bytes = (total_games() + 1).to_bytes()
        self._players: [bytes] = []
        self._exhausted_players: [bytes] = []
        self._completed: bool = False

    def add_player(self, token_id: bytes) -> bool:
        assert not self.is_player(token_id), "players must be unique"
        self._players.append(token_id)

        if len(self._players) == PLAYERS_PER_GAME:
            # if the game is full, start it
            self.begin_game()

        return True

    def begin_game(self) -> bool:

        #generate and save the game monster
        monster: Monster = Monster(self._id)
        save_monster(monster)

        #send notification of game start
        id_bytes: bytes = self._id
        on_game_begin(id_bytes.to_int())
        return True

    def exhaust_player(self, token_id: bytes) -> bool:
        if len(self._exhausted_players) == PLAYERS_PER_GAME - 1:
            self._exhausted_players = []
            return True
        self._exhausted_players.append(token_id)
        return True

    def export(self) -> Dict[str, Any]:
        monster: Monster = load_monster(self._id)

        exported: Dict[str, Any] = {
            'id': self._id,
            'players': self._players,
            'exhaustedPlayers': self._exhausted_players,
            'completed': self._completed,
            'monster': monster.export()
        }
        return exported

    def get_id(self) -> bytes:
        return self._id

    def get_finished(self) -> bool:
        return self._completed

    def is_recruiting(self) -> bool:
        return len(self._players) < PLAYERS_PER_GAME

    def is_player(self, token_id: bytes) -> bool:
        for player in self._players:
            if player == token_id:
                return True
        return False

    def player_has_action(self, token_id: bytes) -> bool:
        for exhausted_player in self._exhausted_players:
            if exhausted_player == token_id:
                return False
        return True

    def set_finished(self, finished: bool):
        self._completed = finished


def save_game(game: Game) -> bool:
    game_id: bytes = game.get_id()
    put(b'g' + game_id, serialize(game))
    return True


@public
def load_game(game_id: bytes) -> Game:
    game_bytes: bytes = get(b'g' + game_id)
    return cast(Game, deserialize(game_bytes))


@public
def total_games() -> int:
    total: bytes = get(TOTAL_GAMES)
    if len(total) == 0:
        return 0
    return total.to_int()


@public
def get_game_json(game_id: bytes) -> Dict[str, Any]:
    game: Game = load_game(game_id)
    return game.export()

"""
Joining a game

1. Users will have the ability to join a game instance.
2. If a game is missing players, a user will be automatically added to that game instance
3. If a game with missing players does not exist, the user will be added to a new game instance
"""


@public
def join_game(token_id: bytes) -> bytes:

    # get the puppet and verify the signer is the owner
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    puppet_json: Dict[str, Any] = ContractPuppet.get_puppet_json(token_id)
    owner_uint: UInt160 = cast(UInt160, puppet_json['owner'])
    assert owner_uint == signer

    # verify that the pending game has a slot, create a new game if it doesnt and set it as active
    pending_game_id: bytes = get(PENDING_GAME)

    game_is_recruiting: bool = False
    if len(pending_game_id) != 0:
        the_game: Game = load_game(pending_game_id)
        game_is_recruiting: bool = the_game.is_recruiting()

    if len(pending_game_id) > 0 and game_is_recruiting:
        the_game.add_player(token_id)
    else:
        the_game = Game()
        the_game.add_player(token_id)
        the_game_id = the_game.get_id()
        put(PENDING_GAME, the_game_id)
        put(TOTAL_GAMES, the_game_id)
    save_game(the_game)
    return the_game.get_id()


"""
Battling
"""

@public
def fight(game_id: bytes, token_id: bytes, attribute: bytes) -> bool:
    # verify that the game is active
    game: Game = load_game(game_id)
    assert not game.get_finished(), "This game has ended."

    # get the puppet and verify the signer is the owner
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    puppet_json: Dict[str, Any] = ContractPuppet.get_puppet_json(token_id)
    owner_uint: UInt160 = cast(UInt160, puppet_json['owner'])
    assert owner_uint == signer

    # verify that the user is in this game
    assert game.is_player(token_id), "You dont have the right."

    # verify that the token is not exhausted
    assert game.player_has_action(token_id), "You are exhausted and need a break."

    monster: Monster = load_monster(game_id)

    # calculate damage
    player_traits: Dict[str, str] = cast(Dict[str,str], puppet_json['traits'])
    player_attributes: Dict[str, int] = cast(Dict[str, int], puppet_json['attributes'])
    player_color: str = player_traits['color']

    player_element: str = COLORS_ELEMENT_MAP[player_color]
    player_attribute: int = player_attributes[attribute.to_str()]

    monster_element: str = monster.get_element()
    monster_attribute: str = monster.get_attribute()

    element_scalar: int = ELEMENTAL_EFFECTIVENESS[ELEMENTS.index(player_element)][ELEMENTS.index(monster_element)]
    attribute_scalar: int = ATTRIBUTE_EFFECTIVENESS[ATTRIBUTES.index(attribute.to_str())][ATTRIBUTES.index(monster_attribute)]

    base_damage: int = ContractDice.rand_between(1, player_attribute)
    damage: int = element_scalar * attribute_scalar * base_damage // 100

    # monster take damage
    is_monster_dead: bool = monster.take_damage(damage)
    game.set_finished(is_monster_dead)

    # player exhaust
    game.exhaust_player(token_id)

    # save
    save_game(game)
    save_monster(monster)

    if is_monster_dead:
        on_monster_vanquished(token_id, monster.get_id().to_int())
    return True


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


@contract('0xacf2aa5d0899e860eebd8b8a5454aa3017543848')
class ContractCollection:

    @staticmethod
    def sample_from_collection(collection_id: int, samples: int) -> List[bytes]:
        pass


@contract("0xfefe63f07478394fbe514fda386ad8c7e2a485a0")
class ContractPuppet:

    @staticmethod
    def get_puppet_json(token_id: bytes) -> Dict[str, Any]:
        pass


@contract("0x16d6a0be0506b26e0826dd352724cda0defa7131")
class ContractDice:

    @staticmethod
    def rand_between(start: int, end: int) -> int:
        pass


@contract('0xa3e59ddc61b2d8ac42c519cee5ddaac83c7df276')
class ContractGenerator:

    @staticmethod
    def mint_from_instance(from_code: bytes, to_instance_id: bytes) -> Dict[str, Any]:
        pass
