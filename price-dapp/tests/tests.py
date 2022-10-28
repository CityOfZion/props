from boa3 import constants as boa_constants
from boa3.boa3 import Boa3
from boa3.neo import to_script_hash
from boa3.neo.smart_contract.VoidType import VoidType
from boa3_test.tests.test_classes.testengine import TestEngine

from test_env.python import constants


contract_path = '../contract/pricedapp.py'
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


Boa3.compile_and_save(contract_path, debug=True)
test_hello_world_main()
