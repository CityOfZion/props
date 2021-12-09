const sdk = require('../sdk/dist')
const fs = require('fs')
const Neon = require("@cityofzion/neon-core")


const NODE = 'http://localhost:50012'
const TIME_CONSTANT = 4000
const PuppetArmySize = 100


//load any wallets and network settings we may want later (helpful if we're local)
const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
network.wallets.forEach( (walletObj) => {
    walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
})

async function main() {
    let txid

    const signer = network.wallets[0].wallet

    const puppet = await new sdk.Puppet({node: NODE})
    await puppet.init()

    console.log(`Minting ${PuppetArmySize} puppets to: `, signer.address)
    console.log('This may take a while, you can watch the action on neo-express.')

    const txids = []
    for (let i = 0; i < PuppetArmySize; i++) {
        txid = await puppet.offlineMint(signer.address, signer)
        txids.push(txid)
        if (i % (PuppetArmySize / 100) === 0) {
            const totalSupply = await puppet.totalSupply()
            console.log(totalSupply, " PUPPETS!!!")
        }
    }
    await sdk.helpers.sleep(TIME_CONSTANT)

    const totalSupply = await puppet.totalSupply()
    console.log('Puppet Supply: ', totalSupply)

    for (let id of txids) {
        await sdk.helpers.txDidComplete(NODE, id)
    }
}
main()