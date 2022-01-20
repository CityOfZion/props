import { rpc, wallet } from '@cityofzion/neon-core';
import { EpochType, PropConstructorOptions } from "./interface";
export declare class Epoch {
    private options;
    private networkMagic;
    constructor(options?: PropConstructorOptions);
    init(): Promise<void>;
    get node(): rpc.RPCClient;
    get scriptHash(): string;
    createEpoch(epoch: EpochType, signer: wallet.Account, timeConstantMS: number): Promise<string[]>;
    createEpochFromFile(path: string, signer: wallet.Account, timeConstantMS: number): Promise<string[]>;
    getEpochJSON(epochId: number, signer?: wallet.Account): Promise<EpochType | string>;
    getEpochInstanceJSON(instanceId: number, signer?: wallet.Account): Promise<any>;
    createInstance(epochId: number, signer: wallet.Account): Promise<string>;
    mintFromEpoch(epochId: number, signer: wallet.Account): Promise<string>;
    mintFromInstance(instanceId: number, signer: wallet.Account): Promise<string>;
    setInstanceAuthorizedUsers(instanceId: number, authorizedUsers: string[], signer: wallet.Account): Promise<string>;
    totalEpochs(signer?: wallet.Account): Promise<number | string>;
    totalEpochInstances(signer?: wallet.Account): Promise<number | string>;
}
