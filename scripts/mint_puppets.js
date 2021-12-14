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

    console.log(`Build me an army worthy of ${signer.address} !!!`)
    console.log(`Minting ${PuppetArmySize} puppets!`)
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


    for (let i = 1; i <= totalSupply; i++) {
        let p = await puppet.properties(i)
        console.log(p)
    }



    /*
    const data = [['color', 'personality', 'archetype', 'trade', 'title', 'origin', 'element', 'domain', 'prestige']]

    for (let i = 1; i <= totalSupply; i++) {
        if (i%100 ===0) {
            console.log(`${i/totalSupply * 100}% complete` )
        }
        let p = await puppet.properties(i)
        const l = Array(data[0].length).fill('')
        Object.keys(p.traits).forEach( (key) => [
            l[data[0].indexOf(key)] = p.traits[key]
        ])
        data.push(l)
        //console.log(JSON.stringify(p.traits, null, 2))
    }
    const csv = data.map( (row) => row.join(',')).join('\n')

    fs.writeFileSync('traits.csv', csv)
    */
}
main()