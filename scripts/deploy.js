const { exec } = require('child_process')


async function main() {
    await exec("neoxp transfer 100000 GAS genesis coz")
    await sleep(5000)
    await exec("neoxp contract deploy contracts/dice/props.dice.nef coz --force")
    await exec("neoxp contract deploy contracts/collection/props.collection.nef coz --force")
    await exec("neoxp contract deploy contracts/puppet/props.puppet.nef coz --force")
}
main()


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}