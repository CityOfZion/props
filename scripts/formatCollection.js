

const rawPayload = `Professor
Noble
Royal
Summoner
Mythic
Throne-breaker
Demi-god
Legend
God-slayer
Saint
Desert
Grassland
Valley
Forest
Coastal
Mountain
Riverside
Marsh
Tundra
Wasteland
Ocean
Heaven
Moon
Interdimensional
Worker Ant
Bullish
Bearish
Chickpea
Earth
Fire
Wind
Water
Rockclimber
Meta-whiskers
Knight of Ni
Warrior Ant
Lesser Flamingo
Primordial
Elemental
Archaic
Ancient
Cosmic
Astral
Newsie
Grace
Greater Flamingo
The First Blessing
The Second Blessing
The Third Blessing
The Assistant to the Regional Manager
The Neon
The Chosen One
The Explorer
434f5a
The Sentinel
The Long Block
The Cipher
The 0Day
The White Knuckled
The Shill
The Savior
01010100 01101000 01100101 00100000 01001111 01101110 01100101
Hello Dave
Fun Guy
Satoshi Nakamoto`


let p = rawPayload.split('\n')
console.log(p.sort().map(((x) => x.toLowerCase())))
