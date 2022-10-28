from boa3.boa3 import Boa3

Boa3.compile_and_save('icon-dapp/contract/icondapp.py', debug=True)
Boa3.compile_and_save('icon-dapp/test-env/test-contracts/child.py', debug=True)
Boa3.compile_and_save('icon-dapp/test-env/test-contracts/ownership.py', debug=True)
Boa3.compile_and_save('icon-dapp/test-env/test-contracts/parent.py', debug=True)

Boa3.compile_and_save('price-dapp/contract/pricedapp.py', debug=True)
