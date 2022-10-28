from typing import Any, List, Optional

from boa3.builtin import NeoMetadata, metadata, public
from boa3.builtin.interop import runtime, storage
from boa3.builtin.interop.blockchain import Transaction
from boa3.builtin.interop.contract import Contract
from boa3.builtin.interop.contract.contractmanifest import ContractManifest
from boa3.builtin.nativecontract.contractmanagement import ContractManagement
from boa3.builtin.nativecontract.cryptolib import CryptoLib
from boa3.builtin.nativecontract.stdlib import StdLib
from boa3.builtin.type import ByteString, UInt160


# -------------------------------------------
# METADATA
# -------------------------------------------

@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.description = "Smart Contract icon management prop. Made by meevee98, lock9, luc10921. Visit ndapp.org to discover more of the ecosystem."
    meta.name = "Icon DApp by COZ & NNT"
    meta.author = "COZ in partnership with NNT"
    meta.email = "contact@coz.io"
    meta.supported_standards = []
    # requires access to ContractManagement methods
    meta.add_permission(contract='0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
                        methods=['update', 'destroy'])
    return meta


@public
def _deploy(data: Any, update: bool):
    if not update:
        # setup instructions that will be executed when the smart contract is deployed
        container: Transaction = runtime.script_container
        storage.put(get_owner_key(), container.sender)
    else:
        # code for updating the contract after it was deployed
        return
    return


@public
def update(nef_file: bytes, manifest: bytes):
    # admin only
    if not runtime.check_witness(get_owner()):
        raise Exception('No authorization')
    ContractManagement.update(nef_file, manifest)


@public
def name() -> str:
    return "Icon DApp"


@public(name="getOwner", safe=True)
def get_owner() -> UInt160:
    return UInt160(storage.get(get_owner_key()))


@public(name="addProperty")
def add_property(property_name: str, description: str) -> bool:
    # admin only
    if not runtime.check_witness(get_owner()):
        raise Exception('No authorization')

    assert 0 < len(property_name) < 31
    assert 0 < len(description) < 255

    properties_key = get_properties_key()
    property_bytes = storage.get(properties_key)
    can_set = True

    # using two if's instead of one with a 'and' operation because it had runtime errors
    if property_bytes is not None:
        if len(property_bytes) > 0:
            properties_json = StdLib.deserialize(property_bytes)
            properties: dict = properties_json

            if property_name in properties:
                can_set = properties[property_name] is None
        else:
            properties: dict = {property_name: description}
    else:
        properties: dict = {property_name: description}

    if not can_set:
        raise Exception("Property name already exists")

    properties[property_name] = description
    storage.put(properties_key, StdLib.serialize(properties))

    return True


@public(name="updateProperty")
def update_property(property_name: str, description: str) -> bool:
    # admin only
    if not runtime.check_witness(get_owner()):
        raise Exception('No authorization')

    assert 0 < len(property_name) < 31
    assert 0 < len(description) < 255

    properties_key = get_properties_key()
    property_bytes = storage.get(properties_key)

    # using two if's instead of one with a 'or' operation because it had runtime errors
    if property_bytes is None:
        raise Exception("Invalid property")
    if len(property_bytes) == 0:
        raise Exception("Invalid property")

    properties_json = StdLib.deserialize(property_bytes)
    properties: dict = properties_json

    if property_name not in properties:
        raise Exception("Invalid property")

    properties[property_name] = description
    storage.put(properties_key, StdLib.serialize(properties))

    return True


@public(name="getProperties", safe=True)
def get_properties() -> dict:
    properties_bytes = storage.get(get_properties_key())
    if properties_bytes is not None and len(properties_bytes) > 0:
        properties_json = StdLib.deserialize(properties_bytes)
        properties: dict = properties_json
        return properties
    else:
        return {}


@public(name="setMetaData")
def set_meta_data(script_hash: UInt160, property_name: str, value: str) -> bool:
    # admin or deployer
    if not runtime.check_witness(get_owner()):
        contract_owner: UInt160 = get_contract_owner(script_hash)
        # using two if's instead of one with a or operation because it had runtime errors
        if not isinstance(contract_owner, UInt160):
            raise Exception('No authorization')
        if not runtime.check_witness(contract_owner):
            raise Exception('No authorization')

    assert 0 < len(value) < 390

    property_names = get_properties()
    if property_name not in property_names:
        raise Exception('Undefined property name')

    if property_names[property_name] is None:
        raise Exception('Undefined property name')

    contract_properties = get_meta_data(script_hash)
    contract_properties[property_name] = value
    contract_key = get_contract_property_key(script_hash)
    storage.put(contract_key, StdLib.serialize(contract_properties))
    return True


@public(name="getMetaData", safe=True)
def get_meta_data(script_hash: UInt160) -> dict:
    parent_contract = get_contract_parent(script_hash)
    if isinstance(parent_contract, UInt160):
        contract_key = get_contract_property_key(parent_contract)
    else:
        contract_key = get_contract_property_key(script_hash)

    contract_properties_bytes = storage.get(contract_key)
    contract_properties = {}

    if contract_properties_bytes is not None and len(contract_properties_bytes) > 0:
        properties_json = StdLib.deserialize(contract_properties_bytes)
        contract_properties: dict = properties_json

    if isinstance(parent_contract, UInt160):
        contract_properties["parent"] = parent_contract

    return contract_properties


@public(name="getMultipleMetaData", safe=True)
def get_multiple_meta_data(contract_hashes: List[UInt160]) -> dict:
    metadata = {}
    for hash in contract_hashes:
        contract_metadata = get_meta_data(hash)
        metadata[hash] = contract_metadata
    return metadata


# Reuses other contract meta-data
@public(name="setContractParent")
def set_contract_parent(child_hash: UInt160, parent_hash: UInt160) -> bool:
    # admin or deployer
    if not runtime.check_witness(get_owner()):
        contract_owner: UInt160 = get_contract_owner(parent_hash)
        # using two if's instead of one with a or operation because it had runtime errors
        if not isinstance(contract_owner, UInt160):
            raise Exception('No authorization')
        if not runtime.check_witness(contract_owner):
            raise Exception('No authorization')

    # check if parent and child are the same
    if parent_hash == child_hash:
        raise Exception("Invalid operation: can't set a contract as its own parent")

    # check if the parent has another parent
    contract_parent = get_contract_parent(parent_hash)
    if isinstance(contract_parent, UInt160):
        if contract_parent == child_hash:
            raise Exception("Invalid operation: can't set a contract child as its parent")
        parent_hash = contract_parent

    child_key = get_child_key(child_hash)
    storage.put(child_key, parent_hash)

    return True


@public(name="getContractParent", safe=True)
def get_contract_parent(child_hash: UInt160) -> Optional[UInt160]:
    # assert len(child_hash) == 20
    storage_result = storage.get(get_child_key(child_hash))
    if len(storage_result) > 0:
        return UInt160(storage_result)
    return None


def get_contract_owner(script_hash: UInt160) -> Optional[UInt160]:
    contract_owner_key = get_contract_owner_key(script_hash)
    storage_result = storage.get(contract_owner_key)
    if len(storage_result) > 0:
        return UInt160(storage_result)

    return None


@public(name='setOwnership')
def set_ownership(script_hash: UInt160, contract_owner: UInt160) -> bool:
    # if it's not icon dapp admin, needs to check if it's the contract deployer
    if runtime.check_witness(get_owner()):
        contract_deployer = contract_owner
    else:
        current_contract_owner: UInt160 = get_contract_owner(script_hash)
        # using two if's instead of one with a 'and' operation because it had runtime errors
        if isinstance(current_contract_owner, UInt160):
            # the contract owner can change the contract ownership
            # if it's not signed by the contract owner, checks if it's signed by the given address
            if not runtime.check_witness(current_contract_owner):
                if not runtime.check_witness(contract_owner):
                    raise Exception('No authorization')

            contract_deployer = contract_owner
        else:
            if not runtime.check_witness(contract_owner):
                raise Exception('No authorization')

            contract_deployer = get_deployer(script_hash, contract_owner)

    if isinstance(contract_deployer, UInt160):
        contract_owner_key = get_contract_owner_key(script_hash)
        storage.put(contract_owner_key, contract_deployer)
        return True
    return False


def get_deployer(script_hash: UInt160, sender: UInt160) -> Optional[UInt160]:
    contract: Contract = ContractManagement.get_contract(script_hash)
    if not isinstance(contract, Contract):
        return None

    computed_script_hash: bytes = _compute_contract_hash(sender, contract)
    if computed_script_hash != script_hash:
        return None

    return sender


def _compute_contract_hash(sender: UInt160, contract: Contract) -> bytes:
    nef_check_sum = contract.nef  # there's a bug with calling contract.nef[:4] directly
    nef_check_sum = nef_check_sum[-4:]

    manifest: ContractManifest = contract.manifest  # there's a bug with calling contract.manifest.name directly
    contract_name = manifest.name.to_bytes()

    contract_name_size = len(contract_name)
    if contract_name_size < 0x100:
        serialized_name = b'\x0c' + contract_name_size.to_bytes()   # PUSHDATA1
    elif contract_name_size < 0x10000:
        serialized_name = b'\x0d' + contract_name_size.to_bytes()   # PUSHDATA2
    else:
        serialized_name = b'\x0e' + contract_name_size.to_bytes()[:4]  # PUSHDATA4

    validation_script = (b'\x38' +                      # ABORT
                         b'\x0c\x14' + sender +         # PUSHDATA1 + 20 bytes
                         b'\x02' + nef_check_sum +      # PUSHINT32
                         serialized_name + contract_name)

    return CryptoLib.ripemd160(CryptoLib.sha256(validation_script))


# Keys
def get_owner_key() -> ByteString:
    return b"\x01"


def get_properties_key() -> ByteString:
    return b"\x02"


def get_contract_property_key(script_hash: UInt160) -> ByteString:
    return b"\x03" + script_hash


def get_child_key(child_hash: UInt160) -> ByteString:
    return b"\x04" + child_hash


def get_contract_owner_key(script_hash: UInt160) -> ByteString:
    return b"\x05" + script_hash
