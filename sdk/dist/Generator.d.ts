import { rpc, wallet } from '@cityofzion/neon-core';
import { GeneratorType, PropConstructorOptions } from "./interface";
export declare class Generator {
    private options;
    private networkMagic;
    constructor(options?: PropConstructorOptions);
    init(): Promise<void>;
    get node(): rpc.RPCClient;
    get scriptHash(): string;
    createGenerator(generator: GeneratorType, signer: wallet.Account, timeConstantMS: number): Promise<string[]>;
    createGeneratorFromFile(path: string, signer: wallet.Account, timeConstantMS: number): Promise<string[]>;
    getGeneratorJSON(generatorId: number, signer?: wallet.Account): Promise<GeneratorType | string>;
    getGeneratorInstanceJSON(instanceId: number, signer?: wallet.Account): Promise<any>;
    createInstance(generatorId: number, signer: wallet.Account): Promise<string>;
    mintFromInstance(instanceId: number, signer: wallet.Account): Promise<string>;
    setInstanceAuthorizedUsers(instanceId: number, authorizedUsers: string[], signer: wallet.Account): Promise<string>;
    setInstanceFee(instanceId: number, fee: number, signer: wallet.Account): Promise<string>;
    totalGenerators(signer?: wallet.Account): Promise<number | string>;
    totalGeneratorInstances(signer?: wallet.Account): Promise<number | string>;
}
