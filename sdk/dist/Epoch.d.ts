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
    getEpochJSON(epochId: number): Promise<string | undefined>;
    mintFromEpoch(epochId: number, signer: wallet.Account): Promise<string | undefined>;
    totalEpochs(): Promise<number | undefined>;
}
