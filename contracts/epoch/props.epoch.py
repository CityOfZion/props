from typing import Any, Dict, List, cast, Optional
from boa3.builtin import contract, NeoMetadata, metadata, public, CreateNewEvent
from boa3.builtin.interop.stdlib import serialize, deserialize, itoa
from boa3.builtin.interop.storage import delete, get, put, find, get_context
from boa3.builtin.interop.runtime import get_random, script_container, calling_script_hash
from boa3.builtin.type import UInt160
from boa3.builtin.interop.blockchain import Transaction

# DEBUG_START
# -------------------------------------------
# DEBUG
# -------------------------------------------

debug = CreateNewEvent(
    [
        ('params', list),
    ],
    'Debug'
)


# DEBUG_END

#############EPOCH#########################
#############EPOCH#########################
#############EPOCH#########################


@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = "COZ, Inc."
    meta.description = "A public smart contract for handling probabilistic events"
    meta.email = "contact@coz.io"
    meta.supported_standards = []
    meta.permissions = [{"contract": "*", "methods": "*"}]
    return meta


EPOCH_KEY = b'e'
TRAIT_KEY = b't'
TOTAL_EPOCHS = b'!TOTAL_EPOCHS'


@public
def total_epochs() -> int:
    """
    Gets the total epoch count
    :return: An integer representing the total epoch count
    """
    total: bytes = get(TOTAL_EPOCHS)
    if len(total) == 0:
        return 0
    return total.to_int()


@public
def create_epoch(label: bytes, whitelist: [UInt160]) -> int:
    """
    Creates a new epoch
    :param label: A byte formatted string defining the epoch
    :param traits: A compressed epoch object
    :param whitelist: a list of callers that can use the epoch with state
    :return: An integer representing the epoch_id
    """
    tx = cast(Transaction, script_container)
    author: UInt160 = tx.sender

    new_epoch: Epoch = Epoch()
    x: bool = new_epoch.load(label, author, whitelist)
    epoch_id: bytes = new_epoch.get_id()
    epoch_id_int: int = epoch_id.to_int()
    save_epoch(new_epoch)
    put(TOTAL_EPOCHS, epoch_id)
    return epoch_id_int

@public
def create_trait(epoch_id: bytes, label: bytes, slots: int, trait_levels: List) -> bytes:
    """
    Binds a new trait to an epoch
    :param epoch_id: the epoch_id to bind the trait to
    :param label: the trait's label
    :param slots: the maximum number of events that can mint on this trait
    :param trait_levels: a list of the trait levels
    :return: the trait_id
    """
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    epoch: Epoch = get_epoch(epoch_id)

    author: UInt160 = epoch.get_author()
    assert signer == author, "Transaction signer is not the epoch author"

    epoch_traits: [bytes] = epoch.get_traits()
    trait_length: int = len(epoch_traits)
    trait_id: bytes = epoch.get_id() + b'_' + trait_length.to_bytes()
    new_trait: Trait = Trait(trait_id, label, slots, trait_levels)
    save_trait(new_trait)

    # update the epoch
    x = epoch.append_trait(trait_id)
    save_epoch(epoch)

    return trait_id


class CollectionPointerEvent:
    def __init__(self, collection_id: int, idx: int):
        self.collection_id: int = collection_id
        self.idx: int = idx

    def export(self) -> Dict[str, int]:
        exported: Dict[str, int] = {
            "collection_id": self.collection_id,
            "index": self.idx
        }
        return exported

    def get_value(self) -> bytes:
        cid: int = self.collection_id
        value: bytes = Collection.get_collection_element(cid.to_bytes(), self.idx)
        return value


class EventInterface:
    def __init__(self, event_type: int, args: List):
        self._event_type = event_type
        if event_type == 0:
            collection_id: int = cast(int, args[0])
            idx: int = cast(int, args[1])
            self._event = CollectionPointerEvent(collection_id, idx)

    def export(self) -> Dict[str, Any]:
        args: Dict[str, Any] = self._event.export()
        exported: Dict[str, Any] = {
            'type': self._event_type,
            'args': args
        }
        return exported

    def get_value(self) -> bytes:
        if self._event_type == 0:
            event: CollectionPointerEvent = cast(CollectionPointerEvent, self._event)
            return event.get_value()

        raise Exception("Invalid Event Type")
        return b''


class TraitLevel:

    def __init__(self, drop_score: bytes, unique: bool, events: List):
        self._drop_score: int = drop_score.to_int()
        self._unique: bool = unique

        traits: [EventInterface] = []
        for event in events:
            event_list: List = cast(List, event)
            event_type: int = cast(int, event_list[0])
            event_args: List = cast(List, event_list[1])
            new_event: EventInterface = EventInterface(event_type, event_args)
            traits.append(new_event)
        self._traits: [EventInterface] = traits

    def dropped(self, roll: int, unique_drops: bool) -> bool:
        if self._unique and not unique_drops:
            return False
        dropped: bool = roll < self._drop_score
        return dropped

    def export(self) -> Dict[str, Any]:
        traits: List[Dict] = []
        for trait in self._traits:
            trait_json: Dict[str, Any] = trait.export()
            traits.append(trait_json)

        exported: Dict[str, Any] = {
            "drop_score": self._drop_score,
            "unique": self._unique,
            "traits": traits
        }
        return exported

    def can_mint(self) -> bool:
        available_traits: int = len(self._traits)
        return available_traits > 0

    def mint(self, entropy: bytes) -> bytes:
        max_index: int = len(self._traits)
        entropy_int: int = entropy.to_int()
        idx: int = (max_index * entropy_int) // 256
        trait: EventInterface = self._traits[idx]
        return trait.get_value()


class Trait:
    def __init__(self, trait_id: bytes, label: bytes, slots: int, trait_levels: List):
        self._label: bytes = label
        self._id: bytes = trait_id
        self._slots: int = slots

        new_trait_levels: [TraitLevel] = []
        for trait_level in trait_levels:
            trait_list: List = cast(List, trait_level)
            drop_score: bytes = cast(bytes, trait_list[0])
            unique: bool = cast(bool, trait_list[1])
            traits: List = cast(List, trait_list[2])
            t: TraitLevel = TraitLevel(drop_score, unique, traits)
            new_trait_levels.append(t)

        self._trait_levels: [TraitLevel] = new_trait_levels

    def get_label(self) -> bytes:
        return self._label

    def get_slots(self) -> int:
        return self._slots

    def mint(self) -> [bytes]:
        slot_entropy = get_random().to_bytes()
        trait_levels: [TraitLevel] = self._trait_levels
        slots: int = self._slots

        traits: [bytes] = []
        for i in range(slots):
            roll: int = Dice.rand_between(0, 9999)
            for trait_level in trait_levels:
                if trait_level.dropped(roll, True): #update this for actual unique support
                    if trait_level.can_mint():
                        new_trait: bytes = trait_level.mint(slot_entropy[i].to_bytes())
                        traits.append(new_trait)
                    break
        return traits

    def export(self) -> Dict[str, Any]:

        trait_levels: List[Dict] = []
        for trait_level in self._trait_levels:
            level_json: Dict[str, Any] = trait_level.export()
            trait_levels.append(level_json)

        exported: Dict[str, Any] = {
            'label': self._label,
            'slots': self._slots,
            'traitLevels': trait_levels
        }
        return exported

    def get_id(self) -> bytes:
        return self._id


class Epoch:
    def __init__(self):
        self._label: bytes = b''
        self._traits: [bytes] = []
        self._id: bytes = (total_epochs() + 1).to_bytes()
        self._author: UInt160 = b''
        self._whitelist: [UInt160] = []

    def export(self) -> Dict[str, Any]:

        traits: List[Dict] = []
        for trait_id in self._traits:
            trait: Trait = get_trait(trait_id)
            trait_json: Dict[str, Any] = trait.export()
            traits.append(trait_json)

        exported: Dict[str, Any] = {
            "id": self._id,
            "author": self._author,
            "label": self._label,
            "traits": traits,
            "whitelist": self._whitelist
        }
        return exported

    def load(self, label: bytes, author: UInt160, whitelist: [UInt160]) -> bool:
        self._label = label
        self._author = author
        self._whitelist = whitelist
        return True

    def get_author(self) -> UInt160:
        return self._author

    def get_whitelist(self) -> [UInt160]:
        return self._whitelist

    def get_label(self) -> bytes:
        return self._label

    def get_id(self) -> bytes:
        return self._id

    def get_traits(self) -> List[bytes]:
        return self._traits

    def append_trait(self, trait_id: bytes) -> bool:
        trait_list: [bytes] = self._traits
        trait_list.append(trait_id)
        self._traits = trait_list
        return True

    def mint_traits(self) -> Dict[str, Any]:
        traits: Dict[str, Any] = {}

        trait_objects: [bytes] = self._traits
        for trait_id in trait_objects:
            trait_object: Trait = get_trait(trait_id)
            label_bytes: bytes = trait_object.get_label() #this is a cast and may be breaking
            label: str = label_bytes.to_str()

            trait: [bytes] = trait_object.mint()
            traits_count: int = len(trait)
            if traits_count > 1 or trait_object.get_slots() > 1:
                traits[label] = trait
            if traits_count == 1:
                traits[label] = trait[0]
        return traits


@public
def get_epoch_json(epoch_id: bytes) -> Dict[str, Any]:
    """
    Gets the JSON formatted representation of an epoch
    :param epoch_id: the byte formatted epoch_id
    :return: A dictionary representation of an epoch
    """
    epoch: Epoch = get_epoch(epoch_id)
    return epoch.export()


@public
def get_epoch(epoch_id: bytes) -> Epoch:
    """
    Gets an Epoch class instance
    :param epoch_id: the byte formatted epoch_id
    :return: An epoch class instance
    """
    epoch_bytes: bytes = get_epoch_raw(epoch_id)
    return cast(Epoch, deserialize(epoch_bytes))


@public
def mint_from_epoch(epoch_id: bytes) -> Dict[str, Any]:
    """
    Mints events from an epoch object and returns the responses of the events.
    :param epoch_id: The epoch_id to mint from
    :return: A dictionary containing the responses of the triggered events
    """
    epoch: Epoch = get_epoch(epoch_id)
    result: Dict[str, Any] = epoch.mint_traits()
    return result


@public
def mint_from_epoch_with_state(epoch_id: bytes) -> Dict[str, Any]:
    """
    This method behaves similarly to mint_from_epoch, but accepts a scope (instance_id) to handle stateful events
    :param epoch_id: The epoch_id to mint from
    :param instance_id: The instance_id to use when minting
    :return: A dictionary containing the responses of the triggered events
    """
    epoch: Epoch = get_epoch(epoch_id)
    whiteList: [UInt160] = epoch.get_whitelist()
    caller: UInt160 = cast(UInt160, calling_script_hash)
    debug([caller, whiteList, caller in whiteList])
    assert calling_script_hash in whiteList, "contract caller is not in this epoch's whitelist, use mint_from_epoch"

    result: Dict[str, Any] = epoch.mint_traits()
    return result


def get_epoch_raw(epoch_id: bytes) -> bytes:
    """
    Gets a serialized epoch
    :param epoch_id: the byte formatted pointer to the epoch
    :return: a serialized epoch
    """
    return get(mk_epoch_key(epoch_id))


def save_epoch(epoch: Epoch) -> bool:
    epoch_id: bytes = epoch.get_id()
    put(mk_epoch_key(epoch_id), serialize(epoch))
    return True


def save_trait(trait: Trait) -> bool:
    trait_id: bytes = trait.get_id()
    put(mk_trait_key(trait_id), serialize(trait))
    return True


def get_trait(trait_id: bytes) -> Trait:
    trait_bytes: bytes = get_trait_raw(trait_id)
    return cast(Trait, deserialize(trait_bytes))


def get_trait_raw(trait_id: bytes) -> bytes:
    return get(mk_trait_key(trait_id))


def mk_epoch_key(epoch_id: bytes) -> bytes:
    return EPOCH_KEY + epoch_id


def mk_trait_key(trait_id: bytes) -> bytes:
    return TRAIT_KEY + trait_id


@contract('0xa80d045ca80e0421aa855c3a000bfbe5dddadced')
class Collection:

    @staticmethod
    def map_bytes_onto_collection(collection_id: bytes, entropy: bytes) -> bytes:
        pass

    @staticmethod
    def sample_from_collection(collection_id: int) -> bytes:
        pass

    @staticmethod
    def get_collection_element(collection_id: bytes, index: int) -> bytes:
        pass


@contract('0x68021f61e872098627da52dc82ca793575c83826')
class Dice:

    @staticmethod
    def rand_between(start: int, end: int) -> int:
        pass

    @staticmethod
    def map_bytes_onto_range(start: int, end: int, entropy: bytes) -> int:
        pass

