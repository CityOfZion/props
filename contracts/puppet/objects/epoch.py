from typing import Any, Dict, List, Union, cast
from boa3.builtin import CreateNewEvent, NeoMetadata, metadata, public
from boa3.builtin.interop.stdlib import serialize, deserialize, itoa
from boa3.builtin.interop.storage import get, put

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
# TODO: CREATE EPOCH protection

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
def create_epoch(label: bytes, total_supply: bytes, max_traits: bytes, traits: List[List]) -> bool:
    new_epoch: Epoch = Epoch()
    x: bool = new_epoch.load(label, total_supply, max_traits, traits)
    epoch_id: bytes = new_epoch.get_id()
    save_epoch(new_epoch)
    put(TOTAL_EPOCHS, epoch_id)
    return True

@public
def get_epoch_json(epoch_id: bytes) -> Dict[str, Any]:
    return {}


class CollectionPointer:
    def __init__(self, collection_id: int, index: int):
        self.collection_id = collection_id
        self.index = index


class TraitLevel:

    def __init__(self, drop_score: bytes, unique: bool, collection_pointers: List[List]):
        self._drop_score: int = drop_score.to_int()
        self.unique: bool = unique

        traits: [CollectionPointer] = []
        for pointer in collection_pointers:
            collection_id: int = cast(int, pointer[0])
            index: int = cast(int, pointer[1])
            p: CollectionPointer = CollectionPointer(collection_id, index)
            traits.append(p)
        self._traits = traits

    def dropped(self, roll: int) -> bool:
        return True

    def mint(self, entropy: bytes) -> bytes:
        return cast(bytes, "a test title")


class Epoch:

    def __init__(self):
        self._label: bytes = b''
        self._total_supply: int = 0
        self._max_traits: int = 0
        self._trait_levels: [bytes] = []
        self._traits: [TraitLevel] = []
        self._id: bytes = (total_epochs() + 1).to_bytes()

    def load(self, label: bytes, total_supply: bytes, max_traits: bytes, traits: List[List]) -> bool:
        self._label = label
        self._total_supply = total_supply.to_int()
        self._max_traits = max_traits.to_int()

        new_traits: [TraitLevel] = []

        for trait in traits:
            drop_score: bytes = cast(bytes, trait[0])
            unique: bool = cast(bool, trait[1])
            collection_pointers: List[List] = cast(List[List], trait[2])
            t: TraitLevel = TraitLevel(drop_score, unique, collection_pointers)
            new_traits.append(t)
        self._traits = new_traits
        return True

    def get_label(self) -> bytes:
        return self._label

    def get_id(self) -> bytes:
        return self._id

    def get_traits(self) -> List[TraitLevel]:
        return self._traits

    def pick_traits(self) -> [bytes]:
        # get entropy

        traits: [bytes] = []
        for i in range(self._max_traits):
            roll: int = 1000 #this needs to be a roll

            for trait_level in self._traits:
                if trait_level.dropped(roll):
                    new_trait: bytes = trait_level.mint(b"some entropy")
                    traits.append(new_trait)
                    break
        return traits

    '''
        
        def pick_traits(self) -> [str]:
            # to select
            # for each trait field (5), calculate drop level
            # select drop from the list of available drops
            entropy: bytes = get_random().to_bytes()

            traits: [str] = []
            rolls: [int] = roll_dice_with_entropy_internal("d10000", 2, entropy[0:10])
                #x = (((1 - A2) ^ (1 - A2) - 1) / (1 - A2)) / (-1 * B2)
                # where A2 is a random uniform between 0-1
                # B2 is a shape parameter

                ##alternative

                ## just define greater than X roll on a d1000 for each rank as part of the epoch
                ## roll for rank
                ## roll for title (how do we handle increasing probability?)

        def pop_trait(self, entropy: bytes) -> [any]:
            """
            Picks a trait from the available options and updates the distribution
            :param entropy:
            :return:a trait
            """
            max_int: int = 128
            entropy_int: int = abs(entropy.to_int()) # TODO: use unsigned
    
            # result is 5
            index: int = (len(self._traits_flat) * entropy_int) // max_int
            trait: any = self._traits_flat.pop(index) # This may not work in place; need to verify
    
            # update distribution
    
            return trait
    '''


def get_epoch(label: bytes) -> Epoch:
    epoch_bytes: bytes = get_epoch_raw(label)
    return cast(Epoch, deserialize(epoch_bytes))


def get_epoch_raw(label: bytes) -> bytes:
    """
    Gets the serialized puppet definition
    @param token_id: the unique puppet identifier
    @return: a serialize puppet
    """
    return get(mk_epoch_key(label))


def save_epoch(epoch: Epoch) -> bool:
    id: bytes = epoch.get_id()
    put(mk_epoch_key(id), serialize(epoch))
    return True


def mk_epoch_key(label: bytes) -> bytes:
    return EPOCH_KEY + label
