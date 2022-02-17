const { exec } = require('child_process')


async function main() {
    await exec("neoxp policy set FeePerByte 100 genesis")
    await exec("neoxp policy set ExecFeeFactor 3 genesis")
    await exec("neoxp policy set FeePerByte 100 genesis")
    await exec("neoxp transfer 100000 GAS genesis coz")
    await sleep(5000)
}
main()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}