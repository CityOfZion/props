---
sidebar_label: puppet
title: puppet.puppet
---

#### manifest\_metadata

```python
@metadata
def manifest_metadata() -> NeoMetadata
```

Defines this smart contract&#x27;s metadata information

#### symbol

```python
@public(safe=True)
def symbol() -> str
```

Gets the symbols of the token.

This string must be valid ASCII, must not contain whitespace or control puppets, should be limited to uppercase
Latin alphabet (i.e. the 26 letters used in English) and should be short (3-8 puppets is recommended).
This method must always return the same value every time it is invoked.

**Returns**:

a short string representing symbol of the token managed in this contract.

#### decimals

```python
@public(safe=True)
def decimals() -> int
```

Gets the amount of decimals used by the token.

E.g. 8, means to divide the token amount by 100,000,000 (10 ^ 8) to get its user representation.
This method must always return the same value every time it is invoked.

**Returns**:

the number of decimals used by the token.

#### totalSupply

```python
@public(safe=True)
def totalSupply() -> int
```

Gets the total token supply deployed in the system.

This number must not be in its user representation. E.g. if the total supply is 10,000,000 tokens, this method
must return 10,000,000 * 10 ^ decimals.

**Returns**:

the total token supply deployed in the system.

#### balanceOf

```python
@public(safe=True)
def balanceOf(owner: UInt160) -> int
```

Get the current balance of an address

The parameter owner must be a 20-byte address represented by a UInt160.

**Arguments**:

- `owner` (`UInt160`): the owner address to retrieve the balance for

**Raises**:

- `AssertionError`: raised if `owner` length is not 20.

**Returns**:

the total amount of tokens owned by the specified address.

#### tokensOf

```python
@public(safe=True)
def tokensOf(owner: UInt160) -> Iterator
```

Get all of the token ids owned by the specified address

The parameter owner must be a 20-byte address represented by a UInt160.

**Arguments**:

- `owner` (`UInt160`): the owner address to retrieve the tokens for

**Raises**:

- `AssertionError`: raised if `owner` length is not 20.

**Returns**:

an iterator that contains all of the token ids owned by the specified address.

#### transfer

```python
@public
def transfer(to: UInt160, token_id: ByteString, data: Any) -> bool
```

Transfers the token with id token_id to address to

The parameter to SHOULD be a 20-byte address. If not, this method SHOULD throw an exception. The parameter 
token_id SHOULD be a valid NFT. If not, this method SHOULD throw an exception. If the method succeeds, 
it MUST fire the Transfer event, and MUST return true, even if the token is sent to the owner. If the receiver is 
a deployed contract, the function MUST call onNEP11Payment method on receiver contract with the data parameter 
from transfer AFTER firing the Transfer event. 

The function SHOULD check whether the owner address equals the caller contract hash. If so, the transfer SHOULD be
processed; If not, the function SHOULD use the SYSCALL Neo.Runtime.CheckWitness to verify the transfer.

If the transfer is not processed, the function SHOULD return false.

**Arguments**:

- `to` (`UInt160`): the address to transfer to
- `token_id` (`ByteString`): the token to transfer
- `data` (`Any`): whatever data is pertinent to the onPayment method

**Raises**:

- `AssertionError`: raised if `to` length is not 20 or if `token_id` is not a valid 
NFT

**Returns**:

whether the transfer was successful

#### post\_transfer

```python
def post_transfer(token_owner: Union[UInt160, None], to: Union[UInt160, None],
                  token_id: bytes, data: Any)
```

Checks if the one receiving NEP11 tokens is a smart contract and if it&#x27;s one the onPayment method will be called 

- internal

**Arguments**:

- `token_owner` (`UInt160`): the address of the sender
- `to` (`UInt160`): the address of the receiver
- `token_id` (`bytes`): the token hash as bytes
- `data` (`Any`): any pertinent data that might validate the transaction

#### ownerOf

```python
@public(safe=True)
def ownerOf(token_id: ByteString) -> UInt160
```

Get the owner of the specified token.

The parameter token_id SHOULD be a valid NFT. If not, this method SHOULD throw an exception.

**Arguments**:

- `token_id` (`ByteString`): the token for which to check the ownership

**Raises**:

- `AssertionError`: raised if `token_id` is not a valid NFT.

**Returns**:

the owner of the specified token.

#### tokens

```python
@public(safe=True)
def tokens() -> Iterator
```

Get all tokens minted by the contract

**Returns**:

an iterator that contains all of the tokens minted by the contract.

#### properties

```python
@public(safe=True)
def properties(token_id: ByteString) -> Dict[Any, Any]
```

Get the properties of a token.

The parameter token_id SHOULD be a valid NFT. If no metadata is found (invalid token_id), an exception is thrown.

**Arguments**:

- `token_id` (`ByteString`): the token for which to check the properties

**Raises**:

- `AssertionError`: raised if `token_id` is not a valid NFT, or if no metadata available.

**Returns**:

a serialized NVM object containing the properties for the given NFT.

#### onNEP11Payment

```python
@public
def onNEP11Payment(from_address: UInt160, amount: int, token_id: bytes,
                   data: Any)
```

**Arguments**:

- `from_address` (`UInt160`): the address of the one who is trying to send cryptocurrency to this smart contract
- `amount` (`int`): the amount of cryptocurrency that is being sent to the this smart contract
- `token_id` (`bytes`): the token hash as bytes
- `data` (`Any`): any pertinent data that might validate the transaction

#### onNEP17Payment

```python
@public
def onNEP17Payment(from_address: UInt160, amount: int, data: Any)
```

**Arguments**:

- `from_address` (`UInt160`): the address of the one who is trying to send cryptocurrency to this smart contract
- `amount` (`int`): the amount of cryptocurrency that is being sent to the this smart contract
- `data` (`Any`): any pertinent data that might validate the transaction

#### total\_accounts

```python
@public
def total_accounts() -> int
```

Gets the number of accounts.

**Returns**:

the number of accounts in the system.

#### offline\_mint

```python
@public
def offline_mint(epoch_id: bytes, account: UInt160) -> bytes
```

mints a token from an epoch

**Arguments**:

- `account`: the account to mint to

**Raises**:

- `AssertionError`: raised if the signer does not have `offline_mint` permission.

**Returns**:

the token_id of the minted token

#### update

```python
@public
def update(script: bytes, manifest: bytes, data: Any)
```

Upgrade the contract.

**Arguments**:

- `script` (`bytes`): the contract script
- `manifest` (`bytes`): the contract manifest

**Raises**:

- `AssertionError`: raised if the signer does not have the &#x27;update&#x27; permission

#### set\_mint\_fee

```python
@public
def set_mint_fee(epoch_id: bytes, amount: int) -> bool
```

Updates the mint fee for a puppet

**Arguments**:

- `epoch_id`: the id of the epoch to set the mint fee for
- `amount`: the GAS cost to charge for the minting of a puppet

**Raises**:

- `AssertionError`: raised if the signer does not have the &#x27;offline_mint&#x27; permission

**Returns**:

A boolean indicating success

#### internal\_mint

```python
def internal_mint(epoch_id: bytes, owner: UInt160) -> bytes
```

Mint new token - internal

**Arguments**:

- `epoch_id`: the epoch id to mint from
- `owner` (`UInt160`): the address of the account that is minting token

**Returns**:

token_id of the token minted

#### get\_user\_json

```python
@public
def get_user_json(address: UInt160) -> Dict[str, Any]
```

Gets the JSON representation of a user account

**Arguments**:

- `address`: The address being requested

**Returns**:

A Dict representing the user

#### get\_user

```python
@public
def get_user(address: UInt160) -> User
```

Gets a User instance

**Arguments**:

- `address`: The address being requested

**Returns**:

The User instance for the requested address

#### save\_user

```python
def save_user(address: UInt160, user: User) -> bool
```

Saves a user instance

**Arguments**:

- `address`: The address to save the user against
- `user`: the User instance being saved

**Returns**:

A bool indicating completion

#### set\_user\_permissions

```python
@public
def set_user_permissions(user: UInt160, permissions: Dict[str, bool]) -> bool
```

Sets a user&#x27;s permissions

**Arguments**:

- `user`: The address of the user to edit
- `permissions`: A dictionary representing the permissions to update

**Returns**:

a boolean indicating success

#### total\_epochs

```python
@public
def total_epochs() -> int
```

Gets the total epoch count.  No

Epoch id is an incrementor so users can iterator from 1 - total_epochs() to dump every epoch on the contract.

**Returns**:

the total token epochs deployed in the system.

## Puppet Objects

```python
class Puppet()
```

#### generate

```python
def generate(owner: UInt160, token_id: bytes, epoch_id: bytes) -> bool
```

Generates a puppet&#x27;s core features
@return: boolean indicating success

#### get\_armor\_class

```python
def get_armor_class() -> int
```

Gets the armor class for a puppet
@return: an integer representing the base armor class of the puppet

#### get\_charisma

```python
def get_charisma() -> int
```

Getter for the charisma base attribute
@return: integer range(3-18) representing the charisma of a puppet

#### get\_constitution

```python
def get_constitution() -> int
```

Getter for the constitution base attribute
@return: integer range(3-18) representing the constitution of a puppet

#### get\_dexterity

```python
def get_dexterity() -> int
```

Getter for the dexterity base attribute
@return: integer range(3-18) representing the dexterity of a puppet

#### get\_intelligence

```python
def get_intelligence() -> int
```

Getter for the intelligence base attribute
@return: integer range(3-18) representing the intelligence of a puppet

#### get\_owner

```python
def get_owner() -> UInt160
```

Getter for the puppet owner
@return: bytes representing the owner of the puppet

#### get\_state

```python
def get_state() -> Dict[str, Any]
```

Gets the state of the puppet.  This differs from an export in that it includes all secondary features like
 armor class, name, and tokenURI.
@return:

#### get\_state\_flat

```python
def get_state_flat() -> Dict[str, Any]
```

Gets the state of the puppet and returns the data in a flat format.

**Returns**:

the puppet in a flat format

#### get\_strength

```python
def get_strength() -> int
```

Getter for the strength base attribute
@return: integer range(3-18) representing the strength of a puppet

#### get\_token\_id

```python
def get_token_id() -> bytes
```

Getter for the puppet unique identifier
@return: integer representing the unique identifier

#### get\_wisdom

```python
def get_wisdom() -> int
```

Getter for the wisdom base attribute
@return: integer range(3-18) representing the wisdom of a puppet

#### load

```python
def load(abstract: Dict[str, Any]) -> bool
```

Loads a puppet from a puppet abstract
@param abstract: a puppet abstract json
@return: a boolean indicating the success

#### set\_owner

```python
def set_owner(owner: UInt160) -> bool
```

Setter for the puppet owner
@param owner: bytes representing the owner of the puppet
@return: Boolean indicating success

#### get\_attribute\_mod

```python
@public
def get_attribute_mod(attribute_value: int) -> int
```

Gets the attribute modifier for an attribute value.

**Arguments**:

- `attribute_value`: The attribute value to get the modifier for range(0-30)

**Returns**:

An attribute modifier for use in mechanics.

#### get\_hit\_die

```python
def get_hit_die(roll: int) -> str
```

Gets a string representation of a hit die when provided an input.

**Arguments**:

- `roll`: An index for the hit die range(0-3)

#### get\_puppet

```python
@public
def get_puppet(token_id: bytes) -> Puppet
```

A factory method to get a puppet from storage

**Arguments**:

- `token_id`: the unique identifier of the puppet

**Returns**:

The requested puppet

#### get\_puppet\_json

```python
@public
def get_puppet_json(token_id: bytes) -> Dict[str, Any]
```

Gets a dict representation of the puppet&#x27;s base stats

**Arguments**:

- `token_id`: the unique puppet identifier

**Returns**:

A dict representing the puppet

#### get\_puppet\_raw

```python
def get_puppet_raw(token_id: bytes) -> bytes
```

Gets the serialized puppet definition

**Arguments**:

- `token_id`: the unique puppet identifier

**Returns**:

a serialize puppet

#### save\_puppet

```python
def save_puppet(puppet: Puppet) -> bool
```

A factory method to persist a puppet to storage

**Arguments**:

- `puppet`: A puppet to save

**Returns**:

A boolean representing the results of the save

