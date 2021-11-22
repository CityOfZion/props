import { wallet } from "@cityofzion/neon-core";

export interface BaseStats {
  charisma: number
  constitution: number
  dexterity: number
  intelligence: number
  strength: number
  wisdom: number
}

export interface CharacterType {
  attributes: BaseStats
  hitDie: string
  owner: wallet.Account
  titles: string[]
  tokenId: number
}