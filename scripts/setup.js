import {exec as _exec} from 'child_process'
import {sleep} from './helpers'


async function main() {
    const exec = util.promisify(_exec)

    await exec("neoxp policy set FeePerByte 100 genesis")
    await exec("neoxp policy set ExecFeeFactor 3 genesis")
    await exec("neoxp policy set FeePerByte 100 genesis")
    await exec("neoxp transfer 100000 GAS genesis coz")
    await sleep(5000)
}
main()
