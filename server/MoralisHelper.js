const Moralis = require("moralis/node"); // Node.js
require('dotenv').config()

const appId = process.env.APP_ID
const serverUrl = process.env.SERVER_URL
const masterKey = process.env.MASTER_KEY
const moralisSecret = process.env.MORALIS_SECRET


let updateProject = async (data) => {
    await Moralis.start({
        serverUrl: serverUrl,
        appId: appId,
        masterKey: masterKey,
        moralisSecret: moralisSecret
    });


    console.log("updating: ", data.projectId)
    const Project = Moralis.Object.extend("Projects");
    const query = new Moralis.Query(Project);
    query.equalTo("objectId", data.projectId);
    const results = await query.find();

    if (results.length > 0) {
        let project = results[0]

        project.set("items", data.items);
        project.set("imagesURI", data.imagesURI);
        project.set("metadataURI", data.metadataURI);
        project.set("contractURI", data.contractURI);
        project.save()
        return true
    } else {
        return false
    }
}


module.exports = { updateProject }