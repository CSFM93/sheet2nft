let fs = require("fs");
let axios = require("axios");
let { runCommand } = require('./shellHelper')

let fileManager = {
    downloadImages: async (rows, tempFolder) => {
        let promises = []

        async function createDirectory() {
            let command = `mkdir -p ./temp/${tempFolder} `
            await runCommand(command)
        }

        async function downloadImage(fileID, filename, tempFolder) {
            let command = `wget --no-check-certificate -q -r 'https://docs.google.com/uc?export=download&id=${fileID}' -O ./temp/${tempFolder}/${filename}.png`
            await runCommand(command)
        }

        await createDirectory()

        for (let i = 0; i < rows.length; i++) {
            let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + i.toString(16)).substr("-64");
            console.log(rows[i].image);
            let imageID = rows[i].image.replace("https://drive.google.com/file/d/", "").split("/")[0]
            console.log("imageID: ", imageID)
            promises.push(downloadImage(imageID, paddedHex, tempFolder))
        }

        await Promise.all(promises).then((values) => {
            console.log('all images were downloaded')
        });

    },
    uploadImages: async (numberOfImages, tempFolder, cb) => {
        try {
            let ipfsArray = [];
            let promises = [];
            console.log("dir name: ", __dirname)

            for (let i = 0; i < numberOfImages; i++) {
                let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + i.toString(16)).substr("-64");

                promises.push(new Promise((res, rej) => {

                    fs.readFile(`./temp/${tempFolder}/${paddedHex}.png`, (err, data) => {
                        if (err) {
                            console.log("error reading", err)
                            cb(undefined)
                        } else {
                            ipfsArray.push({
                                path: `images/${paddedHex}.png`,
                                content: data.toString("base64")
                            })
                            res();
                        }

                    })
                }))
            }
            console.log('array', ipfsArray.length)
            Promise.all(promises).then(() => {
                axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
                    ipfsArray,
                    {
                        headers: {
                            "X-API-KEY": process.env.MORALIS_API_KEY,
                            "Content-Type": "application/json",
                            "accept": "application/json"
                        }
                    }
                ).then((res) => {
                    console.log("data", res.data ? res.data.length : undefined);
                    console.log('before', res.data)
                    let images = res.data.sort((a, b) => (a.path > b.path) ? 1 : -1)
                    console.log('after', images)

                    cb(images)
                })
                    .catch((error) => {
                        console.log("axios error", Object.keys(error))
                        cb(undefined)

                    })
            })

        } catch (error) {
            console.log('error', error)
            cb(undefined)
        }
    },
    uploadMetaData: (rows, images, cb) => {
        let ipfsArray = []
        for (let i = 0; i < rows.length; i++) {
            let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + i.toString(16)).substr("-64");

            ipfsArray.push({
                path: `metadata/${paddedHex}.json`,
                content: {
                    image: images[i].path,
                    name: rows[i].name,
                    description: rows[i].description,
                    properties: rows[i].properties ? rows[i].properties : {},
                    external_url: rows[i].external_url ? rows[i].external_url : "",

                }
            })

        }
        console.log('array', ipfsArray.length)
        axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
            ipfsArray,
            {
                headers: {
                    "X-API-KEY": process.env.MORALIS_API_KEY,
                    "Content-Type": "application/json",
                    "accept": "application/json"
                }
            }
        ).then((res) => {
            console.log("data", res.data ? res.data.length : undefined);
            cb(res.data)
        })
            .catch((error) => {
                console.log("axios error", error)
                cb(undefined)

            })

    },
    uploadContract: async (contractPath, cb) => {
        let ipfsArray = []
        await new Promise((res, rej) => {
            fs.readFile(`${contractPath}`, (err, data) => {
                if (err) {
                    console.log("error reading", err)
                }
                ipfsArray.push({
                    path: `contract/MyNFT.sol`,
                    content: data.toString("base64")
                })
                res();
            })
        })
        console.log('contract before upload', ipfsArray.length)
        axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
            ipfsArray,
            {
                headers: {
                    "X-API-KEY": process.env.MORALIS_API_KEY,
                    "Content-Type": "application/json",
                    "accept": "application/json"
                }
            }
        ).then((res) => {
            console.log("contract data", res.data);
            cb(res.data)
        })
            .catch((error) => {
                console.log("axios error", error.data)
                cb(undefined)

            })

    },
    deleteFiles: async (tempFolder) => {
        let command = `rm -rf ./temp/${tempFolder}`
        await runCommand(command)
        console.log("files deleted")

    }
}


module.exports = fileManager