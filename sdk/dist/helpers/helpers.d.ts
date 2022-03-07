import { wallet } from '@cityofzion/neon-core';
export declare function formatter(field: any, num?: boolean): any;
export declare function sleep(ms: number): Promise<unknown>;
export declare function variableInvoke(node: string, networkMagic: number, contractHash: string, method: string, param?: any[], signer?: wallet.Account): Promise<any>;
export declare function deployContract(node: string, networkMagic: number, pathToNEF: string, signer: wallet.Account): Promise<string>;
export declare function getEvents(node: string, txid: string): Promise<any[]>;
export declare function txDidComplete(node: string, txid: string, showStats?: boolean): Promise<any>;
export declare function chiSquared(samples: string[]): number;
