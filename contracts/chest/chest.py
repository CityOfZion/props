from typing import Any, Dict, cast, List
from boa3.builtin.type import UInt160
from boa3.builtin import CreateNewEvent, NeoMetadata, metadata, public, contract
from boa3.builtin.interop.blockchain import Transaction
from boa3.builtin.interop.runtime import script_container, calling_script_hash, executing_script_hash
from boa3.builtin.interop.contract import call_contract, update_contract
from boa3.builtin.interop.storage import get, put
from boa3.builtin.interop.stdlib import serialize, deserialize


OWNER_KEY = b'!OWNER'
CHEST_KEY = b'c'
RESERVOIR_KEY = b'r'

TOTAL_CHESTS = b'!TOTAL_CHESTS'
RESERVOIR_WRITE_POINTER = b'!RWRITE_POINTER'


@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = "COZ, Inc."
    meta.description = "A public smart contract for holding things"
    meta.email = "contact@coz.io"
    meta.supported_standards = []
    return meta

NewChest = CreateNewEvent(
    [
        ('ChestId', bytes),
    ],
    'NewChest'
)

ChestOpened = CreateNewEvent(
    [
        ('ChestId', bytes),
        ('Contents', [Dict[str, Any]])
    ],
    'ChestOpened'
)

##################
##################
# Loot
##################
##################


class ReservoirItem:
    def __init__(self):
        self._id: bytes = b''
        self._script_hash: UInt160 = ''
        self._type: str = ''
        self._quantity: int = 0
        self._token_id: bytes = b''

    def set_id(self, id: bytes) -> bool:
        self._id = id
        return True

    def set_type(self, type: str) -> bool:
        self._type = type
        return True

    def set_script_hash(self, script_hash: UInt160) -> bool:
        self._script_hash = script_hash
        return True

    def set_quantity(self, quantity: int) -> bool:
        self._quantity = quantity
        return True

    def set_token_id(self, token_id: bytes) -> bool:
        self._token_id = token_id
        return True

    def transfer(self, destination: UInt160) -> Any:
        params: List = []
        if self._type == 'NEP-11':
            params = [destination, self._token_id, []]
        if self._type == 'NEP-17':
            params = [executing_script_hash, destination, self._quantity, []]
        return call_contract(self._script_hash, "transfer", params)

    def format(self) -> Dict[str, Any]:
        return {
            'type': self._type,
            'scriptHash': self._script_hash,
            'tokenId': self._token_id,
            'quantity': self._quantity
        }

def create_reservoir_item(type: str, script_hash: UInt160, quantity: int, token_id: bytes ) -> bytes:
    """
    creates a new chest
    :param author: The author of the chest
    :param name: The name of the chest
    :param chest_type: The type of chest being created
    :return: The chest id
    """
    reservoir_item: ReservoirItem = ReservoirItem()
    reservoir_id: bytes = (reservoir_write_pointer() + 1).to_bytes()
    reservoir_item.set_id(reservoir_id)
    reservoir_item.set_type(type)
    reservoir_item.set_script_hash(script_hash)
    reservoir_item.set_quantity(quantity)
    reservoir_item.set_token_id(token_id)


    key: bytes = mk_reservoir_key(reservoir_id)
    put(key, serialize(reservoir_item))
    put(RESERVOIR_WRITE_POINTER, reservoir_id)
    return reservoir_id


def reservoir_write_pointer() -> int:
    total: bytes = get(RESERVOIR_WRITE_POINTER)
    if len(total) == 0:
        return 0
    return total.to_int()


@public
def create_chest(name: bytes, chest_type: int, eligible_epochs: [int], puppet_traits: [bytes]) -> bytes:
    """
    Creates a new collection
    :param name: The name of the chest
    :param chest_type: The type of chest to create
    :return: The chest id
    """
    tx = cast(Transaction, script_container)
    owner: UInt160 = tx.sender

    traits: Dict[str, str] = {}
    for raw_trait in puppet_traits:
        raw_trait_str: [str] = cast(List[str], raw_trait)
        traits[raw_trait_str[0]] = raw_trait_str[1]

    chest_id: bytes = create_chest_internal(owner, name, chest_type, eligible_epochs, traits)
    NewChest(chest_id)
    return chest_id


@public
def loot_chest_with_puppet(chest_id: bytes, puppet_id: bytes) -> Dict[str, Any]:

    chest: Chest = get_chest(chest_id)

    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    puppet_json: Dict[str, Any] = ContractPuppet.get_puppet_json(puppet_id)
    owner_uint: UInt160 = cast(UInt160, puppet_json['owner'])
    assert owner_uint == signer, "You do not own this puppet"

    assert chest.is_puppet_eligible(puppet_json), "Ineligible Puppet"

    proceeds: ReservoirItem = chest.loot(signer, cast(bytes, puppet_json['tokenId']))

    # return the loot proceeds here
    return proceeds.format()


@public
def loot_chest_as_owner(chest_id: bytes) -> Dict[str, Any]:
    chest: Chest = get_chest(chest_id)
    owner: UInt160 = chest.get_author()

    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    assert signer == owner, "Signer is not the current owner of this chest"

    proceeds: ReservoirItem = chest.loot(signer, owner)

    return proceeds.format()


@public
def is_puppet_eligible(chest_id: bytes, puppet_id: bytes) -> bool:
    chest: Chest = get_chest(chest_id)
    puppet_json: Dict[str, Any] = ContractPuppet.get_puppet_json(puppet_id)
    return chest.is_puppet_eligible(puppet_json)

################################

class Chest:
    """
    Chests:

    The chest type primarily changes the eligibilty settings in this release.
    * Chest type 0: default and allows infinite minting from a chest as long as the looter is eligible
    * Chest type 1: allows a single looting event as long as the looter is eligible

    Chest sampling using a ** reservoir mechanic for efficient non-repeating sampling.
    * When loot is added to the chest, it is given a unique global incremental "reservoir_id" and stored using the
        "reservoir_id" as the key.  The "reservoir_id" is logged as the "reservoir_write_pointer" and always represents
        the max index for the reservoir.
    * The "reservoir_id" is also stored as the value under a separate incrementing "loot_id". New values are always
        appended
    * A "loot_available" value tracks the height of `loot_id` values and is used to determine the new "loot_id" of
        added loot.
    * When loot is added, a new entry for `loot_id` is added and the `loot_available` increases.
    * When loot is removed, the `reservoir_id` at index `loot_available - 1` replaces the `reservoir_id` at the looted
        index and the `loot_available` decreases by 1.
    * This double pointer approach makes sampling cost uniform and cost efficient.
    * The number of lootings is equal to `reservoir_write_pointer` - `loot_available`
    """

    def __init__(self):
        # metadata
        self._id: bytes = b''
        self._author: UInt160 = b''
        self._name: bytes = b''
        self._type: int = 0

        # eligibility
        self._eligible_epochs: [int] = []
        self._puppet_traits: Dict[str, str] = {}

        # looting
        self._loot_available: int = 0

    def get_id(self) -> bytes:
        return self._id

    def get_author(self) -> UInt160:
        return self._author

    def get_type(self) -> int:
        return self._type

    def get_loot_available(self) -> int:
        total: bytes = get(mk_chest_key(self._id) + b'la')
        if len(total) == 0:
            return 0
        total_int: int = total.to_int()
        self._loot_available = total_int
        return total_int

    def set_loot_available(self, amount: int) -> bool:
        self._loot_available = amount
        put(mk_chest_key(self._id) + b'la', amount)
        return True

    def get_loot_key(self, loot_id: bytes) -> bytes:
        return mk_chest_key(self._id) + b'l' + loot_id

    def get_reservoir_id_from_loot_id(self, loot_id: bytes) -> bytes:
        loot_id_key: bytes = self.get_looter_key(loot_id)
        return get(loot_id_key)

    def set_loot_id(self, loot_id: bytes, reservoir_id: bytes) -> bool:
        loot_id_key: bytes = self.get_looter_key(loot_id)
        put(loot_id_key, reservoir_id)
        return True

    def get_reservoir_value_from_loot_id(self, loot_id: bytes) -> ReservoirItem:
        reservoir_id: bytes = self.get_reservoir_id_from_loot_id(loot_id)
        reservoir_value_bytes: bytes = get(mk_reservoir_key(reservoir_id))

        reservoir_item: ReservoirItem = cast(ReservoirItem, deserialize(reservoir_value_bytes))
        return reservoir_item

    def get_looter_key(self, looter_id: bytes) -> bytes:
        return mk_chest_key(self._id) + b'L' + looter_id

    def get_looter_yield(self, looter_id: bytes) -> int:
        key: bytes = self.get_looter_key(looter_id)
        yield_bytes: bytes = get(key)
        if len(yield_bytes) == 0:
            return 0
        return yield_bytes.to_int()

    def set_looter_yield(self, looter_id: bytes, amount: int) -> bool:
        key: bytes = self.get_looter_key(looter_id)
        put(key, amount.to_bytes())
        return True

    def set_author(self, author: UInt160) -> bool:
        self._author = author
        return True

    def set_id(self, chest_id: bytes) -> bool:
        self._id = chest_id
        return True

    def set_eligible_epochs(self, eligible_epochs: [int]) -> bool:
        self._eligible_epochs = eligible_epochs
        return True

    def set_puppet_traits(self, puppet_traits: Dict[str, str]) -> bool:
        self._puppet_traits = puppet_traits
        return True

    def set_name(self, name: bytes) -> bool:
        self._name = name
        return True

    def set_type(self, chest_type: int) -> bool:
        self._type = chest_type
        return True

    def export(self) -> Dict[str, Any]:
        exported = {
            'id': self._id,
            'author': self._author,
            'name': self._name,
            'type': self._type,
            'eligible_epochs': self._eligible_epochs,
            'puppet_traits': self._puppet_traits,
            'loot_available': self._loot_available
        }
        return exported

    def loot(self, destination: UInt160, looter_id: bytes) -> ReservoirItem:
        assert self._loot_available > 0
        loot_id: int = ContractDice.rand_between(0, self._loot_available - 1)
        loot_id_bytes: bytes = loot_id.to_bytes()

        chest_loot: ReservoirItem = self.get_reservoir_value_from_loot_id(loot_id_bytes)

        ChestOpened(self._id)

        # replace the sampled loot_id pointer with the last loot_id pointer to defrag the storage
        last_reservoir_id: bytes = self.get_reservoir_id_from_loot_id((self._loot_available - 1).to_bytes())
        self.set_loot_id(loot_id.to_bytes(), last_reservoir_id)

        # decrement loot available write pointer
        self.set_loot_available(self._loot_available - 1)

        # update looter yield
        yield_amount: int = self.get_looter_yield(looter_id)
        self.set_looter_yield(looter_id, yield_amount + 1)
        x: bool = chest_loot.transfer(destination)
        return chest_loot

    def is_puppet_eligible(self, puppet: Dict[str, Any]) -> bool:

        epoch: int = cast(int, puppet['epochId'])

        # verify the puppet epoch is eligible
        if epoch not in self._eligible_epochs:
            return False

        traits: Dict[str, Any] = cast(Dict[str, Any], puppet['traits'])

        # check all the trait requirements for the chest
        # this currently only supports a byte match for the entire trait field
        for challenge_key in self._puppet_traits.keys():
            if self._puppet_traits[challenge_key] != traits[challenge_key]:
                return False

        # type 0 only allows a single loot per puppet
        if self._type == 0:
            looter_id: bytes = cast(bytes, puppet['tokenId'])
            looter_yield: int = self.get_looter_yield(looter_id)
            if looter_yield != 0:
                return False

        return True

    def fill_chest(self, reservoir_id: bytes) -> bool:
        loot_available: int = self._loot_available
        self.set_loot_available(loot_available + 1)
        self.set_loot_id(loot_available.to_bytes(), reservoir_id)
        return True


def create_chest_internal(author: UInt160, name: bytes, chest_type: int, eligible_epochs: [int], puppet_traits: Dict[str, str]) -> bytes:
    """
    creates a new chest
    :param author: The author of the chest
    :param name: The name of the chest
    :param chest_type: The type of chest being created
    :return: The chest id
    """
    chest: Chest = Chest()
    chest_id: bytes = (total_chests() + 1).to_bytes()
    chest.set_id(chest_id)
    chest.set_author(author)
    chest.set_name(name)
    chest.set_type(chest_type)
    chest.set_eligible_epochs(eligible_epochs)
    chest.set_puppet_traits(puppet_traits)

    key: bytes = mk_chest_key(chest_id)
    put(key, serialize(chest))
    put(TOTAL_CHESTS, chest_id)
    return chest_id


@public
def get_chest_json(chest_id: bytes) -> Dict[str, Any]:
    """
    Gets a JSON formatted collection
    :param chest_id: The chest_id being requested
    :return: A dictionary representing the collection
    """
    chest: Chest = get_chest(chest_id)
    return chest.export()


@public
def get_chest(chest_id: bytes) -> Chest:
    """
    Gets a Collection instance
    :param chest_id: The chest_id being requested
    :return: A Collection class instance
    """
    chest_bytes: bytes = get_chest_raw(chest_id)
    chest: Chest = cast(Chest, deserialize(chest_bytes))
    x: int = chest.get_loot_available()
    return chest


@public
def get_chest_raw(chest_id: bytes) -> bytes:
    """
    Gets the raw bytes of a collection
    :param chest_id: The chest_id being requested
    :return: The serialized Collection class instance
    """
    key: bytes = mk_chest_key(chest_id)
    return get(key)


@public
def total_chests() -> int:
    """
    Gets the total collections
    :return: An integer representation of the total collections
    """
    total: bytes = get(TOTAL_CHESTS)
    if len(total) == 0:
        return 0
    return total.to_int()


def mk_chest_key(chest_id: bytes) -> bytes:
    return CHEST_KEY + chest_id


def mk_reservoir_key(reservoir_id: bytes) -> bytes:
    return RESERVOIR_KEY + reservoir_id


###############################


@public
def onNEP11Payment(from_address: UInt160, amount: int, token_id: bytes, data: Any):
    """
    :param from_address: the address of the one who is trying to send cryptocurrency to this smart contract
    :type from_address: UInt160
    :param amount: the amount of cryptocurrency that is being sent to the this smart contract
    :type amount: int
    :param token_id: the token hash as bytes
    :type token_id: bytes
    :param data: any pertinent data that might validate the transaction
    :type data: Any
    """

    '''
    Data: [
        chest_id
    ]
    '''

    data_payload: [bytes] = cast(List[bytes], data)
    chest: Chest = get_chest(data_payload[0])
    author: UInt160 = chest.get_author()

    assert from_address == author, "You don't have the right."

    # add to reservoir
    reservoir_id = create_reservoir_item('NEP-11', calling_script_hash, amount, token_id)
    # add to chest
    chest.fill_chest(reservoir_id)


@public
def onNEP17Payment(from_address: UInt160, amount: int, data: Any):
    """
    :param from_address: the address of the one who is trying to send cryptocurrency to this smart contract
    :type from_address: UInt160
    :param amount: the amount of cryptocurrency that is being sent to the this smart contract
    :type amount: int
    :param data: any pertinent data that might validate the transaction
    :type data: Any
    """

    """
    data = [
        chest_id,
        amount_per_reservoir_item
    ]
    """
    data_payload: [bytes] = cast(List[bytes], data)
    chest: Chest = get_chest(data_payload[0])
    author: UInt160 = chest.get_author()
    assert from_address == author, "You don't have the right."

    amount_per_reservoir_item: int = cast(int, data_payload[1])
    assert amount >= amount_per_reservoir_item, "transfer amount is less than the amount_per_reservoir_item"


    # fill the chests with the tokens
    while amount >= amount_per_reservoir_item:
        reservoir_id: bytes = create_reservoir_item('NEP-17', calling_script_hash, amount_per_reservoir_item, b'')
        chest.fill_chest(reservoir_id)
        amount = amount - amount_per_reservoir_item
    if amount != 0:
        reservoir_id: bytes = create_reservoir_item('NEP-17', calling_script_hash, amount, b'')
        chest.fill_chest(reservoir_id)


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


@contract('0x4380f2c1de98bb267d3ea821897ec571a04fe3e0')
class ContractDice:

    @staticmethod
    def rand_between(start: int, end: int) -> int:
        pass


@contract('0x76a8f8a7a901b29a33013b469949f4b08db15756')
class ContractPuppet:

    @staticmethod
    def get_puppet_json(token_id: bytes) -> Dict[str, Any]:
        pass
