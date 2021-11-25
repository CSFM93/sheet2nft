// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";


contract Sheet2NFT is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    string public response;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    /**
     * Network: Kovan
     * Oracle: 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8 (Chainlink Devrel
     * Node)
     * Job ID: 7401f318127148a894c00c292e486ffd
     * Fee: 0.1 LINK
     */
    constructor() {
        setPublicChainlinkToken();
        oracle = 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8;
        jobId = "7401f318127148a894c00c292e486ffd";
        fee = 0.1 * 10**18; // (Varies by network and job)
    }

    /**
     * Create a Chainlink request to convert data in sheet to NFT data and  retrieve API response
     */
    function requestResponse(string memory URL) public  returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        

        // Set the URL to perform the GET request on
        request.add("get", URL);
        request.add("path", "msg");

        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    

    /**
     * Receive the response in the form of bytes32 and convert it to a string
     */
    function fulfill(bytes32 _requestId, bytes32 _response)
        public
        recordChainlinkFulfillment(_requestId)
    {
        response = bytes32ToString(_response);
    }
    
    
    

    function bytes32ToString(bytes32 _bytes32)
        private
        pure
        returns (string memory)
    {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

}
