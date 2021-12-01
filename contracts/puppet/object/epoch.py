from typing import Any, Dict, List, Union, cast
from boa3.builtin import contract, CreateNewEvent, NeoMetadata, metadata, public
from boa3.builtin.interop.stdlib import serialize, deserialize, itoa
from boa3.builtin.interop.storage import get, put
from boa3.builtin.interop.runtime import get_random
from ..helpers.dice import roll_dice_with_entropy_internal

@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = "COZ, Inc."
    meta.description = ""
    meta.email = "contact@coz.io"
    meta.supportedstandards = []
    meta.permissions = [{"contract": "*", "methods": "*"}]
    return meta


# TODO: SET CURRENT EPOCH protection


debug = CreateNewEvent(
    [
        ('params', list),
    ],
    'Debug'
)

EPOCH_KEY = b'e'
CURRENT_EPOCH = b'!CURRENT_EPOCH'
TOTAL_EPOCHS = b'!TOTAL_EPOCHS'


@public
def total_epochs() -> int:
    total: bytes = get(TOTAL_EPOCHS)
    if len(total) == 0:
        return 0
    return total.to_int()


@public
def set_current_epoch(epoch_id: bytes) -> bool:
    put(CURRENT_EPOCH, epoch_id)
    return True


@public
def get_current_epoch() -> int:
    return get(CURRENT_EPOCH).to_int()


@public
def create_epoch(label: bytes, max_traits: bytes, traits: List) -> bool:
    new_epoch: Epoch = Epoch()
    x: bool = new_epoch.load(label, max_traits, traits)
    epoch_id: bytes = new_epoch.get_id()
    save_epoch(new_epoch)
    put(TOTAL_EPOCHS, epoch_id)
    return True


def pick_traits() -> bool:
    epoch_id: int = get_current_epoch()
    epoch_id_bytes: bytes = epoch_id.to_bytes()

    epoch: Epoch = get_epoch(epoch_id_bytes)
    traits: [bytes] = epoch.mint_traits()
    debug(['traits: ', traits])
    return True


class CollectionPointer:
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


class TraitLevel:

    def __init__(self, drop_score: bytes, unique: bool, collection_pointers: List):
        self._drop_score: int = drop_score.to_int()
        self._unique: bool = unique
        traits: [CollectionPointer] = []
        for pointer in collection_pointers:
            pointer_list: List = cast(List, pointer)
            collection_id: int = cast(int, pointer_list[0])
            idx: int = cast(int, pointer_list[1])
            p: CollectionPointer = CollectionPointer(collection_id, idx)
            traits.append(p)
        self._traits: [CollectionPointer] = traits

    def dropped(self, roll: int) -> bool:
        # // TODO: handle unique state here
        debug(['did it drop?: ', self._drop_score, roll < self._drop_score])
        return roll < self._drop_score

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

    def mint(self, entropy: bytes) -> bytes:
        max_index: int = len(self._traits) - 1
        entropy_int: int = entropy.to_int()
        idx: int = (max_index * entropy_int) // 255
        trait: CollectionPointer = self._traits[idx]
        return trait.get_value()


class Epoch:

    def __init__(self):
        self._label: bytes = b''
        self._max_traits: int = 0
        self._trait_levels: [TraitLevel] = []
        self._id: bytes = (total_epochs() + 1).to_bytes()

    def export(self) -> Dict[str, Any]:

        trait_levels: List[Dict] = []
        for level in self._trait_levels:
            level_json: Dict[str, Any] = level.export()
            trait_levels.append(level_json)

        exported: Dict[str, Any] = {
            "label": self._label,
            "max_traits": self._max_traits,
            "trait_levels": trait_levels
        }
        return exported

    def load(self, label: bytes, max_traits: bytes, trait_levels: List) -> bool:
        self._label = label
        self._max_traits = max_traits.to_int()
        new_trait_levels: [TraitLevel] = []

        for trait_level in trait_levels:
            trait_list: List = cast(List, trait_level)
            drop_score: bytes = cast(bytes, trait_list[0])
            unique: bool = cast(bool, trait_list[1])
            collection_pointers: List = cast(List, trait_list[2])
            t: TraitLevel = TraitLevel(drop_score, unique, collection_pointers)
            new_trait_levels.append(t)
        self._trait_levels = new_trait_levels
        return True

    def get_label(self) -> bytes:
        return self._label

    def get_id(self) -> bytes:
        return self._id

    def get_traits(self) -> List[TraitLevel]:
        return self._trait_levels

    def mint_traits(self) -> [bytes]:
        entropy: bytes = get_random().to_bytes()

        traits: [bytes] = []

        for i in range(self._max_traits):
            slot_entropy = entropy[i: (i+1) * 3]

            roll: int = roll_dice_with_entropy_internal('d1000', 2,  slot_entropy[0:2])[0] - 1
            debug(["rolling for a trait on slot: ", i, roll])
            for trait_level in self._trait_levels:
                if trait_level.dropped(roll):
                    new_trait: bytes = trait_level.mint(slot_entropy[2].to_bytes())
                    traits.append(new_trait)
                    break

        return traits


@public
def get_epoch_json(epoch_id: bytes) -> Dict[str, Any]:
    epoch: Epoch = get_epoch(epoch_id)
    return epoch.export()


def get_epoch(epoch_id: bytes) -> Epoch:
    epoch_bytes: bytes = get_epoch_raw(epoch_id)
    return cast(Epoch, deserialize(epoch_bytes))


def get_epoch_raw(epoch_id: bytes) -> bytes:
    """
    Gets the serialized puppet definition
    @param token_id: the unique puppet identifier
    @return: a serialize puppet
    """
    return get(mk_epoch_key(epoch_id))


def save_epoch(epoch: Epoch) -> bool:
    id: bytes = epoch.get_id()
    put(mk_epoch_key(id), serialize(epoch))
    return True


def mk_epoch_key(epoch_id: bytes) -> bytes:
    return EPOCH_KEY + epoch_id


@contract('0x863dbb9f115be11f3643077c8eb7e61c8bbe342b')
class Collection:

    @staticmethod
    def get_collection_element(collection_id: bytes, index: int) -> bytes:
        pass