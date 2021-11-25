import Moralis from 'moralis'
Moralis.enableWeb3();
import { store } from '../store'


const moralisHelper = {}


moralisHelper.createProject = async (data) => {

    const Project = Moralis.Object.extend("Projects");
    const _project = new Project();

    _project.set("name", data.name);
    _project.set("userID", store.state.user.id)
    _project.set("sheetID", data.sheetID);
    _project.set("items", 0);
    _project.set("imagesURI", "");
    _project.set("metadataURI", "");
    _project.set("contractURI", "");

    let project
    await _project.save().then((result) => {
        project = {
            id: result.id,
            name: result.get("name"),
            userID: result.get("userID").substring(0, 5) + "...",
            sheetID: result.get("sheetID").substring(0, 5) + "...",
            imagesURI: result.get("imagesURI").substring(0, 5) + "...",
            metadataURI: result.get("metadataURI").substring(0, 5) + "...",
            contractURI: result.get("contractURI").substring(0, 5) + "...",
        }
    });
    return project

}

moralisHelper.getProjects = async () => {
    //  console.log("id: ", store.state.user.id)
    const Project = Moralis.Object.extend("Projects");
    const query = new Moralis.Query(Project);
    query.equalTo("userID", store.state.user.id);
    const results = await query.find();
    let projects = []
    for (let i = 0; i < results.length; i++) {
        let result = results[i]
        let project = {
            id: result.id,
            name: result.get("name"),
            userID: result.get("userID").substring(0, 5) + "...",
            sheetID: result.get("sheetID").substring(0, 5) + "...",
            imagesURI: result.get("imagesURI").substring(0, 5) + "...",
            items: result.get("items"),
            metadataURI: result.get("metadataURI").substring(0, 5) + "...",
            contractURI: result.get("contractURI").substring(0, 5) + "...",
        }
        //  console.log('project trunc', project);
        projects.push(project)
    }
    return projects
}

moralisHelper.getProject = async (id) => {
    //  console.log("id: ", store.state.user.id)
    const Project = Moralis.Object.extend("Projects");
    const query = new Moralis.Query(Project);
    query.equalTo("objectId", id);
    const results = await query.find();
    let project
    if (results.length > 0) {
        let result = results[0]
        project = {
            id: result.id,
            name: result.get("name"),
            userID: result.get("userID"),
            sheetID: result.get("sheetID"),
            imagesURI: result.get("imagesURI"),
            items: result.get("items"),
            metadataURI: result.get("metadataURI"),
            contractURI: result.get("contractURI"),
        }
        return project
    }
}


moralisHelper.updateProject = async (data) => {
    //  console.log("updating: ", data.projectId)
    const Project = Moralis.Object.extend("Projects");
    const query = new Moralis.Query(Project);
    query.equalTo("objectId", data.projectId);
    const results = await query.find();

    if (results.length > 0) {
        let project = results[0]
        let _project = {
            id: project.id,
            name: project.get("name"),
            userID: project.get("userID"),
            sheetID: project.get("sheetID"),
            imagesURI: project.get("imagesURI"),
            items: project.get("items"),
            metadataURI: project.get("metadataURI"),
            contractURI: project.get("contractURI"),
        }
        //  console.log("project", _project)

        project.set("imagesURI", data.imagesURI);
        project.set("metadataURI", data.metadataURI);
        project.set("contractURI", data.contractURI);
        project.save()
        return true
    } else {
        return false
    }
}


moralisHelper.deleteProject = async (id) => {
    //  console.log("deleting: ", id)
    const Project = Moralis.Object.extend("Projects");
    const query = new Moralis.Query(Project);
    query.equalTo("objectId", id);
    const result = await query.find();

    if (result.length > 0) {
        //  console.log("destroying object ", result[0].id)
        result[0].destroy()
        return true
    }
    return false
}





export default moralisHelper