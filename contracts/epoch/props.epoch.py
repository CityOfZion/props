from typing import Any, Dict, List, cast
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
EPOCH_INSTANCE_KEY = b'i'
TRAIT_KEY = b't'
TOTAL_EPOCHS = b'!TOTAL_EPOCHS'
TOTAL_EPOCH_INSTANCES = b'!TOTAL_EPOCH_INSTANCES'

#######################################
##########EPOCH Instance###############
#######################################


class EpochInstance:
    def __init__(self, epoch_id: bytes, author: UInt160):
        self._epoch_id: bytes = epoch_id
        self._instance_id: bytes = (total_epoch_instances() + 1).to_bytes()
        self._author: UInt160 = author
        self._authorized_users: [UInt160] = [author]
        self._storage_keys = []

    def get_id(self) -> bytes:
        return self._instance_id

    def get_author(self) -> UInt160:
        return self._author

    def get_epoch_id(self) -> bytes:
        return self._epoch_id

    def get_scoped_storage(self, storage_key: bytes) -> Dict[str, Any]:
        instance_key: bytes = mk_epoch_instance_key(self._instance_id)
        key: bytes = append_key_stack(instance_key, storage_key)
        raw_payload: bytes = get(key)
        if len(raw_payload) == 0:
            return {}
        return cast(Dict[str, Any], deserialize(raw_payload))

    def set_scoped_storage(self, storage_key: bytes, payload: Dict[str, Any]) -> bool:
        instance_key: bytes = mk_epoch_instance_key(self._instance_id)
        key: bytes = append_key_stack(instance_key, storage_key)
        serialized_payload: bytes = serialize(payload)
        put(key, serialized_payload)
        return True

    def is_authorized(self, user: UInt160) -> bool:
        return user in self._authorized_users

    def set_authorized_users(self, authorized_users: [UInt160]):
        self._authorized_users = authorized_users

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            "epochId": self._epoch_id,
            "instanceId": self._instance_id,
            "author": self._author,
            "authorizedUsers": self._authorized_users,
            "objectStorage": {}
        }
        return exported


@public
def create_instance(epoch_id: bytes) -> int:
    # creates an epoch instance for the user to mint from with extended features
    tx = cast(Transaction, script_container)
    author: UInt160 = tx.sender

    new_instance: EpochInstance = EpochInstance(epoch_id, author)
    instance_id: bytes = new_instance.get_id()
    instance_id_int: int = instance_id.to_int()

    save_epoch_instance(new_instance)
    put(TOTAL_EPOCH_INSTANCES, instance_id)
    return instance_id_int


@public
def mint_from_instance(instance_id: bytes) -> Dict[str, Any]:
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    epoch_instance: EpochInstance = get_epoch_instance(instance_id)
    assert epoch_instance.is_authorized(signer), "Transaction signer is not authorized"

    epoch_id: bytes = epoch_instance.get_epoch_id()
    epoch: Epoch = get_epoch(epoch_id)

    result: Dict[str, Any] = epoch.mint_traits(epoch_instance)
    return result


@public
def set_instance_authorized_users(instance_id: bytes, authorized_users: [UInt160]) -> bool:
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    epoch_instance: EpochInstance = get_epoch_instance(instance_id)

    author: UInt160 = epoch_instance.get_author()
    assert signer == author, "Transaction signer is not the instance author"

    epoch_instance.set_authorized_users(authorized_users)

    save_epoch_instance(epoch_instance)
    return True


@public
def get_epoch_instance_json(instance_id: bytes) -> Dict[str, Any]:
    """
    Gets the JSON formatted representation of an epoch instance
    :param instance_id: the byte formatted instance_id
    :return: A dictionary representation of an instance_id
    """
    epoch_instance: EpochInstance = get_epoch_instance(instance_id)
    return epoch_instance.export()


@public
def get_epoch_instance(instance_id: bytes) -> EpochInstance:
    """
    Gets an EpochInstance class instance
    :param instance_id: the byte formatted instance_id
    :return: An epoch instance class instance
    """
    instance_bytes: bytes = get_epoch_instance_raw(instance_id)
    return cast(EpochInstance, deserialize(instance_bytes))


def get_epoch_instance_raw(instance_id: bytes) -> bytes:
    """
    Gets a serialized epoch instance
    :param instance_id: the byte formatted pointer to the epoch instance
    :return: a serialized epoch instance
    """
    return get(mk_epoch_instance_key(instance_id))


@public
def total_epoch_instances() -> int:
    """
    Gets the total epoch instances
    :return: An integer representing the total epoch instances
    """
    total: bytes = get(TOTAL_EPOCH_INSTANCES)
    if len(total) == 0:
        return 0
    return total.to_int()


def save_epoch_instance(epoch_instance: EpochInstance) -> bool:
    instance_id: bytes = epoch_instance.get_id()
    put(mk_epoch_instance_key(instance_id), serialize(epoch_instance))
    return True


#######################################
#################Event#################
#######################################


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
    def __init__(self, event_id: bytes, event_type: int, max_mint: int, args: List):
        self._event_type: int = event_type
        self._id: bytes = event_id
        self._max_mint: int = max_mint

        if event_type == 0:
            collection_id: int = cast(int, args[0])
            idx: int = cast(int, args[1])
            self._event = CollectionPointerEvent(collection_id, idx)

    def export(self) -> Dict[str, Any]:
        args: Dict[str, Any] = self._event.export()
        exported: Dict[str, Any] = {
            'type': self._event_type,
            'id': self._id,
            'maxMint': self._max_mint,
            'args': args
        }
        return exported

    def select(self, epoch_instance: EpochInstance) -> bytes:

        instance_storage: Dict[str, Any] = epoch_instance.get_scoped_storage(self._id)

        mint_count: int = 0
        if 'a' in instance_storage.keys():
            mint_count = cast(int, instance_storage['a'])
        mint_count += 1

        # check if max mint has been exceeded
        if self._max_mint != -1 and mint_count > self._max_mint:
            return b''

        instance_storage['a'] = mint_count
        x: bool = epoch_instance.set_scoped_storage(self._id, instance_storage)

        if self._event_type == 0:
            event: CollectionPointerEvent = cast(CollectionPointerEvent, self._event)
            result: bytes = event.get_value()
            return result

        raise Exception("Invalid Event Type")
        return b'' #compiler errors without this


#######################################
#################Trait#################
#######################################


class TraitLevel:

    def __init__(self, trait_level_id: bytes, drop_score: bytes, events: List):
        self._id: bytes = trait_level_id
        self._drop_score: int = drop_score.to_int()

        traits: [EventInterface] = []
        for i in range(len(events)):
            event_list: List = cast(List, events[i])
            event_type: int = cast(int, event_list[0])
            max_mint: int = cast(int, event_list[1])
            event_args: List = cast(List, event_list[2])
            event_id: bytes = append_key_stack(self._id, i.to_bytes())
            new_event: EventInterface = EventInterface(event_id, event_type, max_mint, event_args)
            traits.append(new_event)
        self._traits: [EventInterface] = traits

    def dropped(self, roll: int) -> bool:
        dropped: bool = roll < self._drop_score
        return dropped

    def export(self) -> Dict[str, Any]:
        traits: List[Dict] = []
        for trait in self._traits:
            trait_json: Dict[str, Any] = trait.export()
            traits.append(trait_json)

        exported: Dict[str, Any] = {
            'drop_score': self._drop_score,
            'id': self._id,
            'traits': traits
        }
        return exported

    def get_drop_score(self) -> int:
        return self._drop_score

    def can_mint(self) -> bool:
        available_traits: int = len(self._traits)
        return available_traits > 0

    def mint(self, entropy: bytes, epoch_instance: EpochInstance) -> bytes:
        max_index: int = len(self._traits)

        #empty trait level
        if max_index == 0:
            return b''

        entropy_int: int = entropy.to_int()
        idx: int = (max_index * entropy_int) // 256
        event: EventInterface = self._traits[idx]
        return event.select(epoch_instance)


class Trait:
    def __init__(self, trait_id: bytes, label: bytes, slots: int, trait_levels: List):
        self._label: bytes = label
        self._id: bytes = trait_id
        self._slots: int = slots

        new_trait_levels: [TraitLevel] = []
        for i in range(len(trait_levels)):
            trait_list: List = cast(List, trait_levels[i])
            drop_score: bytes = cast(bytes, trait_list[0])
            traits: List = cast(List, trait_list[1])
            trait_level_id: bytes = append_key_stack(self._id, i.to_bytes())
            t: TraitLevel = TraitLevel(trait_level_id, drop_score, traits)
            new_trait_levels.append(t)

        self._trait_levels: [TraitLevel] = new_trait_levels

    def get_label(self) -> bytes:
        return self._label

    def get_slots(self) -> int:
        return self._slots

    def mint(self, epoch_instance: EpochInstance) -> [bytes]:
        slot_entropy = get_random().to_bytes()
        trait_levels: [TraitLevel] = self._trait_levels
        slots: int = self._slots

        traits: [bytes] = []
        for i in range(slots):
            roll: int = Dice.rand_between(0, 9999)
            for trait_level in trait_levels:
                if trait_level.dropped(roll):
                    new_trait: bytes = trait_level.mint(slot_entropy[i].to_bytes(), epoch_instance)
                    if len(new_trait) > 0:
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
            'id': self._id,
            'slots': self._slots,
            'traitLevels': trait_levels
        }
        return exported

    def get_id(self) -> bytes:
        return self._id


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


def save_trait(trait: Trait) -> bool:
    trait_id: bytes = trait.get_id()
    put(mk_trait_key(trait_id), serialize(trait))
    return True


def get_trait(trait_id: bytes) -> Trait:
    trait_bytes: bytes = get_trait_raw(trait_id)
    return cast(Trait, deserialize(trait_bytes))


def get_trait_raw(trait_id: bytes) -> bytes:
    return get(mk_trait_key(trait_id))


def append_key_stack(current: bytes, new_key: bytes) -> bytes:
    return current + b'_' + new_key

#######################################
#################EPOCH#################
#######################################


class Epoch:
    def __init__(self):
        self._label: bytes = b''
        self._traits: [bytes] = []
        self._id: bytes = (total_epochs() + 1).to_bytes()
        self._author: UInt160 = b''

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
        }
        return exported

    def load(self, label: bytes, author: UInt160) -> bool:
        self._label = label
        self._author = author
        return True

    def get_author(self) -> UInt160:
        return self._author

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

    def mint_traits(self, epoch_instance: EpochInstance) -> Dict[str, Any]:
        traits: Dict[str, Any] = {}

        trait_objects: [bytes] = self._traits
        for trait_id in trait_objects:
            trait_object: Trait = get_trait(trait_id)
            label_bytes: bytes = trait_object.get_label() #this is a cast and may be breaking
            label: str = label_bytes.to_str()

            trait: [bytes] = trait_object.mint(epoch_instance)
            traits_count: int = len(trait)
            if traits_count > 1 or trait_object.get_slots() > 1:
                traits[label] = trait
            if traits_count == 1:
                traits[label] = trait[0]
        return traits


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
def create_epoch(label: bytes) -> int:
    """
    Creates a new epoch
    :param label: A byte formatted string defining the epoch
    :return: An integer representing the epoch_id
    """
    tx = cast(Transaction, script_container)
    author: UInt160 = tx.sender

    new_epoch: Epoch = Epoch()
    x: bool = new_epoch.load(label, author)
    epoch_id: bytes = new_epoch.get_id()
    epoch_id_int: int = epoch_id.to_int()
    save_epoch(new_epoch)
    put(TOTAL_EPOCHS, epoch_id)
    return epoch_id_int


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


##################KEYS########################


def mk_epoch_key(epoch_id: bytes) -> bytes:
    return EPOCH_KEY + epoch_id


def mk_trait_key(trait_id: bytes) -> bytes:
    return TRAIT_KEY + trait_id


def mk_epoch_instance_key(epoch_instance_id: bytes) -> bytes:
    return EPOCH_INSTANCE_KEY + epoch_instance_id


#################Deps############################


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

