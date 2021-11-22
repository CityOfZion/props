from typing import Any, Dict, List, Union, cast, MutableSequence

from boa3.builtin import CreateNewEvent, NeoMetadata, metadata, public
from boa3.builtin.contract import Nep17TransferEvent, abort
from boa3.builtin.interop.blockchain import get_contract, Transaction
from boa3.builtin.interop.contract import call_contract, update_contract, GAS
from boa3.builtin.interop.runtime import check_witness, script_container, calling_script_hash
from boa3.builtin.interop.stdlib import serialize, deserialize
from boa3.builtin.interop.storage import delete, get, put, find, get_context
from boa3.builtin.interop.storage.findoptions import FindOptions
from boa3.builtin.interop.iterator import Iterator
from boa3.builtin.type import UInt160
from boa3.builtin.interop.runtime import get_network
from boa3.builtin.interop.runtime import get_random


# TODO: Mint security
# TODO: Change tokensOf to an iterator
# TODO: Update Authorization
# TODO: Add derived named field the Character class
# TODO: Align docstring
# TODO: Split out dice into separate contract
# TODO: update onNEP17 payment to support other scripthashes
# TODO: Offline Minting
# TODO: variable payments
# TODO: titles
# TODO: fix TOKEN_COUNT (it isnt persisting to storage)
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

MINT_COST: int = 100000000 # GAS

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
    return get(TOKEN_COUNT).to_int()


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
    return len(user.get_owned_tokens())


@public
def tokensOf(owner: UInt160) -> [bytes]:
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

    character: Character = get_character(token_id)
    token_owner: UInt160 = character.get_owner()
    formatted_token_id: bytes = character.get_token_id()
    if not check_witness(token_owner):
        return False

    owner_user: User = get_user(token_owner)
    to_user: User = get_user(to)

    if token_owner != to:

        x: bool = owner_user.remove_owned_token(formatted_token_id)
        x = to_user.add_owned_token(formatted_token_id)

        save_user(token_owner, owner_user)
        save_user(to, to_user)

        x = character.set_owner(to)
        save_character(character)

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
    character: Character = get_character(token_id)
    owner = character.get_owner()
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
    character_json = get_character_json(token_id)
    assert len(character_json) != 0, 'Character does not exist'

    return character_json


@public
def deploy(data: Any, upgrade: bool) -> bool:
    """
    The contracts initial entry point, on deployment.
    """
    if upgrade:
        return False

    if get(DEPLOYED).to_bool():
        return False

    tx = cast(Transaction, script_container)
    owner: UInt160 = tx.sender
    network = get_network()
    # DEBUG_START
    # custom owner for tests, ugly hack, because TestEnginge sets an unkown tx.sender...
    if data is not None and network == 860833102:
        new_owner = cast(UInt160, data)
        internal_deploy(new_owner)
        return True

    if data is None and network == 860833102:
        return True
    # DEBUG_END
    internal_deploy(owner)
    return True


def internal_deploy(owner: UInt160) -> bool:
    put(DEPLOYED, True)
    put(TOKEN_COUNT, 0)

    user: User = User()
    x: bool = user.set_contract_upgrade(True)
    x = user.set_offline_mint(True)
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

    debug(['onNEP17Payment!: ', from_address, calling_script_hash, GAS, amount, MINT_COST])
    if calling_script_hash == GAS and amount == MINT_COST:
        debug(['minting!'])
        internal_mint(from_address)
    else:
        abort()


# -------------------------------------------
# Methods
# -------------------------------------------


@public
def mint(account: UInt160) -> bytes:
    """
    Mint new token.

    :param account: the address of the account that is minting token
    :type account: UInt160
    :param meta: the metadata to use for this token
    :type meta: bytes
    :param data: whatever data is pertinent to the mint method
    :type data: Any
    :return: token_id of the token minted
    """

    # TODO_TEMPLATE: add own logic if necessary, or uncomment below to restrict minting to contract authorized addresses
    # assert verify(), '`acccount` is not allowed to mint'
    assert check_witness(account), "Invalid witness"

    return internal_mint(account)


@public
def getAuthorizedAddresses() -> list[UInt160]:
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


def internal_mint(owner: UInt160) -> bytes:
    """
    Mint new token - internal

    :param owner: the address of the account that is minting token
    :type owner: UInt160
    :return: token_id of the token minted
    """
    new_character: Character = Character()
    x: bool = new_character.generate(owner)
    save_character(new_character)
    token_id: bytes = new_character.get_token_id()
    put(TOKEN_COUNT, token_id)

    user: User = get_user(owner)
    x = user.add_owned_token(token_id)
    save_user(owner, user)

    post_transfer(None, owner, token_id, None)
    return token_id


#############################
#############################

ACCOUNT_PREFIX = b'a'


class User:

    def __init__(self):
        self._owned_tokens: [bytes] = []
        self._offline_mint: bool = False
        self._contract_upgrade: bool = False

    def get_owned_tokens(self) -> [bytes]:
        return self._owned_tokens

    def add_owned_token(self, token_id: bytes) -> bool:
        owned_tokens: [bytes] = self._owned_tokens
        owned_tokens.append(token_id)
        self._owned_tokens = owned_tokens
        return True

    def remove_owned_token(self, token_id: bytes) -> bool:
        owned_tokens: [bytes] = self._owned_tokens
        owned_tokens.remove(token_id)
        self._owned_tokens = owned_tokens
        return True

    def get_offline_mint(self) -> bool:
        return self._offline_mint

    def set_offline_mint(self, value: bool) -> bool:
        self._offline_mint = value
        return True

    def get_contract_upgrade(self) -> bool:
        return self._contract_upgrade

    def set_contract_upgrade(self, value: bool) -> bool:
        self._contract_upgrade = value
        return True


def get_user(address: UInt160) -> User:
    user_bytes: bytes = get_user_raw(address)
    if len(user_bytes) != 0:
        return cast(User, deserialize(user_bytes))
    return User()


def get_user_raw(address: UInt160) -> bytes:
    return get(mk_user_key(address))


def save_user(address: UInt160, user: User) -> bool:
    put(mk_user_key(address), serialize(user))
    return True


def mk_user_key(address: UInt160) -> bytes:
    return ACCOUNT_PREFIX + address


#############################
####### Character ###########
#############################
#############################

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

# A set of options for a character hit die
HIT_DIE_OPTIONS: List[str] = ["d6","d8","d10","d12"]

TOKEN_PREFIX = b't'


class Character:

    def __init__(self):
        self._token_id: bytes = b''
        self._charisma: int = 0
        self._constitution: int = 0
        self._dexterity: int = 0
        self._intelligence: int = 0
        self._strength: int = 0
        self._wisdom: int = 0
        self._hit_die: str = "d4"
        self._features: [str] = []
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
            'hit_die': self._hit_die,
            'features': self._features,
            'token_id': self._token_id,
            'owner': self._owner
        }
        return exported

    def generate(self, owner: UInt160) -> bool:
        """
        Generates a character's core features
        @return: boolean indicating success
        """
        entropy: bytes = get_random().to_bytes()

        # generate base attributes
        self._charisma = roll_initial_stat_with_entropy(entropy[0:2])
        self._constitution = roll_initial_stat_with_entropy(entropy[2:4])
        self._dexterity = roll_initial_stat_with_entropy(entropy[4:6])
        self._intelligence = roll_initial_stat_with_entropy(entropy[6:8])
        self._strength = roll_initial_stat_with_entropy(entropy[8:10])
        self._wisdom = roll_initial_stat_with_entropy(entropy[10:12])
        self._hit_die = get_hit_die(roll_dice_with_entropy("d4", 1, entropy[12].to_bytes())[0] - 1)

        # Generate a character token_id and set the owner
        self._owner = owner
        self._token_id = (totalSupply() + 1).to_bytes()

        return True

    def get_armor_class(self) -> int:
        """
        Gets the armor class for a character
        @return: an integer representing the base armor class of the character
        """
        dexterity: int = self.get_dexterity()
        return 10 + get_attribute_mod(dexterity)

    def get_charisma(self) -> int:
        """
        Getter for the charisma base attribute
        @return: integer range(3-18) representing the charisma of a character
        """
        return self._charisma

    def get_constitution(self) -> int:
        """
        Getter for the constitution base attribute
        @return: integer range(3-18) representing the constitution of a character
        """
        return self._constitution

    def get_dexterity(self) -> int:
        """
        Getter for the dexterity base attribute
        @return: integer range(3-18) representing the dexterity of a character
        """
        return self._dexterity

    def get_intelligence(self) -> int:
        """
        Getter for the intelligence base attribute
        @return: integer range(3-18) representing the intelligence of a character
        """
        return self._intelligence

    def get_owner(self) -> UInt160:
        """
        Getter for the character owner
        @return: bytes representing the owner of the character
        """
        return UInt160(self._owner)

    def get_state(self) -> Dict[str, Any]:
        """
        Gets the state of the character.  This differs from an export in that it includes all secondary features like
        proficiency bonus and armor class.  Attributes may also differ from the core attributes depending
        on a character's situation.
        @return:
        """
        exported: Dict[str, Any] = {
            'attributes': {
                'charisma': self.get_charisma(),
                'constitution': self.get_constitution(),
                'dexterity': self.get_dexterity(),
                'intelligence': self.get_intelligence(),
                'strength': self.get_strength(),
                'wisdom': self.get_wisdom(),
            },
            'armorClass': self.get_armor_class(),
            'hitDie': self._hit_die,
            'token_id': self._token_id,
            'features': self._features,
            'owner': self._owner
        }
        return exported

    def get_strength(self) -> int:
        """
        Getter for the strength base attribute
        @return: integer range(3-18) representing the strength of a character
        """
        return self._strength

    def get_token_id(self) -> bytes:
        """
        Getter for the character unique identifier
        @return: integer representing the unique identifier
        """
        return self._token_id

    def get_wisdom(self) -> int:
        """
        Getter for the wisdom base attribute
        @return: integer range(3-18) representing the wisdom of a character
        """
        return self._wisdom

    def load(self, abstract: Dict[str, Any]) -> bool:
        """
        Loads a character from a character abstract
        @param abstract: a character abstract json
        @return: a boolean indicating the success
        """
        attributes: Dict[str, int] = abstract['attributes']
        self._charisma: int = attributes['charisma']
        self._constitution: int = attributes['constitution']
        self._dexterity: int = attributes['dexterity']
        self._intelligence: int = attributes['intelligence']
        self._strength: int = attributes['strength']
        self._wisdom: int = attributes['wisdom']
        self._features: [str] = abstract['features']
        self._token_id: [int] = abstract['token_id']
        self._owner: bytes = abstract['owner']
        return True

    def set_owner(self, owner: UInt160) -> bool:
        """
        Setter for the character owner
        @param owner: bytes representing the owner of the character
        @return: Boolean indicating success
        """
        self._owner = owner
        return True


def get_character(token_id: bytes) -> Character:
    """
    A factory method to get a character from storage
    @param token_id: the unique identifier of the character
    @return: The requested character
    """
    character_bytes: bytes = get_character_raw(token_id)
    return cast(Character, deserialize(character_bytes))


def get_character_json(token_id: bytes) -> Dict[str, Any]:
    """
    Gets a dict representation of the character's base stats
    @param token_id: the unique character identifier
    @return: A dict representing the character
    """
    character: Character = get_character(token_id)
    return character.export()


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
def get_character_raw(token_id: bytes) -> bytes:
    """
    Gets the serialized character definition
    @param token_id: the unique character identifier
    @return: a serialize character
    """
    return get(mk_token_key(token_id))


def save_character(character: Character) -> bool:
    """
    A factory method to persist a character to storage
    @param character: A character to save
    @return: A boolean representing the results of the save
    """
    token_id: bytes = character.get_token_id()
    put(mk_token_key(token_id), serialize(character))
    return True


def mk_token_key(token_id: bytes) -> bytes:
    return TOKEN_PREFIX + token_id

#############################
#######Dice##################
#############################
#############################

# A discrete representation of the distribution representing 4d6 drop one for indexing using a halfword.
INITIAL_STAT_PROBABILITY = [3, 4, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                            8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10,
                            10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
                            10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
                            11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
                            11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
                            12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13,
                            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
                            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14,
                            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
                            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15,
                            15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                            15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
                            16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18,
                            18, 18, 18, 18]

MAX_INT = [
    0,
    128,
    32768,
    8388608,
    2147483648
]

ENTROPY_MAP: Dict[
    str,
    Dict[str, int]
] = {
    'd4': {
        'min_entropy': 1,
        'num_scalar': 4,
    },
    'd6': {
        'min_entropy': 1,
        'num_scalar': 6,
    },
    'd8': {
        'min_entropy': 1,
        'num_scalar': 8,
    },
    'd10': {
        'min_entropy': 1,
        'num_scalar': 10,
    },
    'd12': {
        'min_entropy': 1,
        'num_scalar': 12,
    },
    'd20': {
        'min_entropy': 1,
        'num_scalar': 20,
    },
    'd100': {
        'min_entropy': 1,
        'num_scalar': 100,
    },
    'd1000': {
        'min_entropy': 2,
        'num_scalar': 1000,
    },
    'd10000': {
        'min_entropy': 2,
        'num_scalar': 10000,
    }
}

@public
def roll_die(die: str) -> int:
    """
    Rolls a requested die and returns the result.
    @param die: a string indicating the die format in "dX" format (i.e d10)
    @return: The integer result of the roll.
    """
    constants = ENTROPY_MAP[die]
    entropy: bytes = get_random().to_bytes()

    return roll_dice_with_entropy(die, constants['min_entropy'], entropy[:constants['min_entropy']])[0]


@public
def roll_dice_with_entropy(die: str, precision: int, entropy: bytes) -> [int]:
    """
    A deterministic conversation of entropy into dice rolls.
    @param precision: a byte length to use in each roll
    @param die: A dX formatted string representing the dice to roll range(d4-d1000)
    @param entropy: 4-bytes of entropy to use for the dice roll
    @return: an array of integer dice rolls.  The length is floor( len(entropy)/precision )
    """
    constants: Dict[str, int] = ENTROPY_MAP[die]
    entropy_length = len(entropy)

    assert entropy_length >= constants['min_entropy'], "Not enough entropy"

    rolls: [int] = []
    roll: int
    for i in range(entropy_length // precision):
        e = entropy[i * precision : (i + 1) * precision]
        numerator: int = constants['num_scalar'] * MAX_INT[precision] * abs(e.to_int())
        denominator: int = MAX_INT[precision] ** 2
        roll = numerator // denominator + 1
        rolls.append(roll)
    return rolls


@public
def roll_initial_stat() -> int:
    """
    Generates a new initial attribute stat using a roll 4d6 and drop the lowest mechanic. We use a discrete distribution
    to make this computationally cheap.
    :return: Returns an integer representing an initial character stat range(3-18)
    """
    entropy: bytes = get_random().to_bytes()[:2]
    return roll_initial_stat_with_entropy(entropy)


@public
def roll_initial_stat_with_entropy(entropy: bytes) -> int:
    """
    Rolls an initial attribute using existing entropy
    @param entropy: 2 bytes of entropy
    @return: an integer representing initial stats
    """
    return INITIAL_STAT_PROBABILITY[entropy.to_int() // 100]
