from boa3 import constants as boa_constants
from boa3.boa3 import Boa3
from boa3.neo import to_script_hash
from boa3.neo.smart_contract.VoidType import VoidType
from boa3_test.tests.test_classes.testengine import TestEngine

from test_env.python import constants


contract_path = '../contract/icondapp.py'
nef_path = contract_path.replace('.py', '.nef')


def deploy_contract(test_engine, nef_path, admin):
    manifest_path = nef_path.replace('.nef', '.manifest.json')
    with open(nef_path, mode='rb') as nef_output:
        nef_bytes = nef_output.read()

    with open(manifest_path) as manifest_output:
        manifest_bytes = manifest_output.read()

    test_engine.add_signer_account(admin)  # should be called by the admin, but TestEngine can't reproduce this
    test_engine.run(boa_constants.MANAGEMENT_SCRIPT, 'deploy', nef_bytes, manifest_bytes)


def test_hello_world_main():
    admin = to_script_hash(constants.ADMIN_TEST_ADDRESS)
    engine = TestEngine(constants.TEST_ENGINE_FOLDER)

    deploy_contract(engine, nef_path, admin)

    admin = engine.run(nef_path, 'get_owner')
    assert isinstance(admin, bytes) and len(admin) == 20

    result = engine.run(nef_path, 'getProperties')
    assert (result == {})

    property_name = "small-icon-rounded"
    result = engine.run(nef_path, 'addProperty', property_name, "56x56 PNG Icon with transparent background")
    assert (result == False)

    engine.add_signer_account(admin)
    result = engine.run(nef_path, 'addProperty', property_name, "56x56 PNG Icon with transparent background")
    assert (result == True)

    dapp_parent_hash = bytes(range(20)).decode('utf-8')
    property_value = "url"
    engine.add_signer_account(admin)
    result = engine.run(nef_path, 'setMetaData', dapp_parent_hash, property_name, property_value)
    assert (result == True)

    result = engine.run(nef_path, 'getMetaData', dapp_parent_hash)
    assert (result[property_name] == property_value)

    dapp_child_hash = bytes(range(10, 30)).decode('utf-8')
    engine.add_signer_account(admin)
    result = engine.run(nef_path, 'setContractParent', dapp_child_hash, dapp_parent_hash)
    assert (result == True)

    result = engine.run(nef_path, 'getContractParent', dapp_child_hash)
    assert (result == dapp_parent_hash)

    result = engine.run(nef_path, 'getMultipleMetaData', [dapp_parent_hash, dapp_child_hash])
    assert (isinstance(result, dict))
    assert (len(result) == 2)


Boa3.compile_and_save(contract_path, debug=True)
test_hello_world_main()
