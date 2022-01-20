const fs = require('fs')


const basePath = "parameters/collections"


let wordParty = `9500\t9700\t9900\t9970\t10000
\t1.00%\t0.50%\t0.18%\t0.02%
\t63.66\t31.83\t11.14\t1.06
\tworker ant\tmeta-whiskers\tnewsie\tThe First Blessing
\tchickpea\tknight of ni\tgrace\tThe Second Blessing
\t\twarrior ant\tgreater flamingo\tThe Third Blessing
\t\tlesser flamingo\trock climber\tThe Assistant to the Regional Manager
\t\t\t\tThe Neon
\t\t\t\tThe Chosen One
\t\t\t\tThe Explorer
\t\t\t\t434f5a
\t\t\t\tThe Sentinel
\t\t\t\tThe Long Block
\t\t\t\tThe Cipher
\t\t\t\tThe 0Day
\t\t\t\tThe White Knuckled
\t\t\t\tThe Shill
\t\t\t\tThe Savior
\t\t\t\tHello Dave
\t\t\t\tFun Guy
\t\t\t\tSatoshi Nakamoto`

wordParty = wordParty.split('\n')
wordParty = wordParty.map( (row) => {
    return row.split('\t')
})
wordParty = transpose(wordParty)

let traitLevels = []
for (let row of wordParty) {
    const traits = row.slice(3).filter(n => n)
    const dropScore = parseInt(row[0])
    if (dropScore !== 0) {
        traitLevels.push({
            'dropScore': parseInt(row[0]),
            'traits': traits

        })
    }
}

traitLevels = traitLevels.map((level) => {

    const traits = level.traits.map( (trait) => {
        return findPointer(trait, basePath)
    })

    return {
        "dropScore": level.dropScore,
        "traits": traits
    }
})

console.log(JSON.stringify(traitLevels, null, 2))

function findPointer(word, basePath) {
    let files = fs.readdirSync(basePath)

    for (let f of files) {
        const collectionId = parseInt(f.split('_')[0])

        const collection = JSON.parse(fs.readFileSync(basePath + '/' + f).toString());
        const index = collection.values.indexOf(word)

        if (index !== -1) {
            return {
                "type": 0,
                "maxMint": -1,
                "args": {
                    "collectionId": collectionId,
                    "index": index
                }
            }
        }
    }
    throw new Error("unable to match: " + word)
}

function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}