import {sc} from "@cityofzion/neon-js";
import {wallet} from "@cityofzion/neon-core";
import {formatter, variableInvoke} from "../helpers";

export class TemplateAPI {

  static async templateMethod(
    node: string,
    networkMagic: number,
    contractHash: string,
    paramA: string,
    paramB: number,
    paramC: string,
    paramD: boolean,
    paramE: string[],
    signer?: wallet.Account, //this field can be optional if you are doing a test invocation(you arent changing contract state and dont rely on block entropy)
  ): Promise<any> {
    const method = "{{YOUR_METHOD_NAME_HERE}}";

    const paramEFormatted = paramE.map( (param) => {
      return sc.ContractParam.string(param)
    })

    const param = [
      sc.ContractParam.string(paramA),
      sc.ContractParam.integer(paramB),
      sc.ContractParam.byteArray(paramC),
      sc.ContractParam.boolean(paramD),
      sc.ContractParam.array(...paramEFormatted)
    ];

    const res = await variableInvoke(node, networkMagic, contractHash, method, param, signer)
    if (signer) {
      return res
    }
    return formatter(res[0])
  }

}