import { rpc, wallet } from '@cityofzion/neon-core';
import { PropConstructorOptions, TraitLevel } from "./interface";
export declare class Epoch {
    private options;
    private networkMagic;
    constructor(options?: PropConstructorOptions);
    init(): Promise<void>;
    get node(): rpc.RPCClient;
    get scriptHash(): string;
    createEpoch(label: string, maxTraits: number, traitLevels: TraitLevel[], signer: wallet.Account): Promise<string | undefined>;
    createEpochFromFile(path: string, signer: wallet.Account): Promise<string>;
    getEpochJSON(epochId: number): Promise<string | undefined>;
    mintFromEpoch(epochId: number, signer: wallet.Account): Promise<string | undefined>;
    totalEpochs(): Promise<number | undefined>;
}
