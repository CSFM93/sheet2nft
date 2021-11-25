const fs = require('fs');
const { uploadContract } = require('./fileManager');
let fileManager = require('./fileManager')


let createContract = async (contractPath, metadata, contractName) => {
    let metadataCID = metadata.replace("https://ipfs.moralis.io", "").split("/")[2]
    let metadataURI = `ipfs://${metadataCID}/metadata/{id}.json`
    // Get Path and Load Contract
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
    let contractURI
    fs.writeFileSync(contractPath, contract);


    console.log("done")
    // fileManager.deleteFiles(sheetID)


}





// console.log(compile("./test.sol"))

// createContract("./test.sol","test")





module.exports = { createContract };
