from typing import Any, Dict, List, Union, cast, MutableSequence

from boa3.builtin import CreateNewEvent, NeoMetadata, metadata, public
from boa3.builtin.contract import Nep17TransferEvent, abort
from boa3.builtin.interop.blockchain import get_contract, Transaction
from boa3.builtin.interop.contract import NEO, GAS, call_contract, destroy_contract, update_contract
from boa3.builtin.interop.runtime import notify, log, calling_script_hash, executing_script_hash, check_witness, \
    script_container
from boa3.builtin.interop.stdlib import serialize, deserialize, base58_encode
from boa3.builtin.interop.storage import delete, get, put, find, get_context
from boa3.builtin.interop.storage.findoptions import FindOptions
from boa3.builtin.interop.iterator import Iterator
from boa3.builtin.interop.crypto import ripemd160, sha256
from boa3.builtin.type import UInt160, UInt256
from boa3.builtin.interop.contract import CallFlags
from boa3.builtin.interop.json import json_serialize, json_deserialize
from boa3.builtin.interop.runtime import get_network


# -------------------------------------------
# METADATA
# -------------------------------------------

@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = "COZ, Inc."
    meta.description = "Core Isengard NEP11 contract"
    meta.email = "contact@coz.io"
    meta.supportedstandards = ["NEP-11"]
    meta.permissions = [{"contract": "*", "methods": "*"}]
    return meta


# -------------------------------------------
# TOKEN SETTINGS
# -------------------------------------------

# Symbol of the Token
TOKEN_SYMBOL = 'ISN'  # TODO_TEMPLATE

# Number of decimal places
TOKEN_DECIMALS = 0

# Whether the smart contract was deployed or not
DEPLOYED = b'deployed'

# Whether the smart contract is paused or not
PAUSED = b'paused'

# -------------------------------------------
# Prefixes
# -------------------------------------------

ACCOUNT_PREFIX = b'ACC'
TOKEN_PREFIX = b'TPF'
TOKEN_DATA_PREFIX = b'TDP'
BALANCE_PREFIX = b'BLP'
SUPPLY_PREFIX = b'SPP'
META_PREFIX = b'MDP'
ROYALTIES_PREFIX = b'RYP'

# -------------------------------------------
# Keys
# -------------------------------------------

TOKEN_COUNT = b'TOKEN_COUNT'
AUTH_ADDRESSES = b'AUTH_ADDRESSES'

# -------------------------------------------
# Events
# -------------------------------------------

on_transfer = CreateNewEvent(
    # trigger when tokens are transferred, including zero value transfers.
    [
        ('from_addr', Union[UInt160, None]),
        ('to_addr', Union[UInt160, None]),
        ('amount', int),
        ('token_id', bytes)
    ],
    'Transfer'
)

on_auth = CreateNewEvent(
    # trigger when an address has been authorized/whitelisted.
    [
        ('authorized', UInt160),
        ('type', int),
        ('add', bool),
    ],
    'Authorized'
)

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
# -------------------------------------------
# NEP-11 Methods
# -------------------------------------------

@public
def symbol() -> str:
    """
    Gets the symbols of the token.

    This string must be valid ASCII, must not contain whitespace or control characters, should be limited to uppercase
    Latin alphabet (i.e. the 26 letters used in English) and should be short (3-8 characters is recommended).
    This method must always return the same value every time it is invoked.

    :return: a short string representing symbol of the token managed in this contract.
    """
    debug(['symbol: ', TOKEN_SYMBOL])
    return TOKEN_SYMBOL


@public
def decimals() -> int:
    """
    Gets the amount of decimals used by the token.

    E.g. 8, means to divide the token amount by 100,000,000 (10 ^ 8) to get its user representation.
    This method must always return the same value every time it is invoked.

    :return: the number of decimals used by the token.
    """
    debug(['decimals: ', TOKEN_DECIMALS])
    return TOKEN_DECIMALS


@public
def totalSupply() -> int:
    """
    Gets the total token supply deployed in the system.

    This number must not be in its user representation. E.g. if the total supply is 10,000,000 tokens, this method
    must return 10,000,000 * 10 ^ decimals.

    :return: the total token supply deployed in the system.
    """
    debug(['totalSupply: ', get(SUPPLY_PREFIX).to_int()])
    return get(SUPPLY_PREFIX).to_int()


@public
def balanceOf(owner: UInt160) -> int:
    """
    Get the current balance of an address

    The parameter owner must be a 20-byte address represented by a UInt160.

    :param owner: the owner address to retrieve the balance for
    :type owner: UInt160
    :return: the total amount of tokens owned by the specified address.
    :raise AssertionError: raised if `owner` length is not 20.
    """
    assert len(owner) == 20, "Incorrect `owner` length"
    debug(['balanceOf: ', get(mk_balance_key(owner)).to_int()])
    return get(mk_balance_key(owner)).to_int()


@public
def tokensOf(owner: UInt160) -> Iterator:
    """
    Get all of the token ids owned by the specified address

    The parameter owner must be a 20-byte address represented by a UInt160.

    :param owner: the owner address to retrieve the tokens for
    :type owner: UInt160
    :return: an iterator that contains all of the token ids owned by the specified address.
    :raise AssertionError: raised if `owner` length is not 20.
    """
    assert len(owner) == 20, "Incorrect `owner` length"
    return find(mk_account_key(owner))


@public
def transfer(to: UInt160, token_id: bytes, data: Any) -> bool:
    """
    Transfers the token with id token_id to address to

    The parameter to SHOULD be a 20-byte address. If not, this method SHOULD throw an exception. The parameter 
    token_id SHOULD be a valid NFT. If not, this method SHOULD throw an exception. If the method succeeds, 
    it MUST fire the Transfer event, and MUST return true, even if the token is sent to the owner. If the receiver is 
    a deployed contract, the function MUST call onNEP11Payment method on receiver contract with the data parameter 
    from transfer AFTER firing the Transfer event. 

    The function SHOULD check whether the owner address equals the caller contract hash. If so, the transfer SHOULD be
    processed; If not, the function SHOULD use the SYSCALL Neo.Runtime.CheckWitness to verify the transfer.

    If the transfer is not processed, the function SHOULD return false.

    :param to: the address to transfer to 
    :type to: UInt160 
    :param token_id: the token to transfer 
    :type token_id: ByteString 
    :param data: whatever data is pertinent to the onPayment method 
    :type data: Any 
    :return: whether the transfer was successful 
    :raise AssertionError: raised if `to` length is not 20 or if `token_id` is not a valid 
    NFT or if the contract is paused. 
    """
    assert len(to) == 20, "Incorrect `to` length"
    assert not isPaused(), "Contract is currently paused"
    token_owner = get_owner_of(token_id)

    if not check_witness(token_owner):
        return False

    if token_owner != to:
        set_balance(token_owner, -1)
        remove_token_account(token_owner, token_id)

        set_balance(to, 1)

        set_owner_of(token_id, to)
        add_token_account(to, token_id)
    post_transfer(token_owner, to, token_id, data)
    return True


def post_transfer(token_owner: Union[UInt160, None], to: Union[UInt160, None], token_id: bytes, data: Any):
    """
    Checks if the one receiving NEP11 tokens is a smart contract and if it's one the onPayment method will be called 
    - internal 

    :param token_owner: the address of the sender
    :type token_owner: UInt160
    :param to: the address of the receiver
    :type to: UInt160
    :param token_id: the token hash as bytes
    :type token_id: bytes
    :param data: any pertinent data that might validate the transaction
    :type data: Any
    """
    on_transfer(token_owner, to, 1, token_id)
    if not isinstance(to, None):  # TODO: change to 'is not None' when `is` semantic is implemented
        contract = get_contract(to)
        if not isinstance(contract, None):  # TODO: change to 'is not None' when `is` semantic is implemented
            call_contract(to, 'onNEP11Payment', [token_owner, 1, token_id, data])
            pass


@public
def ownerOf(token_id: bytes) -> UInt160:
    """
    Get the owner of the specified token.

    The parameter token_id SHOULD be a valid NFT. If not, this method SHOULD throw an exception.

    :param token_id: the token for which to check the ownership
    :type token_id: ByteString
    :return: the owner of the specified token.
    :raise AssertionError: raised if `token_id` is not a valid NFT.
    """
    owner = get_owner_of(token_id)
    debug(['ownerOf: ', owner])
    return owner


@public
def tokens() -> Iterator:
    """
    Get all tokens minted by the contract

    :return: an iterator that contains all of the tokens minted by the contract.
    """
    # flags = FindOptions.REMOVE_PREFIX | FindOptions.KEYS_ONLY
    flags = FindOptions.REMOVE_PREFIX
    context = get_context()
    return find(TOKEN_PREFIX, context, flags)


@public
def properties(token_id: bytes) -> Dict[str, str]:
    """
    Get the properties of a token.

    The parameter token_id SHOULD be a valid NFT. If no metadata is found (invalid token_id), an exception is thrown.

    :param token_id: the token for which to check the properties
    :type token_id: ByteString
    :return: a serialized NVM object containing the properties for the given NFT.
    :raise AssertionError: raised if `token_id` is not a valid NFT, or if no metadata available.
    """
    meta_bytes = cast(str, get_meta(token_id))
    assert len(meta_bytes) != 0, 'No metadata available for token'
    meta_object = cast(Dict[str, str], json_deserialize(meta_bytes))

    return meta_object


@public
def propertiesJson(token_id: bytes) -> bytes:
    """
    Get the properties of a token.

    The parameter token_id SHOULD be a valid NFT. If no metadata is found (invalid token_id), an exception is thrown.

    :param token_id: the token for which to check the properties
    :type token_id: ByteString
    :return: a serialized NVM object containing the properties for the given NFT.
    :raise AssertionError: raised if `token_id` is not a valid NFT, or if no metadata available.
    """
    meta = get_meta(token_id)
    assert len(meta) != 0, 'No metadata available for token'
    debug(['properties: ', meta])
    return meta


@public
def deploy(data: Any, upgrade: bool):
    """
    The contracts initial entry point, on deployment.
    """
    debug(["deploy now"])
    if upgrade:
        return

    if get(DEPLOYED).to_bool():
        return

    tx = cast(Transaction, script_container)
    debug(["tx.sender: ", tx.sender, get_network()])
    owner: UInt160 = tx.sender
    network = get_network()
    # DEBUG_START
    # custom owner for tests, ugly hack, because TestEnginge sets an unkown tx.sender...
    if data is not None and network == 860833102:
        new_owner = cast(UInt160, data)
        debug(["check", new_owner])
        internal_deploy(new_owner)
        return

    if data is None and network == 860833102:
        return
    # DEBUG_END
    debug(["owner: ", owner])
    internal_deploy(owner)


def internal_deploy(owner: UInt160):
    debug(["internal: ", owner])
    put(DEPLOYED, True)
    put(PAUSED, False)
    put(TOKEN_COUNT, 0)

    auth: List[UInt160] = [owner]
    serialized = serialize(auth)
    put(AUTH_ADDRESSES, serialized)


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
    abort()


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
    # TODO_TEMPLATE: add own logic if necessary, or uncomment below to prevent any NEP17 except GAS to be sent to the
    # contract (as a failsafe, but would prevent any minting fee logic) if calling_script_hash != GAS: abort() 


# -------------------------------------------
# Methods
# -------------------------------------------

@public
def burn(token_id: bytes) -> bool:
    """
    Burn a token.

    :param token_id: the token to burn
    :type token_id: ByteString
    :return: whether the burn was successful.
    :raise AssertionError: raised if the contract is paused.
    """
    assert not isPaused(), "Contract is currently paused"
    return internal_burn(token_id)


@public
def mint(account: UInt160, meta: bytes, royalties: bytes, data: Any) -> bytes:
    """
    Mint new token.

    :param account: the address of the account that is minting token
    :type account: UInt160
    :param meta: the metadata to use for this token
    :type meta: bytes
    :param royalties: the royalties to use for this token
    :type royalties: bytes
    :param data: whatever data is pertinent to the mint method
    :type data: Any
    :return: token_id of the token minted
    :raise AssertionError: raised if the contract is paused or if check witness fails.
    """
    assert not isPaused(), "Contract is currently paused"

    # TODO_TEMPLATE: add own logic if necessary, or uncomment below to restrict minting to contract authorized addresses
    # assert verify(), '`acccount` is not allowed to mint'
    assert check_witness(account), "Invalid witness"

    return internal_mint(account, meta, royalties, data)


@public
def getRoyalties(token_id: bytes) -> bytes:
    """
    Get a token royalties values.

    :param token_id: the token to get royalties values
    :type token_id: ByteString
    :return: bytes of addresses and values for this token royalties.
    :raise AssertionError: raised if any `token_id` is not a valid NFT.
    """
    royalties = get_royalties(token_id)
    debug(['getRoyalties: ', royalties])
    return royalties


@public
def getAuthorizedAddress() -> list[UInt160]:
    """
    Configure authorized addresses.

    When this contract address is included in the transaction signature,
    this method will be triggered as a VerificationTrigger to verify that the signature is correct.
    For example, this method needs to be called when withdrawing token from the contract.

    :param address: the address of the account that is being authorized
    :type address: UInt160
    :param authorized: authorization status of this address
    :type authorized: bool
    :return: whether the transaction signature is correct
    :raise AssertionError: raised if witness is not verified.
    """
    # assert verify(), '`acccount` is not allowed for setAuthorizedAddress'
    serialized = get(AUTH_ADDRESSES)
    auth = cast(list[UInt160], deserialize(serialized))

    return auth


@public
def setAuthorizedAddress(address: UInt160, authorized: bool):
    """
    Configure authorized addresses.

    When this contract address is included in the transaction signature,
    this method will be triggered as a VerificationTrigger to verify that the signature is correct.
    For example, this method needs to be called when withdrawing token from the contract.

    :param address: the address of the account that is being authorized
    :type address: UInt160
    :param authorized: authorization status of this address
    :type authorized: bool
    :return: whether the transaction signature is correct
    :raise AssertionError: raised if witness is not verified.
    """
    assert verify(), '`acccount` is not allowed for setAuthorizedAddress'
    serialized = get(AUTH_ADDRESSES)
    auth = cast(list[UInt160], deserialize(serialized))

    if authorized:
        found = False
        for i in auth:
            if i == address:
                found = True

        if not found:
            auth.append(address)

        put(AUTH_ADDRESSES, serialize(auth))
        on_auth(address, 0, True)
    else:
        auth.remove(address)
        put(AUTH_ADDRESSES, serialize(auth))
        on_auth(address, 0, False)


@public
def updatePause(status: bool) -> bool:
    """
    Set contract pause status.

    :param status: the status of the contract pause
    :type status: bool
    :return: the contract pause status
    :raise AssertionError: raised if witness is not verified.
    """
    assert verify(), '`acccount` is not allowed for updatePause'
    put(PAUSED, status)
    debug(['updatePause: ', get(PAUSED).to_bool()])
    return get(PAUSED).to_bool()


@public
def isPaused() -> bool:
    """
    Get the contract pause status.

    If the contract is paused, some operations are restricted.

    :return: whether the contract is paused
    """
    debug(['isPaused: ', get(PAUSED).to_bool()])
    if get(PAUSED).to_bool():
        return True
    return False


@public
def verify() -> bool:
    """
    Check if the address is allowed.

    When this contract address is included in the transaction signature,
    this method will be triggered as a VerificationTrigger to verify that the signature is correct.
    For example, this method needs to be called when withdrawing token from the contract.

    :return: whether the transaction signature is correct
    """
    serialized = get(AUTH_ADDRESSES)
    auth = cast(list[UInt160], deserialize(serialized))
    tx = cast(Transaction, script_container)
    for addr in auth:
        if check_witness(addr):
            debug(["Verification successful", addr, tx.sender])
            return True

    debug(["Verification failed", addr])
    return False


@public
def update(script: bytes, manifest: bytes):
    """
    Upgrade the contract.

    :param script: the contract script
    :type script: bytes
    :param manifest: the contract manifest
    :type manifest: bytes
    :raise AssertionError: raised if witness is not verified
    """
    assert verify(), '`acccount` is not allowed for update'
    update_contract(script, manifest)
    debug(['update called and done'])


@public
def destroy():
    """
    Destroy the contract.

    :raise AssertionError: raised if witness is not verified
    """
    assert verify(), '`acccount` is not allowed for destroy'
    destroy_contract()
    debug(['destroy called and done'])


def internal_burn(token_id: bytes) -> bool:
    """
    Burn a token - internal

    :param token_id: the token to burn
    :type token_id: ByteString
    :return: whether the burn was successful.
    :raise AssertionError: raised if `token_id` is not a valid NFT.
    """
    owner = get_owner_of(token_id)

    if not check_witness(owner):
        return False

    remove_owner_of(token_id)
    set_balance(owner, -1)
    add_to_supply(-1)
    remove_meta(token_id)
    remove_royalties(token_id)
    remove_token_account(owner, token_id)

    post_transfer(owner, None, token_id, None)
    return True


def internal_mint(account: UInt160, meta: bytes, royalties: bytes, data: Any) -> bytes:
    """
    Mint new token - internal

    :param account: the address of the account that is minting token
    :type account: UInt160
    :param meta: the metadata to use for this token
    :type meta: bytes
    :param royalties: the royalties to use for this token
    :type royalties: bytes
    :param data: whatever data is pertinent to the mint method
    :type data: Any
    :return: token_id of the token minted
    :raise AssertionError: raised if meta is empty, or if contract is paused.
    """
    assert len(meta) != 0, '`meta` can not be empty'

    token_id = get(TOKEN_COUNT).to_int() + 1
    put(TOKEN_COUNT, token_id)
    token_id_bytes = token_id.to_bytes()

    set_owner_of(token_id_bytes, account)
    set_balance(account, 1)
    add_to_supply(1)

    add_meta(token_id_bytes, meta)
    debug(['metadata: ', meta])

    if len(royalties) != 0:
        add_royalties(token_id_bytes, cast(str, royalties))
        debug(['royalties: ', royalties])

    add_token_account(account, token_id_bytes)
    post_transfer(None, account, token_id_bytes, None)
    return token_id_bytes


def remove_token_account(holder: UInt160, token_id: bytes):
    key = mk_account_key(holder) + token_id
    debug(['add_token_account: ', key, token_id])
    delete(key)


def add_token_account(holder: UInt160, token_id: bytes):
    key = mk_account_key(holder) + token_id
    debug(['add_token_account: ', key, token_id])
    put(key, token_id)


def get_token_data(token_id: bytes) -> Union[bytes, None]:
    key = mk_token_data_key(token_id)
    debug(['get_token_data: ', key, token_id])
    val = get(key)
    return val


def add_token_data(token_id: bytes, data: bytes):
    key = mk_token_data_key(token_id)
    debug(['add_token_data: ', key, token_id])
    put(key, data)


def get_owner_of(token_id: bytes) -> UInt160:
    key = mk_token_key(token_id)
    debug(['get_owner_of: ', key, token_id])
    owner = get(key)
    return UInt160(owner)


def remove_owner_of(token_id: bytes):
    key = mk_token_key(token_id)
    debug(['remove_owner_of: ', key, token_id])
    delete(key)


def set_owner_of(token_id: bytes, owner: UInt160):
    key = mk_token_key(token_id)
    debug(['set_owner_of: ', key, token_id])
    put(key, owner)


def add_to_supply(amount: int):
    total = totalSupply() + amount
    debug(['add_to_supply: ', amount])
    put(SUPPLY_PREFIX, total)


def set_balance(owner: UInt160, amount: int):
    old = balanceOf(owner)
    new = old + amount
    debug(['set_balance: ', amount])

    key = mk_balance_key(owner)
    if new > 0:
        put(key, new)
    else:
        delete(key)


def get_meta(token_id: bytes) -> bytes:
    key = mk_meta_key(token_id)
    debug(['get_meta: ', key, token_id])
    val = get(key)
    return val


def remove_meta(token_id: bytes):
    key = mk_meta_key(token_id)
    debug(['remove_meta: ', key, token_id])
    delete(key)


def add_meta(token_id: bytes, meta: bytes):
    key = mk_meta_key(token_id)
    debug(['add_meta: ', key, token_id])
    put(key, meta)


def get_royalties(token_id: bytes) -> bytes:
    key = mk_royalties_key(token_id)
    debug(['get_royalties: ', key, token_id])
    val = get(key)
    return val


def add_royalties(token_id: bytes, royalties: str):
    key = mk_royalties_key(token_id)
    debug(['add_royalties: ', key, token_id])
    put(key, royalties)


def remove_royalties(token_id: bytes):
    key = mk_royalties_key(token_id)
    debug(['remove_royalties: ', key, token_id])
    delete(key)


# helpers

def mk_account_key(address: UInt160) -> bytes:
    return ACCOUNT_PREFIX + address


def mk_balance_key(address: UInt160) -> bytes:
    return BALANCE_PREFIX + address


def mk_token_key(token_id: bytes) -> bytes:
    return TOKEN_PREFIX + token_id


def mk_token_data_key(token_id: bytes) -> bytes:
    return TOKEN_DATA_PREFIX + token_id


def mk_meta_key(token_id: bytes) -> bytes:
    return META_PREFIX + token_id


def mk_royalties_key(token_id: bytes) -> bytes:
    return ROYALTIES_PREFIX + token_id
