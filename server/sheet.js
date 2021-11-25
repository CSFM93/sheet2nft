require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet');
let contractHelper = require('./contractHelper')



// Retrieve data in Google Sheet, and convert it to NFT assets
async function handleSheet(_sheetId,tempFolder, cb) {
    let sheetID = _sheetId
    const doc = new GoogleSpreadsheet(sheetID);
    try {

        let fileManager = require('./fileManager')

        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });

        await doc.loadInfo(); 
        const sheet = doc.sheetsByIndex[0]; 
        const contractName = sheet.title

        console.log(contractName);
        const rows = await sheet.getRows();
        fileManager.rows = rows

        if (rows.length > 0) {
            await fileManager.downloadImages(rows, tempFolder)

            fileManager.uploadImages(rows.length, tempFolder, function (images) {

                if (images !== undefined) {
                    fileManager.uploadMetaData(rows, images, async function (metadata) {
                        if (metadata !== undefined) {
                            console.log("uploaded metadata: ", metadata.length)
                            let imagesURI = images[0].path.split("/00000")[0]
                            let metadataURI = metadata[0].path.split("/00000")[0]
                            let contractPath = `./temp/${tempFolder}/MyNFT.sol`
                            let contractURI
                            await contractHelper.createContract(contractPath,metadataURI,contractName)
                            await fileManager.uploadContract(contractPath, function (result) {
                                console.log('contract helper', result)
                                contractURI = result[0].path
                                let data = {
                                    items: rows.length,
                                    metadataURI: metadataURI,
                                    imagesURI: imagesURI,
                                    contractURI:contractURI
                                }
                                console.log(data)
                                fileManager.deleteFiles(tempFolder)
                                cb(data)
                            })
                        } else {
                            cb(undefined)
                        }
                    })
                } else {
                    cb(undefined)
                }
            })
        }

    } catch (error) {
        console.log("error handling sheet", error.stack)
        cb(undefined)
    }
}

module.exports = { handleSheet }


