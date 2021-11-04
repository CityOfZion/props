const Neon = require("@cityofzion/neon-core")
const fs = require("fs")


before( async function () {

    this.node = "http://localhost:50012"
    this.contracts = {
        "nep11": "0x3f57010287f648889d1ce5264d4fa7839fdab000"
    }
    this.network = JSON.parse(fs.readFileSync("../default.neo-express").toString());

    this.network.wallets.forEach( (walletObj) => {
        walletObj.wallet = new Neon.wallet.Account(walletObj.accounts['private-key'])
    })
    console.log("finished init")
})

