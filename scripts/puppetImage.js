const sdk = require('../sdk/dist')
const fs = require('fs')
const Neon = require("@cityofzion/neon-core")
const canvas = require("canvas")
const chart = require("chart.js")
const aws = require("aws-sdk")
const THREE = require("three")
const Jimp = require("jimp")
const JSDOM = require("jsdom")



const NODE = 'http://localhost:50012'
const ENV = 'dev'
const S3_BUCKET = 'props-coz'

const MAX_ATTRIBUTE = 18
const PLOT_RADIUS = 40 //px

//load any wallets and network settings we may want later (helpful if we're local)
const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
network.wallets.forEach( (walletObj) => {
    walletObj.wallet = new Neon.wallet.Account(walletObj.accounts[0]['private-key'])
})

async function main() {
    const { window } = new JSDOM.JSDOM();
    global.document = window.document;

    const s3 = new aws.S3()

    s3.listObjects()
    let lastTokenId = 0 //update to get this from s3

    const puppet = await new sdk.Puppet({node: NODE})
    await puppet.init()
    const totalSupply = await puppet.totalSupply()


    while (lastTokenId < totalSupply) {
        lastTokenId += 1

        let p = await puppet.properties(lastTokenId)

        //const image = buildImage(p)
        const spokes = buildRadarData(p.attributes, PLOT_RADIUS)

        const path = p.tokenURI.split('/').slice(-5).join('/')
        /*
        const params = {
            Bucket: S3_BUCKET,
            Key: `${ENV}/${path}`,
            Body: image,
            ContentType: "image/png",
            ACL:'public-read'
        }

         */

        const r = new OGLRenderer(spokes)
        r.render(path + '.png')
        break
        //fs.writeFileSync(path + '.png', image)
        //fs.writeFileSync()
        /*
        await s3.upload(params, function(e, data) {
            if (e) {
                console.log(e, data)
            }
        })

         */
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

function buildRadarData(obj, radius) {
    const attributeCount = Object.keys(obj).length
    let spokes = Object.keys(obj).map( (attr, i) => {

        const theta = i / attributeCount * 360
        const r = obj[attr] / MAX_ATTRIBUTE * radius
        const coordinates = {
            x: r * Math.sin(theta * (Math.PI / 180)),
            y: r * Math.cos(theta * (Math.PI / 180)),
            z: r,
            r,
            theta
        }

        return {
            label: attr,
            value: obj[attr],
            coordinates,
            interfaces: []
        }
    })

    spokes = spokes.map( (spoke, i) => {

        //create the entry interface
        let spokeEntry
        if (i !== 0) {
            spokeEntry = spokes[i -1]
        } else {
            spokeEntry = spokes[spokes.length - 1]
        }

        spoke.interfaces.push({
            x: (spokeEntry.coordinates.x + spoke.coordinates.x) / 2,
            y: (spokeEntry.coordinates.y + spoke.coordinates.y) / 2,
            z: 0
        })

        let spokeExit
        if (i !== spokes.length - 1) {
            spokeExit = spokes[i + 1]
        }
        else {
            spokeExit = spokes[0]
        }

        //console.log(spokeExit.coordinates.x, spoke.coordinates.x, (spokeExit.coordinates.x + spoke.coordinates.x) / 2)
        spoke.interfaces.push({
            x: (spokeExit.coordinates.x + spoke.coordinates.x) / 2,
            y: (spokeExit.coordinates.y + spoke.coordinates.y) / 2,
            z: 0
        })
        return spoke
    })
    return spokes
}

function buildRadarObject(spokes) {
    const geometry = new THREE.BufferGeometry()

    const positions = []
    spokes.forEach( (spoke) => {
        spoke.interfaces.forEach( (inter, i) => {
            positions.push(...[0,0,0])

            if (i === 0) {
                positions.push(...[
                    spoke.coordinates.x,
                    spoke.coordinates.y,
                    spoke.coordinates.z,
                    inter.x,
                    inter.y,
                    inter.z
                ])
            } else {
                positions.push(...[
                    inter.x,
                    inter.y,
                    inter.z,
                    spoke.coordinates.x,
                    spoke.coordinates.y,
                    spoke.coordinates.z,
                ])
            }
        })
    })


    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.computeVertexNormals()
    geometry.normalizeNormals()
    /*
    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: false,
        opacity: 1,
        side: THREE.DoubleSide
    });

     */

    const params = {
        envMap: 'HDR',
        roughness: 0.3,
        metalness: 0.5,
        exposure: 1.0,
        debug: false,
        envMapIntensity: 1
    };

    var path = "https://threejs.org/examples/textures/cube/SwedishRoyalCastle/";
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    const reflectionCube = new THREE.CubeTextureLoader().load(urls)
    reflectionCube.encoding = THREE.sRGBEncoding

    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(1.000, 0.766, 0.336),
        //color: 0xffffff,
        roughness: params.roughness,
        metalness: params.metalness,
        side: THREE.DoubleSide,

        //normalMap:,

        //aoMap: ,

        //displacementMap: ,
        envMap: reflectionCube,
        //envMapIntensity: params.envMapIntensity
    });

    const mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true
    mesh.castShadow = true
    return mesh
}

function threeTest() {

    const { window } = new JSDOM.JSDOM();
    global.document = window.document;

    const attributes = {
        charisma: 16,
        constitution: 15,
        dexterity: 10,
        intelligence: 13,
        strength: 14,
        wisdom: 15
    }
    const PLOT_RADIUS = 60 //px

    const spokes = buildRadarData(attributes, PLOT_RADIUS)

    const r = new OGLRenderer(spokes)
    r.render()
}



class OGLRenderer {
    width = 4000
    height = 4000
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, this.width / this.height, .1, 1000)

    gl = require('gl')(this.width, this.height, { preserveDrawingBuffer: true }); //headless-gl
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        context: this.gl
    });
    mesh = new THREE.Mesh()

    constructor(spokes) {
        this.renderer.setSize(this.width, this.height)
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.renderer.shadowMapSoft = true
        //this.renderer.gammaInput = true;
        //this.renderer.gammaOutput = true;

        this.scene.background = new THREE.Color(0xdddddd);


        this.camera.position.set(0,0,200);
        this.camera.lookAt(0,0,30)
        this.scene.add( new THREE.AxesHelper(200));

        var light1 = new THREE.SpotLight(0xffffff, 2);
        light1.position.set(50, 50, 200)
        light1.lookAt(0,0,0)
        light1.shadow.mapSize.width = 1024
        light1.shadow.mapSize.height = 1024
        light1.castShadow = true
        this.scene.add(light1);

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);


        const radarObject = buildRadarObject(spokes)
        radarObject.position.set(0,0,80)
        this.scene.add(radarObject)

        //Create a plane that receives shadows (but does not cast them)
        var planeGeometry = new THREE.PlaneGeometry( this.width, this.height, 32 );
        var planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x9c9c9c, side: THREE.DoubleSide})
        var plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.receiveShadow = true;
        this.scene.add( plane );
    }

    render = (path) => {

        this.renderer.render(this.scene, this.camera);

        var bitmapData = new Uint8Array(this.width * this.height * 4)
        this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, bitmapData)

        new Jimp(this.width, this.height, (err, image) => {
            image.bitmap.data = bitmapData
            image.getBuffer("image/png", (err, buffer) => {
                fs.writeFile(path, buffer, function (err) {
                    if (err) throw err;
                    console.log('see output result file: out.png');
                });
            });
        })
    }
}


//main()
//mock()
main()