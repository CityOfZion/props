neo3-boa contract\pricedapp.py
neoxp reset --force -i ..\default.neo-express
cpm --log-level DEBUG init
neoxp batch tests\price-dapp.neoxp.batch -i ..\..\default.neo-express
