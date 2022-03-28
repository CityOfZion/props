from typing import Any, Dict, List, cast, Union
from boa3.builtin import contract, NeoMetadata, metadata, public, CreateNewEvent
from boa3.builtin.interop.contract import call_contract, update_contract
from boa3.builtin.interop.stdlib import serialize, deserialize, itoa
from boa3.builtin.interop.storage import delete, get, put, find, get_context
from boa3.builtin.interop.runtime import burn_gas, gas_left, get_random, script_container, calling_script_hash, entry_script_hash
from boa3.builtin.type import UInt160
from boa3.builtin.interop.blockchain import Transaction


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
    return meta

# ######################################
# ######Events and Constants############
# ######################################


on_mint_generator = CreateNewEvent(
    [
        ('generator_id', bytes),
    ],
    'NewGenerator'
)

GENERATOR_KEY = b'e'
GENERATOR_INSTANCE_KEY = b'i'
OWNER_KEY = b'OWNER'
TRAIT_KEY = b't'
TOTAL_GENERATORS = b'!TOTAL_GENERATORS'
TOTAL_GENERATOR_INSTANCES = b'!TOTAL_GENERATOR_INSTANCES'


# ######################################
# ##############Generators##############
# ######################################


class AccessControllerContract:
    def __init__(self, script_hash: UInt160, from_code: bytes):
        self._script_hash: UInt160 = script_hash
        self._from_code: bytes = from_code

    def get_from_code(self) -> bytes:
        return self._from_code

    def get_script_hash(self) -> UInt160:
        return self._script_hash

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            "scriptHash": self._script_hash,
            "from_code": self._from_code
        }
        return exported


class GeneratorInstance:
    def __init__(self, generator_id: bytes, author: UInt160, access_mode: int, base_fee: int):
        self._generator_id: bytes = generator_id
        self._fee: int = base_fee
        self._instance_id: bytes = (total_generator_instances() + 1).to_bytes()
        self._author: UInt160 = author
        self._access_mode: int = access_mode
        self._authorized_contracts: [AccessControllerContract] = []
        self._authorized_users: [UInt160] = [author]
        self._storage_keys = []

    def get_id(self) -> bytes:
        return self._instance_id

    def get_author(self) -> UInt160:
        return self._author

    def get_fee(self) -> int:
        return self._fee

    def get_generator_id(self) -> bytes:
        return self._generator_id

    def get_scoped_storage(self, storage_key: bytes) -> Dict[str, Any]:
        instance_key: bytes = mk_generator_instance_key(self._instance_id)
        key: bytes = append_key_stack(instance_key, storage_key)
        raw_payload: bytes = get(key)
        if len(raw_payload) == 0:
            return {}
        return cast(Dict[str, Any], deserialize(raw_payload))

    def set_scoped_storage(self, storage_key: bytes, payload: Dict[str, Any]) -> bool:
        instance_key: bytes = mk_generator_instance_key(self._instance_id)
        key: bytes = append_key_stack(instance_key, storage_key)
        serialized_payload: bytes = serialize(payload)
        put(key, serialized_payload)
        return True

    def is_authorized(self, user: UInt160, from_code: bytes) -> bool:
        authorized: bool = False

        if entry_script_hash == calling_script_hash:
            if self._access_mode == 2 or (user in self._authorized_users):
                authorized = True
        else:
            from_code_bytes: bytes = cast(bytes, from_code)
            for authorized_contract in self._authorized_contracts:
                authorized_hash: UInt160 = authorized_contract.get_script_hash()
                authorized_from_code: bytes = authorized_contract.get_from_code()

                contract_is_whitelisted: bool = (authorized_hash == calling_script_hash)
                caller_has_code: bool = (authorized_from_code == from_code_bytes)
                if contract_is_whitelisted and caller_has_code:
                    if self._access_mode == 0:
                        authorized = True
                    if self._access_mode == 1 and (user in self._authorized_users):
                        authorized = True
                    break
        return authorized

    def set_access_mode(self, access_mode: int) -> bool:
        self._access_mode = access_mode
        return True

    def set_authorized_users(self, authorized_users: [UInt160]) -> bool:
        self._authorized_users = authorized_users
        return True

    def set_authorized_contracts(self, authorized_contracts: [AccessControllerContract]) -> bool:
        self._authorized_contracts = authorized_contracts
        return True

    def set_fee(self, new_fee: int) -> bool:
        self._fee = new_fee
        return True

    def export(self) -> Dict[str, Any]:

        contracts: List[Dict] = []
        for c in self._authorized_contracts:
            contract_json: Dict[str, Any] = c.export()
            contracts.append(contract_json)

        exported: Dict[str, Any] = {
            "generatorId": self._generator_id,
            "instanceId": self._instance_id,
            "author": self._author,
            "authorizedUsers": self._authorized_users,
            "authorizedContracts": contracts,
            "accessMode": self._access_mode,
            "objectStorage": {}
        }
        return exported


@public
def create_instance(generator_id: bytes) -> int:
    # creates an generator instance for the user to mint from with extended features
    tx = cast(Transaction, script_container)
    author: UInt160 = tx.sender

    target_generator: Generator = get_generator(generator_id)
    base_fee: int = target_generator.get_base_fee()

    new_instance: GeneratorInstance = GeneratorInstance(generator_id, author, 1, base_fee)
    instance_id: bytes = new_instance.get_id()
    instance_id_int: int = instance_id.to_int()

    save_generator_instance(new_instance)
    put(TOTAL_GENERATOR_INSTANCES, instance_id)
    return instance_id_int


@public
def mint_from_instance(from_code: bytes, to_instance_id: bytes) -> Dict[str, Any]:
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    generator_instance: GeneratorInstance = get_generator_instance(to_instance_id)

    assert generator_instance.is_authorized(signer, from_code), 'Unauthorized access to generator instance'

    generator_id: bytes = generator_instance.get_generator_id()
    generator: Generator = get_generator(generator_id)

    result: Dict[str, Any] = generator.mint_traits(generator_instance)
    return result


@public
def set_instance_authorized_users(instance_id: bytes, authorized_users: [UInt160]) -> bool:
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    generator_instance: GeneratorInstance = get_generator_instance(instance_id)

    author: UInt160 = generator_instance.get_author()
    assert signer == author, "Transaction signer is not the instance author"

    x: bool = generator_instance.set_authorized_users(authorized_users)

    save_generator_instance(generator_instance)
    return True


@public
def set_instance_authorized_contracts(instance_id: bytes, authorized_contracts: List) -> bool:
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    generator_instance: GeneratorInstance = get_generator_instance(instance_id)

    author: UInt160 = generator_instance.get_author()
    assert signer == author, "Transaction signer is not the instance author"

    contracts: [AccessControllerContract] = []
    for authorized_contract in authorized_contracts:
        contract_payload: List = cast(List, authorized_contract)
        script_hash: UInt160 = cast(UInt160, contract_payload[0])
        from_code: bytes = cast(bytes, contract_payload[1])

        new_contract: AccessControllerContract = AccessControllerContract(script_hash, from_code)
        contracts.append(new_contract)

    x: bool = generator_instance.set_authorized_contracts(contracts)

    save_generator_instance(generator_instance)
    return True


@public
def set_instance_access_mode(instance_id: bytes, access_mode: int) -> bool:
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    generator_instance: GeneratorInstance = get_generator_instance(instance_id)

    author: UInt160 = generator_instance.get_author()
    assert signer == author, "Transaction signer is not the instance author"

    x: bool = generator_instance.set_access_mode(access_mode)

    save_generator_instance(generator_instance)
    return True


@public
def set_instance_fee(instance_id: bytes, fee: int) -> bool:
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    generator_instance: GeneratorInstance = get_generator_instance(instance_id)

    author: UInt160 = generator_instance.get_author()
    assert signer == author, "Transaction signer is not the instance author"

    x: bool = generator_instance.set_fee(fee)

    save_generator_instance(generator_instance)
    return True


@public
def get_generator_instance_json(instance_id: bytes) -> Dict[str, Any]:
    """
    Gets the JSON formatted representation of an generator instance
    :param instance_id: the byte formatted instance_id
    :return: A dictionary representation of an instance_id
    """
    generator_instance: GeneratorInstance = get_generator_instance(instance_id)
    return generator_instance.export()


@public
def get_generator_instance(instance_id: bytes) -> GeneratorInstance:
    """
    Gets an GeneratorInstance class instance
    :param instance_id: the byte formatted instance_id
    :return: An generator instance class instance
    """
    instance_bytes: bytes = get_generator_instance_raw(instance_id)
    return cast(GeneratorInstance, deserialize(instance_bytes))


def get_generator_instance_raw(instance_id: bytes) -> bytes:
    """
    Gets a serialized generator instance
    :param instance_id: the byte formatted pointer to the generator instance
    :return: a serialized generator instance
    """
    return get(mk_generator_instance_key(instance_id))


@public
def total_generator_instances() -> int:
    """
    Gets the total generator instances
    :return: An integer representing the total generator instances
    """
    total: bytes = get(TOTAL_GENERATOR_INSTANCES)
    if len(total) == 0:
        return 0
    return total.to_int()


def save_generator_instance(generator_instance: GeneratorInstance) -> bool:
    instance_id: bytes = generator_instance.get_id()
    put(mk_generator_instance_key(instance_id), serialize(generator_instance))
    return True


# ######################################
# ################Event#################
# ######################################


class CollectionPointerEvent:
    def __init__(self, collection_id: int, idx: int):
        self.collection_id: int = collection_id
        self.idx: int = idx

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            "collection_id": self.collection_id,
            "index": self.idx
        }
        return exported

    def get_value(self, generator_instance: GeneratorInstance) -> bytes:
        cid: int = self.collection_id
        value: bytes = Collection.get_collection_element(cid.to_bytes(), self.idx)
        return value


class InstanceCallEvent:
    def __init__(self, script_hash: UInt160, method: str, param: list):
        self._scriptHash: UInt160 = script_hash
        self._method: str = method
        self._param: list = param

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            "scriptHash": self._scriptHash,
            "method": self._method,
            "param": self._param
        }
        return exported

    def get_value(self, generator_instance: GeneratorInstance) -> bytes:
        params: List = List.copy(self._param)
        instance_id: bytes = generator_instance.get_id()
        params.insert(0, instance_id.to_int())
        value: bytes = call_contract(self._scriptHash, self._method, params)
        return value


class ValueEvent:
    def __init__(self, value: bytes):
        self._value = value

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            "value": self._value
        }
        return exported

    def get_value(self, generator_instance: GeneratorInstance) -> bytes:
        return self._value


class CollectionSampleFromEvent:
    def __init__(self, collection_id: int):
        self.collection_id: int = collection_id

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            "collection_id": self.collection_id,
        }
        return exported

    def get_value(self, generator_instance: GeneratorInstance) -> bytes:
        cid: int = self.collection_id
        value: [bytes] = Collection.sample_from_collection(cid, 1)
        return value[0]


class EventInterface:
    def __init__(self, event_id: bytes, event_type: int, max_mint: int, args: List):
        self._event_type: int = event_type
        self._id: bytes = event_id
        self._max_mint: int = max_mint
        self._event: Union[CollectionPointerEvent, InstanceCallEvent, ValueEvent, CollectionSampleFromEvent]

        if event_type == 0:
            collection_id: int = cast(int, args[0])
            idx: int = cast(int, args[1])
            self._event = CollectionPointerEvent(collection_id, idx)

        if event_type == 1:
            script_hash: UInt160 = cast(UInt160, args[0])
            method: str = cast(str, args[1])
            param: list = cast(list, args[2])
            self._event = InstanceCallEvent(script_hash, method, param)

        if event_type == 2:
            value: bytes = cast(bytes, args[0])
            self._event = ValueEvent(value)

        if event_type == 3:
            collection_id: int = cast(int, args[0])
            self._event = CollectionSampleFromEvent(collection_id)

    def export(self) -> Dict[str, Any]:
        args: Dict[str, Any] = {}
        if self._event_type == 0:
            collection_event: CollectionPointerEvent = cast(CollectionPointerEvent, self._event)
            args = collection_event.export()

        if self._event_type == 1:
            call_event: InstanceCallEvent = cast(InstanceCallEvent, self._event)
            args = call_event.export()

        if self._event_type == 2:
            value_event: ValueEvent = cast(ValueEvent, self._event)
            args = value_event.export()

        if self._event_type == 3:
            sample_event: CollectionSampleFromEvent = cast(CollectionSampleFromEvent, self._event)
            args = sample_event.export()

        exported: Dict[str, Any] = {
            'type': self._event_type,
            'id': self._id,
            'maxMint': self._max_mint,
            'args': args
        }
        return exported

    def get_instance_storage(self, generator_instance: GeneratorInstance) -> Dict[str, Any]:
        return generator_instance.get_scoped_storage(self._id)

    def get_max_mint(self) -> int:
        return self._max_mint

    def get_mint_count(self, generator_instance: GeneratorInstance) -> int:
        instance_storage: Dict[str, Any] = self.get_instance_storage(generator_instance)

        mint_count: int = 0
        if 'mintCount' in instance_storage.keys():
            mint_count = cast(int, instance_storage['mintCount'])
        return mint_count

    def put_instance_storage(self, generator_instance: GeneratorInstance, instance_storage: Dict[str, Any]) -> bool:
        return generator_instance.set_scoped_storage(self._id, instance_storage)

    def select(self, generator_instance: GeneratorInstance) -> bytes:

        instance_storage: Dict[str, Any] = self.get_instance_storage(generator_instance)

        mint_count: int = 0
        if 'mintCount' in instance_storage.keys():
            mint_count = cast(int, instance_storage['mintCount'])
        mint_count += 1

        # check if max mint has been exceeded
        if self._max_mint != -1 and mint_count > self._max_mint:
            return b''

        instance_storage['mintCount'] = mint_count
        x: bool = self.put_instance_storage(generator_instance, instance_storage)

        if self._event_type == 0:
            collection_event: CollectionPointerEvent = cast(CollectionPointerEvent, self._event)
            result: bytes = collection_event.get_value(generator_instance)
            return result

        if self._event_type == 1:
            call_event: InstanceCallEvent = cast(InstanceCallEvent, self._event)
            result: bytes = call_event.get_value(generator_instance)
            return result

        if self._event_type == 2:
            value_event: ValueEvent = cast(ValueEvent, self._event)
            result: bytes = value_event.get_value(generator_instance)
            return result

        if self._event_type == 3:
            sample_event: CollectionSampleFromEvent = cast(CollectionSampleFromEvent, self._event)
            result: bytes = sample_event.get_value(generator_instance)
            return result

        raise Exception("Invalid Event Type")
        return b''


# ######################################
# ################Trait#################
# ######################################


class TraitLevel:

    def __init__(self, trait_level_id: bytes, drop_score: bytes, mint_mode: int, events: List):
        self._id: bytes = trait_level_id
        self._drop_score: int = drop_score.to_int()
        self._mint_mode: int = mint_mode

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

    def mint(self, entropy: bytes, generator_instance: GeneratorInstance) -> bytes:
        traits: [EventInterface] = self._traits
        max_index: int = len(traits)
        mint_mode: int = self._mint_mode

        # empty trait level
        if max_index == 0:
            return b''

        # mints randomly from options, considerate of maxMint) | Default
        if mint_mode == 0:
            entropy_int: int = entropy.to_int()
            idx: int = (max_index * entropy_int) // 256
            event: EventInterface = traits[idx]
            return event.select(generator_instance)

        # mints randomly from options, considerate of maxMint | Will always mint if options are available
        if mint_mode == 1:
            remaining: [int] = []
            for i in range(max_index):
                target_event: EventInterface = traits[i]
                mint_count: int = target_event.get_mint_count(generator_instance)
                max_mint: int = target_event.get_max_mint()
                remaining.append(max_mint - mint_count)

            rank: int = Dice.rand_between(0, sum(remaining) - 1)

            cdf: int = 0
            result: bytes = b''
            for j in range(max_index):
                cdf += remaining[j]
                if rank < cdf:
                    selected_event: EventInterface = self._traits[j]
                    result: bytes = selected_event.select(generator_instance)
                    break
            return result

        raise Exception("Invalid Mint Mode")
        return b''


class Trait:
    def __init__(self, trait_id: bytes, label: bytes, slots: int, trait_levels: List):
        self._label: bytes = label
        self._id: bytes = trait_id
        self._slots: int = slots

        new_trait_levels: [TraitLevel] = []
        for i in range(len(trait_levels)):
            trait_list: List = cast(List, trait_levels[i])
            drop_score: bytes = cast(bytes, trait_list[0])
            mint_mode: int = cast(int, trait_list[1])
            traits: List = cast(List, trait_list[2])
            trait_level_id: bytes = append_key_stack(self._id, i.to_bytes())
            t: TraitLevel = TraitLevel(trait_level_id, drop_score, mint_mode, traits)
            new_trait_levels.append(t)

        self._trait_levels: [TraitLevel] = new_trait_levels

    def get_label(self) -> bytes:
        return self._label

    def get_slots(self) -> int:
        return self._slots

    def mint(self, generator_instance: GeneratorInstance) -> [bytes]:
        slot_entropy = get_random().to_bytes()
        trait_levels: [TraitLevel] = self._trait_levels
        slots: int = self._slots

        traits: [bytes] = []
        for i in range(slots):
            roll: int = Dice.rand_between(0, 999999)
            for trait_level in trait_levels:
                if trait_level.dropped(roll):
                    new_trait: bytes = trait_level.mint(slot_entropy[i].to_bytes(), generator_instance)
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
def create_trait(generator_id: bytes, label: bytes, slots: int, trait_levels: List) -> bytes:
    """
    Binds a new trait to an generator
    :param generator_id: the generator_id to bind the trait to
    :param label: the trait's label
    :param slots: the maximum number of events that can mint on this trait
    :param trait_levels: a list of the trait levels
    :return: the trait_id
    """
    tx = cast(Transaction, script_container)
    signer: UInt160 = tx.sender

    generator: Generator = get_generator(generator_id)

    author: UInt160 = generator.get_author()
    assert signer == author, "Transaction signer is not the generator author"

    generator_traits: [bytes] = generator.get_traits()
    trait_length: int = len(generator_traits)
    trait_id: bytes = generator.get_id() + b'_' + trait_length.to_bytes()
    new_trait: Trait = Trait(trait_id, label, slots, trait_levels)
    save_trait(new_trait)

    # update the generator
    x = generator.append_trait(trait_id)
    save_generator(generator)

    return trait_id


def save_trait(trait: Trait) -> bool:
    trait_id: bytes = trait.get_id()
    put(mk_trait_key(trait_id), serialize(trait))
    return True


@public
def get_trait_json(trait_id: bytes) -> Dict[str, Any]:
    """
    Gets the JSON formatted representation of an trait
    :param trait_id: the byte formatted trait_id
    :return: A dictionary representation of a trait
    """
    trait: Trait = get_trait(trait_id)
    return trait.export()


@public
def get_trait(trait_id: bytes) -> Trait:
    trait_bytes: bytes = get_trait_raw(trait_id)
    return cast(Trait, deserialize(trait_bytes))


def get_trait_raw(trait_id: bytes) -> bytes:
    return get(mk_trait_key(trait_id))


def append_key_stack(current: bytes, new_key: bytes) -> bytes:
    return current + b'_' + new_key

# ######################################
# ################GENERATOR#################
# ######################################


class Generator:
    def __init__(self):
        self._label: bytes = b''
        self._traits: [bytes] = []
        self._id: bytes = (total_generators() + 1).to_bytes()
        self._author: UInt160 = b''
        self._base_generator_fee: int = 0

    def export(self) -> Dict[str, Any]:

        exported: Dict[str, Any] = {
            "id": self._id,
            "author": self._author,
            "baseGeneratorFee": self._base_generator_fee,
            "label": self._label,
            "traits": self._traits,
        }
        return exported

    def load(self, label: bytes, author: UInt160, base_generator_fee: int) -> bool:
        self._label = label
        self._author = author
        self._base_generator_fee = base_generator_fee
        return True

    def get_author(self) -> UInt160:
        return self._author

    def get_base_fee(self) -> int:
        return self._base_generator_fee

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

    def mint_traits(self, generator_instance: GeneratorInstance) -> Dict[str, Any]:
        traits: Dict[str, Any] = {}

        # remaining GAS before branching code
        start_gas: int = gas_left

        # mint some traits
        trait_objects: [bytes] = self._traits
        for trait_id in trait_objects:
            trait_object: Trait = get_trait(trait_id)
            label_bytes: bytes = trait_object.get_label()
            label: str = label_bytes.to_str()

            trait: [bytes] = trait_object.mint(generator_instance)
            traits_count: int = len(trait)
            if traits_count > 1 or trait_object.get_slots() > 1:
                traits[label] = trait
            if traits_count == 1:
                traits[label] = trait[0]

        end_gas: int = gas_left
        compute_cost: int = start_gas - end_gas
        burn_amount: int = generator_instance.get_fee() - compute_cost
        burn_gas(burn_amount)

        return traits


@public
def total_generators() -> int:
    """
    Gets the total generator count
    :return: An integer representing the total generator count
    """
    total: bytes = get(TOTAL_GENERATORS)
    if len(total) == 0:
        return 0
    return total.to_int()


@public
def create_generator(label: bytes, base_generator_fee: int) -> int:
    """
    Creates a new generator
    :param label: A byte formatted string defining the generator
    :param base_generator_fee: The base GAS fee to use this generator
    :return: An integer representing the generator_id
    """
    tx = cast(Transaction, script_container)
    author: UInt160 = tx.sender

    new_generator: Generator = Generator()
    x: bool = new_generator.load(label, author, base_generator_fee)
    generator_id: bytes = new_generator.get_id()
    generator_id_int: int = generator_id.to_int()
    save_generator(new_generator)
    put(TOTAL_GENERATORS, generator_id)
    on_mint_generator(generator_id)
    return generator_id_int


@public
def get_generator_json(generator_id: bytes) -> Dict[str, Any]:
    """
    Gets the JSON formatted representation of an generator
    :param generator_id: the byte formatted generator_id
    :return: A dictionary representation of an generator
    """
    generator: Generator = get_generator(generator_id)
    return generator.export()


@public
def get_generator(generator_id: bytes) -> Generator:
    """
    Gets an Generator class instance
    :param generator_id: the byte formatted generator_id
    :return: An generator class instance
    """
    generator_bytes: bytes = get_generator_raw(generator_id)
    return cast(Generator, deserialize(generator_bytes))


def get_generator_raw(generator_id: bytes) -> bytes:
    """
    Gets a serialized generator
    :param generator_id: the byte formatted pointer to the generator
    :return: a serialized generator
    """
    return get(mk_generator_key(generator_id))


def save_generator(generator: Generator) -> bool:
    generator_id: bytes = generator.get_id()
    put(mk_generator_key(generator_id), serialize(generator))
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


# #################KEYS########################


def mk_generator_key(generator_id: bytes) -> bytes:
    return GENERATOR_KEY + generator_id


def mk_trait_key(trait_id: bytes) -> bytes:
    return TRAIT_KEY + trait_id


def mk_generator_instance_key(generator_instance_id: bytes) -> bytes:
    return GENERATOR_INSTANCE_KEY + generator_instance_id


# ################Deps############################


@contract('0xacf2aa5d0899e860eebd8b8a5454aa3017543848')
class Collection:

    @staticmethod
    def map_bytes_onto_collection(collection_id: bytes, entropy: bytes) -> bytes:
        pass

    @staticmethod
    def sample_from_collection(collection_id: int, samples: int) -> List[bytes]:
        pass

    @staticmethod
    def get_collection_element(collection_id: bytes, index: int) -> bytes:
        pass


@contract('0x16d6a0be0506b26e0826dd352724cda0defa7131')
class Dice:

    @staticmethod
    def rand_between(start: int, end: int) -> int:
        pass

    @staticmethod
    def map_bytes_onto_range(start: int, end: int, entropy: bytes) -> int:
        pass
