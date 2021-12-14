import { wallet } from '@cityofzion/neon-core';
export declare function parseToJSON(entries: any[]): any;
export declare function formatter(field: any, num?: boolean): any;
export declare function sleep(ms: number): Promise<unknown>;
export declare function variableInvoke(node: string, networkMagic: number, contractHash: string, method: string, param?: any[], signer?: wallet.Account): Promise<any>;
export declare function txDidComplete(node: string, txid: string, showStats?: boolean): Promise<any>;
