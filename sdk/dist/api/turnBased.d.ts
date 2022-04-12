import { wallet } from "@cityofzion/neon-core";
export declare class TurnBasedAPI {
    static getGameJSON(node: string, networkMagic: number, contractHash: string, gameId: string, signer: wallet.Account): Promise<any>;
    static totalGames(node: string, networkMagic: number, contractHash: string, signer?: wallet.Account): Promise<any>;
    static joinGame(node: string, networkMagic: number, contractHash: string, tokenId: string, signer: wallet.Account): Promise<any>;
    static fight(node: string, networkMagic: number, contractHash: string, gameId: string, tokenId: string, attribute: string, signer?: wallet.Account): Promise<any>;
}
