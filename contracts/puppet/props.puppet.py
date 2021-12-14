from typing import Any, Dict, List, Union, cast
from boa3.builtin import contract, CreateNewEvent, NeoMetadata, metadata, public
from boa3.builtin.contract import abort
from boa3.builtin.interop.blockchain import get_contract, Transaction
from boa3.builtin.interop.contract import call_contract, update_contract, GAS
from boa3.builtin.interop.runtime import check_witness, script_container, calling_script_hash
from boa3.builtin.interop.stdlib import serialize, deserialize, itoa
from boa3.builtin.interop.storage import delete, get, put, find, get_context
from boa3.builtin.interop.storage.findoptions import FindOptions
from boa3.builtin.interop.iterator import Iterator
from boa3.builtin.type import UInt160
from boa3.builtin.interop.runtime import get_random

# TODO: Align docstring
# TODO: Max Mint mechanics
# TODO: Epoch Uniques
# TODO: Verify upgrade
# TODO: Epoch authentication for stateful features
# TODO: Break out User Accounts into its own contract
# TODO: is checkwitness needed if we get tx.sender?
# TODO: verify drops on attributes and hit dice
# TODO: audit events
# TODO: Calling contracts need accounts support

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
    meta.description = "A public NFT prop with base attributes and interactions"
    meta.email = "contact@coz.io"
    meta.supported_standards= ["NEP-11"]
    meta.permissions = [{"contract": "*", "methods": "*"}]
    return meta


# -------------------------------------------
# TOKEN SETTINGS
# -------------------------------------------

# Symbol of the Token
TOKEN_SYMBOL = 'PUPPET'  # TODO_TEMPLATE

# Number of decimal places
TOKEN_DECIMALS = 0

# Whether the smart contract was deployed or not
DEPLOYED = b'!deployed'

INITIAL_MINT_FEE: int = 100000000 # GAS

# -------------------------------------------
# Keys
# -------------------------------------------

TOKEN_COUNT: bytes = b'!TOKEN_COUNT'
ACCOUNT_COUNT: bytes = b'!ACCOUNT_COUNT'
CURRENT_EPOCH = b'!CURRENT_EPOCH'
MINT_FEE: bytes = b'!MINT_FEE'

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

    This string must be valid ASCII, must not contain whitespace or control puppets, should be limited to uppercase
    Latin alphabet (i.e. the 26 letters used in English) and should be short (3-8 puppets is recommended).
    This method must always return the same value every time it is invoked.

    :return: a short string representing symbol of the token managed in this contract.
    """
    return TOKEN_SYMBOL


@public
def decimals() -> int:
    """
    Gets the amount of decimals used by the token.

    E.g. 8, means to divide the token amount by 100,000,000 (10 ^ 8) to get its user representation.
    This method must always return the same value every time it is invoked.

    :return: the number of decimals used by the token.
    """
    return TOKEN_DECIMALS


@public
def totalSupply() -> int:
    """
    Gets the total token supply deployed in the system.

    This number must not be in its user representation. E.g. if the total supply is 10,000,000 tokens, this method
    must return 10,000,000 * 10 ^ decimals.

    :return: the total token supply deployed in the system.
    """
    total: bytes = get(TOKEN_COUNT)
    if len(total) == 0:
        return 0
    return total.to_int()


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
    user: User = get_user(owner)
    return user.get_balance_of()


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
    user: User = get_user(owner)
    return user.get_owned_tokens()


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
    NFT
    """
    assert len(to) == 20, "Incorrect `to` length"

    puppet: Puppet = get_puppet(token_id)
    token_owner: UInt160 = puppet.get_owner()
    formatted_token_id: bytes = puppet.get_token_id()
    if not check_witness(token_owner):
        return False

    owner_user: User = get_user(token_owner)
    to_user: User = get_user(to)

    if token_owner != to:

        x: bool = owner_user.remove_owned_token(formatted_token_id)
        x = to_user.add_owned_token(formatted_token_id)

        save_user(token_owner, owner_user)
        save_user(to, to_user)

        x = puppet.set_owner(to)
        save_puppet(puppet)

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
        recipient_contract = get_contract(to)
        if not isinstance(recipient_contract, None):  # TODO: change to 'is not None' when `is` semantic is implemented
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
    puppet: Puppet = get_puppet(token_id)
    owner = puppet.get_owner()
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
def properties(token_id: bytes) -> Dict[str, Any]:
    """
    Get the properties of a token.

    The parameter token_id SHOULD be a valid NFT. If no metadata is found (invalid token_id), an exception is thrown.

    :param token_id: the token for which to check the properties
    :type token_id: ByteString
    :return: a serialized NVM object containing the properties for the given NFT.
    :raise AssertionError: raised if `token_id` is not a valid NFT, or if no metadata available.
    """
    puppet_json = get_puppet_json(token_id)
    assert len(puppet_json) != 0, 'Puppet does not exist'

    return puppet_json


@public
def deploy() -> bool:
    """
    The contracts initial entry point, on deployment.
    """
    if get(DEPLOYED).to_bool():
        return False

    tx = cast(Transaction, script_container)
    owner: UInt160 = tx.sender

    internal_deploy(owner)
    return True


def internal_deploy(owner: UInt160) -> bool:
    put(DEPLOYED, True)
    put(TOKEN_COUNT, 0)
    put(ACCOUNT_COUNT, 1)
    put(MINT_FEE, INITIAL_MINT_FEE.to_bytes())

    super_user_permissions: Dict[str, bool] = {
        'offline_mint': True,
        'contract_upgrade': True,
        'set_mint_fee': True,
        'set_epoch': True,
        'create_epoch': True,
        'set_permissions': True
    }
    user: User = User()
    x: bool = user.set_permissions(super_user_permissions)
    save_user(owner, user)
    return True


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

    fee: int = get_mint_fee()
    if calling_script_hash == GAS and amount == fee:
        internal_mint(from_address)
    else:
        abort()


# -------------------------------------------
# Methods
# -------------------------------------------


@public
def total_accounts() -> int:
    """
    Gets the number of accounts.

    :return: the number of accounts in the system.
    """
    total: bytes = get(ACCOUNT_COUNT)
    if len(total) == 0:
        return 0
    return total.to_int()


@public
def offline_mint(account: UInt160) -> bytes:
    """
    mints a token
    :param account: the account to mint to
    :return: the token_id of the minted token
    """
    # TODO_TEMPLATE: add own logic if necessary, or uncomment below to restrict minting to contract authorized addresses
    # assert verify(), '`acccount` is not allowed to mint'
    tx = cast(Transaction, script_container)
    user: User = get_user(tx.sender)
    assert user.get_offline_mint(), "User Permission Denied"
    return internal_mint(account)


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
    tx = cast(Transaction, script_container)
    user: User = get_user(tx.sender)
    assert user.get_contract_upgrade(), "User Permission Denied"

    update_contract(script, manifest)


@public
def set_mint_fee(amount: bytes):
    tx = cast(Transaction, script_container)
    user: User = get_user(tx.sender)
    assert user.get_set_mint_fee(), "User Permission Denied"
    put(MINT_FEE, amount)


@public
def get_mint_fee() -> int:
    return get(MINT_FEE).to_int()


def internal_mint(owner: UInt160) -> bytes:
    """
    Mint new token - internal

    :param owner: the address of the account that is minting token
    :type owner: UInt160
    :return: token_id of the token minted
    """
    token_id: bytes = (totalSupply() + 1).to_bytes()
    new_puppet: Puppet = Puppet()
    x: bool = new_puppet.generate(owner, token_id)
    save_puppet(new_puppet)
    put(TOKEN_COUNT, token_id)
    user: User = get_user(owner)

    x:bool = user.add_owned_token(token_id)
    save_user(owner, user)

    post_transfer(None, owner, token_id, None)
    return token_id


#############################
#############################

ACCOUNT_PREFIX = b'a'
TOKEN_INDEX_PREFIX = b'i'


class User:

    def __init__(self):
        self._balance: int = 0
        self._permissions: Dict[str, bool] = {
            'offline_mint': False,
            'contract_upgrade': False,
            'set_mint_fee': False,
            'set_epoch': False,
            'create_epoch': False,
            'set_permissions': False
        }

        self._account_id: bytes = (total_accounts() + 1).to_bytes()

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            'balance': self._balance,
            'account_id': self._account_id,
            'permissions': self._permissions
        }
        return exported

    def set_permissions(self, permissions: Dict[str, bool]) -> bool:
        perm_clone = self._permissions
        for key in permissions.keys():
            perm_clone[key] = permissions[key]
        self._permissions = perm_clone
        return True

    def get_account_id(self) -> bytes:
        return self._account_id

    def get_balance_of(self) -> int:
        return self._balance

    def get_owned_tokens(self) -> Iterator:
        return find(mk_token_index_key(self._account_id))

    def add_owned_token(self, token_id: bytes) -> bool:
        key: bytes = mk_token_index_key(self._account_id) + token_id
        self._balance = self._balance + 1
        put(key, token_id)
        return True

    def remove_owned_token(self, token_id: bytes) -> bool:
        key: bytes = mk_token_index_key(self._account_id) + token_id
        self._balance = self._balance - 1
        delete(key)
        return True

    def get_offline_mint(self) -> bool:
        return self._permissions['offline_mint']

    def get_set_permissions(self) -> bool:
        return self._permissions['set_permissions']

    def get_contract_upgrade(self) -> bool:
        return self._permissions['contract_upgrade']

    def get_set_mint_fee(self) -> bool:
        return self._permissions['set_mint_fee']

    def get_create_epoch(self) -> bool:
        return self._permissions['create_epoch']

    def get_set_epoch(self) -> bool:
        return self._permissions['set_epoch']


@public
def get_user_json(address: UInt160) -> Dict[str, Any]:
    user: User = get_user(address)
    return user.export()

@public
def get_user(address: UInt160) -> User:
    user_bytes: bytes = get_user_raw(address)
    if len(user_bytes) != 0:
        return cast(User, deserialize(user_bytes))

    return User()


def get_user_raw(address: UInt160) -> bytes:
    return get(mk_user_key(address))


def save_user(address: UInt160, user: User) -> bool:
    account_id: bytes = user.get_account_id()
    account_count: int = total_accounts()
    if account_id.to_int() > account_count:
        put(ACCOUNT_COUNT, account_id)

    put(mk_user_key(address), serialize(user))
    return True


def mk_user_key(address: UInt160) -> bytes:
    return ACCOUNT_PREFIX + address


def mk_token_index_key(account_id: bytes) -> bytes:
    return TOKEN_INDEX_PREFIX + account_id + b'_'


@public
def set_user_permissions(user: UInt160, permissions: Dict[str, bool]) -> bool:
    tx = cast(Transaction, script_container)
    invoking_user: User = get_user(tx.sender)
    assert invoking_user.get_set_permissions(), "User Permission Denied"

    impacted_user: User = get_user(user)
    x: bool = impacted_user.set_permissions(permissions)
    save_user(user, impacted_user)
    return x


@public
def set_current_epoch(epoch_id: bytes) -> bool:
    tx = cast(Transaction, script_container)
    user: User = get_user(tx.sender)
    assert user.get_set_epoch(), "User Permission Denied"
    put(CURRENT_EPOCH, epoch_id)
    return True


@public
def get_current_epoch() -> int:
    return get(CURRENT_EPOCH).to_int()


#############################
####### Puppet ###########
#############################
#############################

TOKEN_PREFIX = b't'


# A mapping for attribute modifiers which can be indexed by attribute "value"
ATTRIBUTE_MODIFIERS: List[int] = [
    -6,  # impossible to have a 0 map
    -5,  # 1
    -4, -4,  # 2-3
    -3, -3,  # 4-5
    -2, -2,  # 6-7
    -1, -1,  # 8-9
    0, 0,  # 10-11
    1, 1,  # 12-13
    2, 2,  # 14-15
    3, 3,  # 16-17
    4, 4,  # 18-19
    5, 5,  # 20-21
    6, 6,  # 22-23
    7, 7,  # 24-25
    8, 8,  # 26-27
    9, 9,  # 28-29
    10  # 30
]

# A set of options for a puppet hit die
HIT_DIE_OPTIONS: List[str] = ["d6", "d8", "d10", "d12"]


class Puppet:

    def __init__(self):
        self._token_id: bytes = b''
        self._epoch: bytes = b''
        self._charisma: int = 0
        self._constitution: int = 0
        self._dexterity: int = 0
        self._intelligence: int = 0
        self._strength: int = 0
        self._wisdom: int = 0
        self._hit_die: str = "d4"
        self._traits: Dict[str, Any] = {}
        self._owner: UInt160 = UInt160()

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            'attributes': {
                'charisma': self._charisma,
                'constitution': self._constitution,
                'dexterity': self._dexterity,
                'intelligence': self._intelligence,
                'strength': self._strength,
                'wisdom': self._wisdom,
            },
            'hitDie': self._hit_die,
            'owner': self._owner,
            'tokenId': self._token_id,
            'traits': self._traits,
            'epoch': self._epoch
        }
        return exported

    def generate(self, owner: UInt160, token_id: bytes) -> bool:
        """
        Generates a puppet's core features
        @return: boolean indicating success
        """
        # generate base attributes

        initial_roll_collection_id: int = 1
        charisma: int = Collection.sample_from_collection(initial_roll_collection_id).to_int()
        self._charisma = charisma

        constitution: int = Collection.sample_from_collection(initial_roll_collection_id).to_int()
        self._constitution = constitution

        dexterity: int = Collection.sample_from_collection(initial_roll_collection_id).to_int()
        self._dexterity = dexterity

        intelligence: int = Collection.sample_from_collection(initial_roll_collection_id).to_int()
        self._intelligence = intelligence

        strength: int = Collection.sample_from_collection(initial_roll_collection_id).to_int()
        self._strength = strength

        wisdom: int = Collection.sample_from_collection(initial_roll_collection_id).to_int()
        self._wisdom = wisdom

        hd: str = get_hit_die(Dice.rand_between(0, 3))
        self._hit_die = hd

        # mint traits
        epoch_id: int = get_current_epoch()
        epoch_id_bytes: bytes = epoch_id.to_bytes()
        debug(['epoch_id_bytes', epoch_id_bytes])
        traits: Dict[str, List] = Epoch.mint_from_epoch(epoch_id_bytes)
        self._traits = traits
        self._epoch = epoch_id_bytes

        # Generate a puppet token_id and set the owner
        self._owner = owner
        self._token_id = token_id

        return True

    def get_armor_class(self) -> int:
        """
        Gets the armor class for a puppet
        @return: an integer representing the base armor class of the puppet
        """
        dexterity: int = self.get_dexterity()
        return 10 + get_attribute_mod(dexterity)

    def get_charisma(self) -> int:
        """
        Getter for the charisma base attribute
        @return: integer range(3-18) representing the charisma of a puppet
        """
        return self._charisma

    def get_constitution(self) -> int:
        """
        Getter for the constitution base attribute
        @return: integer range(3-18) representing the constitution of a puppet
        """
        return self._constitution

    def get_dexterity(self) -> int:
        """
        Getter for the dexterity base attribute
        @return: integer range(3-18) representing the dexterity of a puppet
        """
        return self._dexterity

    def get_intelligence(self) -> int:
        """
        Getter for the intelligence base attribute
        @return: integer range(3-18) representing the intelligence of a puppet
        """
        return self._intelligence

    def get_owner(self) -> UInt160:
        """
        Getter for the puppet owner
        @return: bytes representing the owner of the puppet
        """
        return UInt160(self._owner)

    def get_state(self) -> Dict[str, Any]:
        """
        Gets the state of the puppet.  This differs from an export in that it includes all secondary features like
         armor class, name, and tokenURI.
        @return:
        """
        token_id_bytes: bytes = self._token_id
        token_id_int: int = token_id_bytes.to_int()
        token_id_string: str = itoa(token_id_int, 10)
        epoch_bytes: bytes = self._epoch
        epoch_int: int = epoch_bytes.to_int()
        exported: Dict[str, Any] = {
            'armorClass': self.get_armor_class(),
            'attributes': {
                'charisma': self.get_charisma(),
                'constitution': self.get_constitution(),
                'dexterity': self.get_dexterity(),
                'intelligence': self.get_intelligence(),
                'strength': self.get_strength(),
                'wisdom': self.get_wisdom(),
            },
            'hitDie': self._hit_die,
            'name': 'puppet',
            'owner': self._owner,
            'tokenId': token_id_int,
            'tokenURI': 'https://props.coz.io/puppets/' + token_id_string,
            'epoch': epoch_int,
            'traits': self._traits,
        }
        return exported

    def get_strength(self) -> int:
        """
        Getter for the strength base attribute
        @return: integer range(3-18) representing the strength of a puppet
        """
        return self._strength

    def get_token_id(self) -> bytes:
        """
        Getter for the puppet unique identifier
        @return: integer representing the unique identifier
        """
        return self._token_id

    def get_wisdom(self) -> int:
        """
        Getter for the wisdom base attribute
        @return: integer range(3-18) representing the wisdom of a puppet
        """
        return self._wisdom

    def load(self, abstract: Dict[str, Any]) -> bool:
        """
        Loads a puppet from a puppet abstract
        @param abstract: a puppet abstract json
        @return: a boolean indicating the success
        """
        attributes: Dict[str, int] = abstract['attributes']
        self._charisma: int = attributes['charisma']
        self._constitution: int = attributes['constitution']
        self._dexterity: int = attributes['dexterity']
        self._intelligence: int = attributes['intelligence']
        self._strength: int = attributes['strength']
        self._wisdom: int = attributes['wisdom']
        self._traits: [str] = abstract['traits']
        self._token_id: [int] = abstract['tokenId']
        self._owner: bytes = abstract['owner']
        return True

    def set_owner(self, owner: UInt160) -> bool:
        """
        Setter for the puppet owner
        @param owner: bytes representing the owner of the puppet
        @return: Boolean indicating success
        """
        self._owner = owner
        return True


@public
def get_attribute_mod(attribute_value: int) -> int:
    """
    Gets the attribute modifier for an attribute value.
    @param attribute_value: The attribute value to get the modifier for range(0-30)
    @return: An attribute modifier for use in mechanics.
    """
    return ATTRIBUTE_MODIFIERS[attribute_value]


def get_hit_die(roll: int) -> str:
    """
    Gets a string representation of a hit die when provided an input.
    @param roll: An index for the hit die range(0-3)
    @return:
    """
    return HIT_DIE_OPTIONS[roll]


@public
def get_puppet(token_id: bytes) -> Puppet:
    """
    A factory method to get a puppet from storage
    @param token_id: the unique identifier of the puppet
    @return: The requested puppet
    """
    puppet_bytes: bytes = get_puppet_raw(token_id)
    return cast(Puppet, deserialize(puppet_bytes))


@public
def get_puppet_json(token_id: bytes) -> Dict[str, Any]:
    """
    Gets a dict representation of the puppet's base stats
    @param token_id: the unique puppet identifier
    @return: A dict representing the puppet
    """
    puppet: Puppet = get_puppet(token_id)
    return puppet.get_state()


def get_puppet_raw(token_id: bytes) -> bytes:
    """
    Gets the serialized puppet definition
    @param token_id: the unique puppet identifier
    @return: a serialize puppet
    """
    return get(mk_token_key(token_id))


def save_puppet(puppet: Puppet) -> bool:
    """
    A factory method to persist a puppet to storage
    @param puppet: A puppet to save
    @return: A boolean representing the results of the save
    """
    token_id: bytes = puppet.get_token_id()
    put(mk_token_key(token_id), serialize(puppet))
    return True


def mk_token_key(token_id: bytes) -> bytes:
    return TOKEN_PREFIX + token_id

############INTERFACES###########
############INTERFACES###########
############INTERFACES###########


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


@contract('0x72909f1ef43a843f4b2169f2c577787d9e6994a8')
class Epoch:

    @staticmethod
    def mint_from_epoch(epoch_id: bytes) -> Dict[str, Any]:
        pass

