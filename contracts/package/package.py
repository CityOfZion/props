from typing import Any, Dict, List, Union, cast, Optional
from boa3.builtin import contract, CreateNewEvent, NeoMetadata, metadata, public
from boa3.builtin.contract import abort
from boa3.builtin.interop.blockchain import get_contract, Transaction
from boa3.builtin.interop.contract import call_contract, update_contract, GAS
from boa3.builtin.interop.runtime import get_random, get_network, burn_gas, gas_left, check_witness, script_container, calling_script_hash, entry_script_hash, executing_script_hash
from boa3.builtin.interop.stdlib import serialize, deserialize, itoa
from boa3.builtin.interop.storage import delete, get, put, find, get_context
from boa3.builtin.interop.storage.findoptions import FindOptions
from boa3.builtin.interop.iterator import Iterator
from boa3.builtin.type import UInt160, ByteString

# -------------------------------------------
# METADATA
# -------------------------------------------


@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.author = 'COZ, Inc.'
    meta.description = 'A package containing something'
    meta.email = 'contact@coz.io'
    meta.supported_standards = ['NEP-11']
    return meta


# -------------------------------------------
# TOKEN SETTINGS
# -------------------------------------------

# Symbol of the Token
TOKEN_SYMBOL = 'PACKAGE'

# Number of decimal places
TOKEN_DECIMALS = 0

# -------------------------------------------
# Keys
# -------------------------------------------

# Stores the total token count
TOKEN_COUNT: bytes = b'!TOKEN_COUNT'

# Epoch count
EPOCH_COUNT: bytes = b'EPOCH_COUNT'

# Stores the total account count
ACCOUNT_COUNT: bytes = b'!ACCOUNT_COUNT'

# -------------------------------------------
# Events
# -------------------------------------------

on_transfer = CreateNewEvent(
    # trigger when tokens are transferred, including zero value transfers.
    [
        ('from_addr', Union[UInt160, None]),
        ('to_addr', Union[UInt160, None]),
        ('amount', int),
        ('token_id', ByteString)
    ],
    'Transfer'
)

# -------------------------------------------
# NEP-11 Methods
# -------------------------------------------


@public(safe=True)
def symbol() -> str:
    """
    Gets the symbols of the token.

    This string must be valid ASCII, must not contain whitespace or control puppets, should be limited to uppercase
    Latin alphabet (i.e. the 26 letters used in English) and should be short (3-8 puppets is recommended).
    This method must always return the same value every time it is invoked.

    :return: a short string representing symbol of the token managed in this contract.
    """
    return TOKEN_SYMBOL


@public(safe=True)
def decimals() -> int:
    """
    Gets the amount of decimals used by the token.

    E.g. 8, means to divide the token amount by 100,000,000 (10 ^ 8) to get its user representation.
    This method must always return the same value every time it is invoked.

    :return: the number of decimals used by the token.
    """
    return TOKEN_DECIMALS


@public(safe=True)
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


@public(safe=True)
def balanceOf(owner: UInt160) -> int:
    """
    Get the current balance of an address

    The parameter owner must be a 20-byte address represented by a UInt160.

    :param owner: the owner address to retrieve the balance for
    :type owner: UInt160
    :return: the total amount of tokens owned by the specified address.
    :raise AssertionError: raised if `owner` length is not 20.
    """
    assert len(owner) == 20, 'Incorrect `owner` length'
    user: User = get_user(owner)
    return user.get_balance_of()


@public(safe=True)
def tokensOf(owner: UInt160) -> Iterator:
    """
    Get all of the token ids owned by the specified address

    The parameter owner must be a 20-byte address represented by a UInt160.

    :param owner: the owner address to retrieve the tokens for
    :type owner: UInt160
    :return: an iterator that contains all of the token ids owned by the specified address.
    :raise AssertionError: raised if `owner` length is not 20.
    """
    assert len(owner) == 20, 'Incorrect `owner` length'
    user: User = get_user(owner)
    return user.get_owned_tokens()


@public
def transfer(to: UInt160, token_id: ByteString, data: Any) -> bool:
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
    assert len(to) == 20, 'Incorrect `to` length'

    token: Token = get_token(cast(bytes, token_id))
    token_owner: UInt160 = token.get_owner()
    formatted_token_id: bytes = token.get_token_id()
    if not check_witness(token_owner):
        return False

    owner_user: User = get_user(token_owner)
    to_user: User = get_user(to)

    if token_owner != to:

        owner_user.remove_owned_token(formatted_token_id)
        to_user.add_owned_token(formatted_token_id)

        save_user(token_owner, owner_user)
        save_user(to, to_user)

        token.set_owner(to)
        save_token(token)

    post_transfer(token_owner, to, token_id, data)
    return True


def post_transfer(token_owner: Union[UInt160, None], to: Union[UInt160, None], token_id: ByteString, data: Any):
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


@public(safe=True)
def ownerOf(token_id: ByteString) -> UInt160:
    """
    Get the owner of the specified token.

    The parameter token_id SHOULD be a valid NFT. If not, this method SHOULD throw an exception.

    :param token_id: the token for which to check the ownership
    :type token_id: ByteString
    :return: the owner of the specified token.
    :raise AssertionError: raised if `token_id` is not a valid NFT.
    """
    token: Token = get_token(token_id)
    owner = token.get_owner()
    return owner


@public(safe=True)
def tokens() -> Iterator:
    """
    Get all tokens minted by the contract

    :return: an iterator that contains all of the tokens minted by the contract.
    """
    flags = FindOptions.REMOVE_PREFIX
    context = get_context()
    return find(TOKEN_PREFIX, context, flags)


@public(safe=True)
def properties(tokenId: ByteString) -> Dict[Any, Any]:
    """
    Get the properties of a token.

    The parameter token_id SHOULD be a valid NFT. If no metadata is found (invalid token_id), an exception is thrown.

    :param token_id: the token for which to check the properties
    :type token_id: ByteString
    :return: a serialized NVM object containing the properties for the given NFT.
    :raise AssertionError: raised if `token_id` is not a valid NFT, or if no metadata available.
    """
    token_json = get_token_json_flat(tokenId)
    assert len(token_json) != 0, 'Token does not exist'

    return token_json


@public
def _deploy(data: Any, update: bool):
    """
    Executes the deploy event by creating the initial contract state and admin account
    :param owner: The initial admin of of the smart contract
    :return: a boolean indicating success
    """

    if not update:
        put(TOKEN_COUNT, 0)
        put(ACCOUNT_COUNT, 1)

        super_user_permissions: Dict[str, bool] = {
            'offline_mint': True,
            'contract_upgrade': True,
            'set_mint_fee': True,
            'create_epoch': True,
            'set_permissions': True
        }

        tx = cast(Transaction, script_container)
        owner: UInt160 = tx.sender

        user: User = User()
        user.set_permissions(super_user_permissions)
        save_user(owner, user)


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
def offline_mint(epoch_id: bytes, account: UInt160) -> bytes:
    """
    mints a token from an epoch
    :param account: the account to mint to
    :return: the token_id of the minted token
    :raise AssertionError: raised if the signer does not have `offline_mint` permission.
    """
    tx = cast(Transaction, script_container)
    user: User = get_user(tx.sender)
    assert user.get_offline_mint(), 'User Permission Denied'
    return internal_mint(epoch_id, account)


@public
def update(script: bytes, manifest: bytes, data: Any):
    """
    Upgrade the contract.

    :param script: the contract script
    :type script: bytes
    :param manifest: the contract manifest
    :type manifest: bytes
    :raise AssertionError: raised if the signer does not have the 'update' permission
    """
    tx = cast(Transaction, script_container)
    user: User = get_user(tx.sender)
    assert user.get_contract_upgrade(), 'User Permission Denied'

    update_contract(script, manifest, data)


@public
def set_mint_fee(epoch_id: bytes, amount: int) -> bool:
    """
    Updates the mint fee for a puppet
    :param epoch_id: the id of the epoch to set the mint fee for
    :param amount: the GAS cost to charge for the minting of a puppet
    :raise AssertionError: raised if the signer does not have the 'offline_mint' permission
    :return: A boolean indicating success
    """
    tx = cast(Transaction, script_container)
    user: User = get_user(tx.sender)
    assert user.get_set_mint_fee(), "User Permission Denied"

    epoch: Epoch = get_epoch(epoch_id)
    epoch.set_fee(amount)
    save_epoch(epoch)

    return True


def internal_mint(epoch_id: bytes, owner: UInt160) -> bytes:
    """
    Mint new token - internal

    :param epoch_id: the epoch id to mint from
    :param owner: the address of the account that is minting token
    :type owner: UInt160
    :return: token_id of the token minted
    """

    # remaining GAS before branching code
    start_gas: int = gas_left

    mint_epoch: Epoch = get_epoch(epoch_id)
    assert mint_epoch.can_mint(), 'No available tokens to mint in the selected epoch'

    mint_epoch.increment_supply()
    save_epoch(mint_epoch)

    token_id_int: int = (totalSupply() + 1)
    token_id_string: bytes = itoa(token_id_int)
    new_token: Token = Token()
    new_token.generate(owner, token_id_string, epoch_id)

    save_token(new_token)
    put(TOKEN_COUNT, token_id_int)

    user: User = get_user(owner)
    user.add_owned_token(token_id_string)
    save_user(owner, user)

    post_transfer(None, owner, token_id_string, None)

    end_gas: int = gas_left
    compute_cost: int = start_gas - end_gas
    epoch_system_fee: int = mint_epoch.get_sys_fee()
    burn_amount: int = epoch_system_fee - compute_cost

    burn_gas(burn_amount)

    return token_id_string


# #############################
# ########### User ############
# #############################


ACCOUNT_PREFIX = b'a'
TOKEN_INDEX_PREFIX = b'i'


class User:

    def __init__(self):
        self._balance: int = 0
        self._permissions: Dict[str, bool] = {
            'offline_mint': False,
            'contract_upgrade': False,
            'set_mint_fee': False,
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


@public
def get_user_json(address: UInt160) -> Dict[str, Any]:
    """
    Gets the JSON representation of a user account
    :param address: The address being requested
    :return: A Dict representing the user
    """
    user: User = get_user(address)
    return user.export()

@public
def get_user(address: UInt160) -> User:
    """
    Gets a User instance
    :param address: The address being requested
    :return: The User instance for the requested address
    """
    user_bytes: bytes = get_user_raw(address)
    if len(user_bytes) != 0:
        return cast(User, deserialize(user_bytes))

    return User()


def get_user_raw(address: UInt160) -> bytes:
    return get(mk_user_key(address))


def save_user(address: UInt160, user: User) -> bool:
    """
    Saves a user instance
    :param address: The address to save the user against
    :param user: the User instance being saved
    :return: A bool indicating completion
    """
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
    """
    Sets a user's permissions
    :param user: The address of the user to edit
    :param permissions: A dictionary representing the permissions to update
    :return: a boolean indicating success
    """
    tx = cast(Transaction, script_container)
    invoking_user: User = get_user(tx.sender)
    assert invoking_user.get_set_permissions(), 'User Permission Denied'

    impacted_user: User = get_user(user)
    impacted_user.set_permissions(permissions)
    save_user(user, impacted_user)
    return True


# #############################
# ########## Epoch ############
# #############################
# #############################


EPOCH_PREFIX = b'e'


class Epoch:
    def __init__(self, label: bytes, generator_instance_id: bytes, chest_id: int, mint_fee: int, sys_fee: int, max_supply: int, author: UInt160):
        self._author: UInt160 = author
        self._label: bytes = label
        self._epoch_id: bytes = (total_epochs() + 1).to_bytes()
        self._generator_instance_id: bytes = generator_instance_id
        self._chest_id: int = chest_id
        self._mint_fee: int = mint_fee
        self._sys_fee: int = sys_fee
        self._max_supply: int = max_supply
        self._total_supply: int = 0

    def can_mint(self) -> bool:
        return self._max_supply > self.get_total_supply()

    def get_id(self) -> bytes:
        return self._epoch_id

    def get_author(self) -> UInt160:
        return self._author

    def get_generator_instance_id(self) -> bytes:
        return self._generator_instance_id

    def get_chest_id(self) -> int:
        return self._chest_id

    def get_label(self) -> bytes:
        return self._label

    def get_mint_fee(self) -> int:
        return self._mint_fee

    def get_sys_fee(self) -> int:
        return self._sys_fee

    def get_max_supply(self) -> int:
        return self._max_supply

    def get_total_supply(self) -> int:
        return self._total_supply

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            'author': self._author,
            'label': self._label,
            'epochId': self._epoch_id,
            'generatorInstanceId': self._generator_instance_id,
            'chest_id': self._chest_id,
            'mintFee': self._mint_fee,
            'sysFee': self._sys_fee,
            'maxSupply': self._max_supply,
            'totalSupply': self.get_total_supply()
        }
        return exported

    def increment_supply(self) -> int:
        self._total_supply = self._total_supply + 1
        return self._total_supply

    def set_fee(self, new_fee: int) -> bool:
        self._mint_fee = new_fee
        return True


@public
def create_epoch(label: bytes, generator_instance_id: bytes,  chest_id: int, mint_fee: int, sys_fee: int, max_supply: int) -> int:
    tx = cast(Transaction, script_container)
    author: UInt160 = tx.sender

    user: User = get_user(author)
    assert user.get_create_epoch(), 'User Permission Denied'

    new_epoch: Epoch = Epoch(label, generator_instance_id, chest_id, mint_fee, sys_fee, max_supply, author)
    epoch_id: bytes = new_epoch.get_id()
    epoch_id_int: int = epoch_id.to_int()

    save_epoch(new_epoch)
    put(EPOCH_COUNT, epoch_id)
    return epoch_id_int


@public
def get_epoch_json(epoch_id: bytes) -> Dict[str, Any]:
    epoch: Epoch = get_epoch(epoch_id)
    return epoch.export()


@public
def get_epoch(epoch_id: bytes) -> Epoch:
    epoch_bytes: bytes = get_epoch_raw(epoch_id)
    return cast(Epoch, deserialize(epoch_bytes))


def get_epoch_raw(epoch_id: bytes) -> bytes:
    return get(mk_epoch_key(epoch_id))


@public
def total_epochs() -> int:
    """
    Gets the total epoch count.  No

    Epoch id is an incrementor so users can iterator from 1 - total_epochs() to dump every epoch on the contract.

    :return: the total token epochs deployed in the system.
    """
    total: bytes = get(EPOCH_COUNT)
    if len(total) == 0:
        return 0
    return total.to_int()


def save_epoch(epoch: Epoch) -> bool:
    epoch_id: bytes = epoch.get_id()
    put(mk_epoch_key(epoch_id), serialize(epoch))
    return True


def mk_epoch_key(epoch_id: bytes) -> bytes:
    return EPOCH_PREFIX + epoch_id


# #############################
# ########## PACKAGE ###########
# #############################
# #############################


TOKEN_PREFIX = b't'

class Token:

    def __init__(self):
        self._token_id: bytes = b''
        self._epoch_token_id: int = 0
        self._epoch_id: bytes = b''
        self._traits: Dict[str, Any] = {}
        self._owner: UInt160 = UInt160()
        self._seed: bytes = b''

    def export(self) -> Dict[str, Any]:
        exported: Dict[str, Any] = {
            'owner': self._owner,
            'tokenId': self._token_id,
            'traits': self._traits,
            'epochId': self._epoch_id,
            'epochTokenId': self._epoch_token_id
        }
        return exported

    def generate(self, owner: UInt160, token_id: bytes, epoch_id: bytes) -> bool:
        """
        Generates a puppet's core features
        @return: boolean indicating success
        """
        # generate base attributes
        target_epoch: Epoch = get_epoch(epoch_id)

        # mint traits
        instance_id_bytes: bytes = target_epoch.get_generator_instance_id()
        traits: Dict[str, Any] = Generator.mint_from_instance(epoch_id, instance_id_bytes)

        self._traits = traits
        self._epoch_id = epoch_id

        # Generate a puppet token_id and set the owner
        self._owner = owner
        self._token_id = token_id
        self._epoch_token_id = target_epoch.get_total_supply()

        # Generate a seed for external use and future scalability
        entropy: bytes = get_random().to_bytes()
        pruned_entropy: bytes = entropy[0:16]
        self._seed = pruned_entropy

        return True

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
        epoch_token_id_int: int = self._epoch_token_id
        epoch_id_bytes: bytes = self._epoch_id

        epoch_id_int: int = epoch_id_bytes.to_int()
        epoch: Epoch = get_epoch(epoch_id_bytes)
        epoch_label: bytes = epoch.get_label()
        epoch_chest_id: int = epoch.get_chest_id()
        epoch_max_supply: int = epoch.get_max_supply()

        network_magic: int = get_network
        network_magic_string: str = itoa(network_magic)

        state: str = 'opened'
        # prevent infinite loop by only allowing entries to call for eligibility
        if entry_script_hash == calling_script_hash:
            eligibility: bool = Chest.is_eligible(epoch_chest_id, executing_script_hash, self.get_token_id())
            if eligibility:
                state = 'closed'

        exported: Dict[str, Any] = {
            'description': state + ' package',
            'epochId': epoch_id_int,
            'image': 'https://props.coz.io/img/package/neo/' + state + '.png',
            'name': 'package',
            'owner': self._owner,
            'seed': self._seed,
            'state': state,
            'tokenId': token_id_bytes.to_str(),
            'tokenURI': 'https://props.coz.io/tok/package/neo/' + network_magic_string + '/' + token_id_bytes.to_str(),
            'traits': self._traits,
        }
        return exported

    def get_state_flat(self) -> Dict[str, Any]:
        """
        Gets the state of the puppet and returns the data in a flat format.
        :return: the puppet in a flat format
        """
        token_id_bytes: bytes = self._token_id
        epoch_token_id_int: int = self._epoch_token_id
        epoch_id_bytes: bytes = self._epoch_id

        epoch_id_int: int = epoch_id_bytes.to_int()
        epoch: Epoch = get_epoch(epoch_id_bytes)
        epoch_label: bytes = epoch.get_label()
        epoch_chest_id: int = epoch.get_chest_id()
        epoch_max_supply: int = epoch.get_max_supply()

        network_magic: int = get_network
        network_magic_string: str = itoa(network_magic)

        token_attrs: List[Any] = [
            {
                'trait_type': 'epochId',
                'value': epoch_id_int
            },
        ]

        traits: Dict[str, Any] = self._traits
        for trait in traits.keys():
            token_attrs.append(
                {
                    'trait_type': 'traits.' + trait,
                    'value': traits[trait]
                }
            )

        state: str = 'opened'
        # prevent infinite loop by only allowing entries to call for eligibility
        if entry_script_hash == calling_script_hash:
            eligibility: bool = Chest.is_eligible(epoch_chest_id, executing_script_hash, self.get_token_id())
            if eligibility:
                state = 'closed'

        token_attrs.append(
            {
                'trait_type': 'state',
                'value': state
            })


        exported: Dict[str, Any] = {
            'name': 'package',
            'image': 'https://props.coz.io/img/package/neo/' + state + '.png',
            'tokenURI': 'https://props.coz.io/tok/package/neo/' + network_magic_string + '/' + token_id_bytes.to_str(),
            'owner': self._owner,
            'seed': self._seed,
            'tokenId': token_id_bytes.to_str(),
            'description': state + ' package',
            'attributes': token_attrs
        }
        return exported

    def get_token_id(self) -> bytes:
        """
        Getter for the puppet unique identifier
        @return: integer representing the unique identifier
        """
        return self._token_id

    def load(self, abstract: Dict[str, Any]) -> bool:
        """
        Loads a puppet from a puppet abstract
        @param abstract: a puppet abstract json
        @return: a boolean indicating the success
        """
        attributes: Dict[str, int] = abstract['attributes']
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
def get_token(token_id: ByteString) -> Token:
    """
    A factory method to get a puppet from storage
    :param token_id: the unique identifier of the puppet
    :return: The requested puppet
    """
    token_bytes: bytes = get_token_raw(cast(bytes, token_id))
    return cast(Token, deserialize(token_bytes))


@public
def get_token_json(token_id: bytes) -> Dict[str, Any]:
    """
    Gets a dict representation of the puppet's base stats
    :param token_id: the unique puppet identifier
    :return: A dict representing the puppet
    """
    token: Token = get_token(cast(bytes, token_id))
    return token.get_state()


@public
def get_token_json_flat(token_id: ByteString) -> Dict[str, Any]:
    token: Token = get_token(cast(bytes, token_id))
    return token.get_state_flat()


def get_token_raw(token_id: bytes) -> bytes:
    """
    Gets the serialized puppet definition
    :param token_id: the unique puppet identifier
    :return: a serialize puppet
    """
    return get(mk_token_key(token_id))


def save_token(token: Token) -> bool:
    """
    A factory method to persist a puppet to storage
    :param puppet: A puppet to save
    :return: A boolean representing the results of the save
    """
    token_id: bytes = token.get_token_id()
    put(mk_token_key(token_id), serialize(token))
    return True


def mk_token_key(token_id: bytes) -> bytes:
    return TOKEN_PREFIX + token_id


# ############INTERFACES###########
# ############INTERFACES###########
# ############INTERFACES###########

@contract('0x9378d9f8add6e1d47e7af4d75c121a11a5e9f929')
class Chest:

    @staticmethod
    def is_eligible(chest_id: int, script_hash: UInt160, token_id: bytes) -> bool:
        pass

@contract('0x4380f2c1de98bb267d3ea821897ec571a04fe3e0')
class Dice:

    @staticmethod
    def rand_between(start: int, end: int) -> int:
        pass


@contract('0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9')
class Generator:

    @staticmethod
    def mint_from_instance(from_code: bytes, to_instance_id: bytes) -> Dict[str, Any]:
        pass
