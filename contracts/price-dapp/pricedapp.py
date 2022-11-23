from typing import Any, Dict, List, Optional, cast

from boa3.builtin import NeoMetadata, metadata, public
from boa3.builtin.interop import runtime, storage
from boa3.builtin.interop.blockchain import Transaction
from boa3.builtin.interop.contract import Contract, call_contract
from boa3.builtin.interop.iterator import Iterator
from boa3.builtin.nativecontract.contractmanagement import ContractManagement
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
    meta.description = "Smart Contract Price DApp"
    meta.name = "Price DApp"
    meta.author = "Ricardo Prado"
    meta.email = "ricardo@coz.io"
    meta.supported_standards = []
    meta.add_permission(methods=['decimals', 'symbol', 'getReserves', 'getToken0'])
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

        # fUSDT script hash
        storage.put(get_reference_token_key(), b'\x20\xf0\xbe\xa4\x50\xad\xa7\xb9\x03\xb8\x97\x49\xd7\xc9\xbb\xc1\x60\xb1\x48\xcd')
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
    return "Price DApp"


@public
def get_owner() -> UInt160:
    return UInt160(storage.get(get_owner_key()))


class LiquidityPoolReference:
    def __init__(self, pool_hash: UInt160, referenced_by_first_token: bool):
        self.pool_hash = pool_hash
        self.referenced_by_first_token = referenced_by_first_token


class PoolTokenReserves:
    def __init__(self, reserve_token_A: int, reserve_token_B: int):
        self.reserve_token_A: int = reserve_token_A
        self.reserve_token_B: int = reserve_token_B


def calculate_price(token_1: UInt160, token_2: UInt160) -> int:
    token_1_decimals: int = call_contract(token_1, 'decimals', [])
    if token_1 == token_2:
        price: int = 10 ** token_1_decimals  # price of reference token is always 1
    else:
        token_reserves: PoolTokenReserves = get_reserves(token_1, token_2)
        price: int = token_reserves.reserve_token_B * (10 ** token_1_decimals) // token_reserves.reserve_token_A

    return price


def get_reserves(token_1: UInt160, token_2: UInt160) -> PoolTokenReserves:
    supported_tokens = list_all_supported_tokens()
    if token_1 not in supported_tokens:
        raise Exception('Token not registered: token_1')
    if token_2 not in supported_tokens:
        raise Exception('Token not registered: token_2')

    pool_result: LiquidityPoolReference = get_liquidity_pool(token_1, token_2)
    need_to_swap_reserves = False
    if isinstance(pool_result, LiquidityPoolReference):
        token_1_is_first_token = pool_result.referenced_by_first_token
        token_reserves: PoolTokenReserves = call_contract(pool_result.pool_hash, 'getReserves')

        if not token_1_is_first_token:  # defines the order of the reserves
            need_to_swap_reserves = True

    else:
        # get individual reserves from different liquidity pools to calculate
        token_2_pools = get_liquidity_pools(token_2)
        found_intermediary_pool = False
        found_intermediary_reserves = False

        # TODO: this needs to be optimized, since iterating may become really expensive
        while token_2_pools.next() and not found_intermediary_pool:
            iterator_value: tuple = token_2_pools.value
            other_token: UInt160 = iterator_value[0]

            token_1_liquidity_pool: LiquidityPoolReference = get_liquidity_pool(token_1, other_token)

            if token_1_liquidity_pool is not None:
                found_intermediary_pool = True
                token_2_liquidity_pool: LiquidityPoolReference = iterator_value[1]

        if found_intermediary_pool:
            token_reserves_1: PoolTokenReserves = call_contract(token_1_liquidity_pool.pool_hash, 'getReserves')
            # storing the value in a variable before using because the value is not being consistent in the object
            first_pool_is_referenced_by_token_1 = token_1_liquidity_pool.referenced_by_first_token
            if first_pool_is_referenced_by_token_1:  # referenced by token_1
                reserve_token_1_intermed = token_reserves_1.reserve_token_A
                reserve_intermed_token_1 = token_reserves_1.reserve_token_B
            else:
                reserve_token_1_intermed = token_reserves_1.reserve_token_B
                reserve_intermed_token_1 = token_reserves_1.reserve_token_A

        else:
            # need to reiterate since Iterator doesn't have a clone method or similar
            token_2_pools = get_liquidity_pools(token_2)
            intermediary_reserve = None

            # TODO: this needs to be optimized, since iterating may become really expensive and the use of recursion
            while token_2_pools.next() and not found_intermediary_reserves:
                iterator_value: tuple = token_2_pools.value
                other_token: UInt160 = iterator_value[0]

                try:
                    intermediary_reserve: PoolTokenReserves = get_reserves(token_1, other_token)
                    token_2_liquidity_pool: LiquidityPoolReference = iterator_value[1]

                    # there's some bug in boa with accessing the variables here without the type annotation
                    reserve_token_1_intermed: int = intermediary_reserve.reserve_token_A
                    reserve_intermed_token_1: int = intermediary_reserve.reserve_token_B
                    found_intermediary_reserves = True

                except:
                    continue

            if intermediary_reserve is None:
                # this exception is to prevent achieving the limit of stack calls
                raise Exception('Token not registered: token_1')

        token_reserves_2: PoolTokenReserves = call_contract(token_2_liquidity_pool.pool_hash, 'getReserves')

        # storing the value in a variable before using because the value is not being consistent in the object
        second_pool_is_referenced_by_token_2 = token_2_liquidity_pool.referenced_by_first_token
        if second_pool_is_referenced_by_token_2:  # token_2 is token_A
            reserve_token_2 = token_reserves_2.reserve_token_A
            reserve_intermed_token_2 = token_reserves_2.reserve_token_B
        else:
            # referenced by intermediary token
            reserve_token_2 = token_reserves_2.reserve_token_B
            reserve_intermed_token_2 = token_reserves_2.reserve_token_A

        reserve_token_1 = reserve_token_1_intermed * reserve_intermed_token_2 // reserve_intermed_token_1
        token_reserves = PoolTokenReserves(reserve_token_1, reserve_token_2)

    if need_to_swap_reserves:
        token_reserves = PoolTokenReserves(token_reserves.reserve_token_B, token_reserves.reserve_token_A)

    return token_reserves


@public(name='getPrice', safe=True)
def get_price(token_hash: UInt160) -> dict:
    result = {
        'hash': token_hash
    }
    if is_deployed_contract(token_hash):
        try:
            token_symbol: str = call_contract(token_hash, 'symbol', [])
            reference_token: UInt160 = get_reference_token()
            reference_token_decimals: int = call_contract(reference_token, 'decimals', [])
            price: int = calculate_price(token_hash, reference_token)

            return {
                'symbol': token_symbol,
                'hash': token_hash,
                'price_value': price,
                'price_decimals': reference_token_decimals
            }
        except:
            return result

    return result


@public(name='getPrices', safe=True)
def get_prices(token_hashes: List[UInt160]) -> List[dict]:
    prices: List[dict] = []

    if len(token_hashes) == 0:
        return prices

    token_prices: Dict[UInt160, dict] = {}  # don't need to check twice for the price of the same token

    for token_hash in token_hashes:
        if token_hash in token_prices:
            token_price = token_prices[token_hash]
        else:
            token_price = get_price(token_hash)
            token_prices[token_hash] = token_price

        prices.append(token_price)

    return prices


@public(name='getAllPrices', safe=True)
def get_all_prices() -> List[dict]:
    return get_prices(list_all_supported_tokens())


# methods to set local storage


@public(name='getReferenceToken', safe=True)
def get_reference_token() -> UInt160:
    stored_hash = storage.get(get_reference_token_key())
    if len(stored_hash) == 20:
        return UInt160(stored_hash)
    else:
        return UInt160()


@public(name='setReferenceToken')
def set_reference_token(token_hash: UInt160) -> bool:
    if not runtime.check_witness(get_owner()):
        raise Exception('No authorization')

    if not is_deployed_contract(token_hash):
        raise Exception('Given hash is not a valid contract')

    storage.put(get_reference_token_key(), token_hash)
    return True


@public(name='getLiquidityPool', safe=True)
def get_liquidity_pool(token_1_hash: UInt160, token_2_hash: UInt160) -> Optional[LiquidityPoolReference]:
    opposite_pool_found = False
    result = storage.get(get_liquidity_pool_key(token_1_hash, token_2_hash))
    if len(result) == 0:
        # tries to check the opposite pool
        result = storage.get(get_liquidity_pool_key(token_2_hash, token_1_hash))
        opposite_pool_found = True

    if len(result) == 0:
        return None

    deserialized_pool: LiquidityPoolReference = StdLib.deserialize(result)
    if opposite_pool_found:
        deserialized_pool.referenced_by_first_token = not deserialized_pool.referenced_by_first_token
    return deserialized_pool


def get_liquidity_pools(token_hash: UInt160) -> Iterator:
    find_options = storage.FindOptions.REMOVE_PREFIX + storage.FindOptions.DESERIALIZE_VALUES
    find_result = storage.find(get_liquidity_pool_prefix_key(token_hash), options=find_options)
    return find_result


@public(name='setLiquidityPool')
def set_liquidity_pool(token_1_hash: UInt160, token_2_hash: UInt160, pool_hash: UInt160) -> bool:
    if not runtime.check_witness(get_owner()):
        raise Exception('No authorization')

    if not is_deployed_contract(token_1_hash):
        raise Exception('Given hash is not a valid contract: token_1')

    if not is_deployed_contract(token_2_hash):
        raise Exception('Given hash is not a valid contract: token_2')

    if not is_deployed_contract(pool_hash):
        raise Exception('Given hash is not a valid contract: pool_hash')

    token_0: UInt160 = call_contract(pool_hash, 'getToken0')
    token_1_is_first = token_0 == token_1_hash

    save_liquidity_pool(token_1_hash, token_2_hash, LiquidityPoolReference(pool_hash, token_1_is_first))
    save_liquidity_pool(token_2_hash, token_1_hash, LiquidityPoolReference(pool_hash, not token_1_is_first))

    add_supported_token(token_1_hash)
    add_supported_token(token_2_hash)

    return True


def save_liquidity_pool(token_1_hash: UInt160, token_2_hash: UInt160, pool_reference: LiquidityPoolReference):
    serialized = StdLib.serialize(pool_reference)
    storage.put(get_liquidity_pool_key(token_1_hash, token_2_hash), serialized)


def is_deployed_contract(token_hash: UInt160) -> bool:
    token_contract: Contract = ContractManagement.get_contract(token_hash)
    return token_contract is not None


def list_all_supported_tokens() -> List[UInt160]:
    stored_value = storage.get(get_supported_tokens_key())
    if len(stored_value) > 0:
        return cast(List[UInt160], StdLib.deserialize(stored_value))
    else:
        return []


def add_supported_token(token_hash: UInt160):
    already_supported = list_all_supported_tokens()
    if token_hash not in already_supported:
        already_supported.append(token_hash)
        storage.put(get_supported_tokens_key(), StdLib.serialize(already_supported))


# Keys
def get_owner_key() -> ByteString:
    return b'\x01'


def get_reference_token_key() -> ByteString:
    return b'\x02'


def get_supported_tokens_key() -> ByteString:
    return b'\x03'


def get_liquidity_pool_prefix_key(token_hash: UInt160) -> ByteString:
    return b'\x04' + token_hash + b'_'


def get_liquidity_pool_key(token_1_hash: UInt160, token_2_hash: UInt160) -> ByteString:
    return get_liquidity_pool_prefix_key(token_1_hash) + token_2_hash
