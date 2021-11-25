import axios from 'axios'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'


let fileManager = {}

fileManager.downloadImages = async (project) => {
    if (project.items > 0) {
        let requests = []
        let filenames = []
        let files = []
        for (let i = 0; i < project.items; i++) {
            let paddedHex = (
                "0000000000000000000000000000000000000000000000000000000000000000" +
                i.toString(16)
            ).substr("-64");
            let filename = paddedHex + ".png";
            filenames.push(filename)
            let imageURI = project.imagesURI + "/" + filename
            //  console.log("imageRI: ", i, imageURI);

            let request = axios({
                url: imageURI,
                method: 'GET',
                responseType: 'blob',
            })
            requests.push(request);
        }
        await axios
            .all(requests)
            .then(
                axios.spread((...responses) => {
                    for (let i = 0; i < responses.length; i++) {
                        let blob = new Blob([responses[i].data])
                        let file = new File([blob], filenames[i])
                        //  console.log('file', file)
                        files.push(file)
                    }
                })
            )
            .catch((errors) => {
                //  console.log("errors", errors);
            });
        //  console.log("files", files);
        return files
    } else {
        return undefined
    }
}


fileManager.downloadMetadata = async (project, imageURI) => {
    if (project.items > 0) {
        let requests = []
        let filenames = []
        let files = []
        for (let i = 0; i < project.items; i++) {
            let paddedHex = (
                "0000000000000000000000000000000000000000000000000000000000000000" +
                i.toString(16)
            ).substr("-64");
            let filename = paddedHex + ".json";
            filenames.push(filename)
            let metadataURI = project.metadataURI + "/" + filename
            //  console.log("metadataURI: ", i, metadataURI);

            let request = axios({
                url: metadataURI,
                method: 'GET',
            })
            requests.push(request);
        }
        await axios
            .all(requests)
            .then(
                axios.spread((...responses) => {
                    for (let i = 0; i < responses.length; i++) {
                        let paddedHex = (
                            "0000000000000000000000000000000000000000000000000000000000000000" +
                            i.toString(16)
                        ).substr("-64");
                        let imageName = paddedHex + ".png";
                        let metadata = responses[i].data
                        metadata.image = `${imageURI}/${imageName}`
                        const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
                        let file = new File([blob], filenames[i])
                        files.push(file)
                        //  console.log('metadata', metadata)
                    }
                })
            )
            .catch((errors) => {
                //  console.log("errors", errors);
            });
        //  console.log("files", files);
        return files
    } else {
        return undefined
    }
}


fileManager.uploadFiles = async (files) => {
    const client = new Web3Storage({ token: process.env.VUE_APP_WEB_STORAGE_API_KEY })
    const cid = await client.put(files)
    //  console.log('stored files with cid:', cid)
    return cid
}


fileManager.createContract = async (metadataURI, contractName) => {
    let files = []
    let contract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
    
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract MyNFT is ERC1155, Ownable, ERC1155Burnable {
    string public name = "${contractName}";

    constructor() ERC1155("${metadataURI}") {
        _mint(msg.sender, 0, 1, "");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
}
    `
    let file = new File([contract], 'MyNFT.sol')
    //  console.log('contract',file)
    files.push(file)
    //  console.log('files',file)
    return files
}


export default fileManager