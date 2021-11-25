# sheet2nft

Sheet2NFT is a no-code tool that I built with the help of Vue, Node.js, Google Sheets, Chainlink, Moralis, IPFS, Web3.Storage, and Filecoin, that allows users to easily create NFTs assets without knowing how to code, the only thing left for the user to do after using this tool is to deploy the NFT contract. Sheet2NFT will upload the images to IPFS, generate and upload the metadata to IPFS, generate an ERC-1155 contract, insert the metadata URI and upload it to IPFS.

## Directory structure
This repository contains the following directories:
- Server;
- Client;
- Smart contracts.

**Server**
This directory contains the code of the Express application responsible for retrieving the data from a Google Sheet and turn it to NFT assets. This application will upload the images to IPFS, generate and upload the metadata to IPFS, generate an ERC-1155 contract, insert the metadata URI and upload it to IPFS.


**Client**
This directory the code of the Sheet2NFT frontend application. It is a Vue app the uses Moralis,Chainlink, and Web3.Storage.

**Smart contracts**
This directory contains the following solidity files:
- `Sheet2NFT` : this is the smart contract file that uses Chainlink to send an HTTP GET request containing the `sheetId` and `projectId` to the server. The hash of the contract deployed to the Kovan network is `0x3f8FfF4EC4a949A72B29c4Df6385d4e9F443BF61`
- `MyNFT.sol` : this is the sample file that was used to generate an ERC-1155 contract for the user when he converts the data in a Sheet to NFT assets. 


## How to use the app

### Prerequisites
In order to use Sheet2NFT you will need the following: 
- An Ethereum test net Kovan account.
- Images stored in your Google Drive. The images read permission should be set to allow anyone with a link to download them.


### Workflow
1. Upload your images to a folder in your Google Drive account and allow them to be downloaded by any one with the link
2. Make a copy of the sample Google Sheet provided by Sheet2NFT and fill it with your NFT items data (name, images, description,...). In the image field, paste the link of your image stored in Google Drive. At the moment we only accept Google Drive links.
3. Allow anyone with your sheet link to view it and Copy your sheet id
4. Go back to Sheet2NFT and use your Ethereum account to sign in. The authentication process is handled by Moralis and Metamask so your Ethereum account is safe.
5. Create a new project in Sheet2NFT and paste your sheet id. Your project will be saved in Moralis database
6. Click to view the project, and click the button "Convert" to convert the data on your Google Sheet into your NFT
7. After clicking the button mentioned above, We will use your Ethereum account to call a smart contract that uses Chainlink to make an HTTP GET request to Sheet2site server (Kovan network only). The request contains your projectId and sheetId.
8. The server will use the data sent in the request and fetch the desired Google Sheet data. After that, it will download and store the images in a temporary local folder.
9. Once the images are stored locally, the server will use Moralis to upload all of them to a folder in IPFS.
10. The server will get the images URIs in IPFS, use them to create a metadata file for each image URI and then use Moralis upload every metadata file to a folder in IPFS
11. Once every metadata file is uploaded, the server will take the metadata URI and use it to create an Ethereum smart contract file. After the smart contract file with your metadata URI is created, the server will use Moralis to store this file in IPFS.
12. Finally, the server will use Moralis to update your project with the number of items, images, metadata, and contract URI.
13. The only thing left for you to do is copy your contract URI, paste it in the Remix IDE and deploy it 
