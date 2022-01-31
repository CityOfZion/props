const sdk = require('../sdk/dist')
const fs = require('fs')
const Neon = require("@cityofzion/neon-core")
const canvas = require("canvas")
const chart = require("chart.js")
const aws = require("aws-sdk")

const NODE = 'http://localhost:50012'
const IMAGE_SIZE = [1080, 1080]
const ENV = 'dev'
const S3_BUCKET = 'props-coz'

//load any wallets and network settings we may want later (helpful if we're local)
const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
network.wallets.forEach( (walletObj) => {
    walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
})

async function main() {
    const s3 = new aws.S3()

    s3.listObjects()
    let lastTokenId = 0 //update to get this from s3

    const puppet = await new sdk.Puppet({node: NODE})
    await puppet.init()
    const totalSupply = await puppet.totalSupply()

    while (lastTokenId < totalSupply) {
        lastTokenId += 1

        let p = await puppet.properties(lastTokenId)

        const image = buildImage(p)

        const path = p.tokenURI.split('/').slice(-5).join('/')
        const params = {
            Bucket: S3_BUCKET,
            Key: `${ENV}/${path}`,
            Body: image,
            ContentType: "image/png",
            ACL:'public-read'
        }

        await s3.upload(params, function(e, data) {
            if (e) {
                console.log(e, data)
            }
        })
    }
}

function buildImage(puppet) {

    const cvs = canvas.createCanvas(...IMAGE_SIZE)
    const context = cvs.getContext('2d')

    context.fillStyle = "#000000";
    context.fillRect(0,0, ...IMAGE_SIZE)

    //tokenId
    context.font = '32pt Sofia Pro - Black';
    context.fillStyle = "#fff"
    context.textAlign = "right";
    context.fillText(puppet.tokenId, 1040,60)

    //epoch
    context.font = '64pt Sofia Pro - Black';
    context.fillStyle = "#fff"
    context.textAlign = "left";
    context.fillText("Puppeteer", 40,100)

    //name
    context.font = '24pt Sofia Pro - Black';
    context.fillStyle = "#fff"
    context.textAlign = "left";
    context.fillText(puppet.name, 40,140)

    //traits
    formatTraits(context, puppet,800)

    //attributes
    formatAttributes(context, puppet)

    const buffer = cvs.toBuffer("image/png")

    return buffer

}

function formatAttributes(context, puppet) {
    const data = {
        labels: Object.keys(puppet.attributes),
        datasets: [{
            label: 'Attributes',
            data: Object.keys(puppet.attributes).map(attr => puppet.attributes[attr]),
            fill: true,
            backgroundColor: 'rgba(0, 203, 255, 0.2)',
            borderColor: 'rgb(0, 203, 255)',
            pointBackgroundColor: 'rgb(0, 203, 255)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };
    const config = {
        type: 'radar',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 18,
                    pointLabels: {
                        color: 'white',
                        font: {
                            weight: 'bold',
                            size: 28,
                            family: 'Sofia Pro',
                        }
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 1)',
                        lineWidth: 2
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        lineWidth: 1.5
                    },
                    ticks: {
                        font: {
                            size: 22,
                            family: 'Sophia Pro'
                        },
                        backdropColor: '#000000',
                        color: 'white'
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 5
                }
            }
        },
    };
    const radarCanvas = canvas.createCanvas(800, 800)
    const radarContext = radarCanvas.getContext('2d')
    const myChart = new chart.Chart(radarContext, config);
    context.drawImage(radarCanvas, 200,100, 800,800);
}

function formatTraits(context, puppet, y) {
    //traits
    context.font = 'bold 24pt Sofia Pro';
    context.fillStyle = "#fff"
    context.textAlign = "left";
    context.fillText("Traits:", 40, y)

    Object.keys(puppet.traits).forEach((trait, i) => {
        context.font = '20pt Sofia Pro';
        context.fillStyle = "#fff"
        context.textAlign = "left";
        context.fillText(`${trait}:`, 40,y + 50 + i * 30)
        context.fillText(puppet.traits[trait], 250,y + 50 + i * 30)
    })
}


main()