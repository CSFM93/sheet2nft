
<template >
  <v-container fluid :key="key">
    <v-card>
      <v-card-text>
        <p style="color: black" class="text-center font-weight-black text-h4">
          Project details
        </p>
        <v-row class="mt-10 mx-auto" cols="12">
          <p
            style="color: black"
            class="font-weight-black text-h7 text-left col-3"
          >
            Project name:
          </p>
          <p class="font-weight-black text-h7 text-left col-7">
            {{ project.name }}
          </p>
        </v-row>
        <v-row class="mt-1 mx-auto" cols="12">
          <p
            style="color: black"
            class="font-weight-black text-h7 text-left col-3"
          >
            Google Sheet Id:
          </p>
          <p class="font-weight-black text-h7 text-left col-7">
            {{ project.sheetID }}
          </p>
        </v-row>
        <v-row class="mt-1 mx-auto" cols="12">
          <p
            style="color: black"
            class="font-weight-black text-h7 text-left col-3"
          >
            Images URI:
          </p>
          <p class="font-weight-black text-h7 text-left col-7">
            {{ project.imagesURI ? project.imagesURI : "none yet" }}
          </p>
          <v-btn icon color="blue" class="" @click="copyURI(project.imagesURI)">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-row>
        <v-row class="mt-1 mx-auto" cols="12">
          <p
            style="color: black"
            class="font-weight-black text-h7 text-left col-3"
          >
            Metadata URI:
          </p>
          <p class="font-weight-black text-h7 text-left col-7">
            {{ project.metadataURI ? project.metadataURI : "none yet" }}
          </p>
          <v-btn
            icon
            color="blue"
            class=""
            @click="copyURI(project.metadataURI)"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-row>
        <v-row class="mt-1 mx-auto" cols="12">
          <p
            style="color: black"
            class="font-weight-black text-h7 text-left col-3"
          >
            Contract URI:
          </p>
          <p class="font-weight-black text-h7 text-left col-7">
            {{ project.contractURI ? project.contractURI : "none yet" }}
          </p>
          <v-btn
            icon
            color="blue"
            class=""
            @click="copyURI(project.contractURI)"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-row>

        <v-row class="my-2 justify-center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                class="mr-4"
                :disabled="btnUploadLoading"
                :loading="btnUploadLoading"
                @click="uploadAssets(project.sheetID)"
                v-bind="attrs"
                v-on="on"
              >
                Convert
              </v-btn>
            </template>
            <span
              >Convert the contents of your Google Sheet to NFT assets and use
              Moralis as your IPFS storage provider</span
            >
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                class="mr-4"
                :disabled="btnMigrateLoading"
                :loading="btnMigrateLoading"
                v-bind="attrs"
                v-on="on"
                @click="migrateAssets()"
              >
                Migrate
              </v-btn>
            </template>
            <span>Use Web3.Storage as your IPFS storage provider</span>
          </v-tooltip>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-10" v-if="items.length > 0">
      <v-card-text>
        <p style="color: black" class="text-center font-weight-black text-h4">
          Items in collection
        </p>
      </v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex v-for="item in items" :key="item.name" xs4>
            <v-card
              class="mx-2 my-2"
              height="300px"
              width="300px"
              @click="viewItem(item)"
            >
              <v-img :src="item.image" height="80%" width="300px"></v-img>
              <v-card-text>
                <p style="color: black" class="text-center mb-2 text-h6">
                  {{ item.name }}
                </p>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>




<script>
import moralisHelper from "../components/MoralisHelper";
import axios from "axios";
import Moralis from "moralis";
import { bus } from "../main";

import fileManager from "../components/fileManager";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "Item",
  data: () => ({
    project: {},
    key: uuidv4(),
    items: [],
    btnMigrateLoading: false,
    btnUploadLoading: false,
  }),
  computed: {},
  created() {
    //  console.log("route this", this.$route.name);
    this.initialize();
  },
  methods: {
    async initialize() {
      let projectId = this.$route.params.projectId;
      let project = await moralisHelper.getProject(projectId);
      //  console.log("project", project);
      this.project = project;
      this.$store.commit("setProject", project);
      this.getItems();
    },
    async getItems() {
      let requests = [];
      this.items = [];
      if (this.project.items > 0) {
        for (let i = 0; i < this.project.items; i++) {
          let paddedHex = (
            "0000000000000000000000000000000000000000000000000000000000000000" +
            i.toString(16)
          ).substr("-64");
          let itemURI = this.project.metadataURI + "/" + paddedHex + ".json";
          //  console.log("itemURI: ", itemURI);

          let request = axios.get(itemURI);
          requests.push(request);
        }
        await axios
          .all(requests)
          .then(
            axios.spread((...responses) => {
              for (let i = 0; i < responses.length; i++) {
                let item = responses[i].data;
                item.id = i;
                this.items.push(item);
              }
            })
          )
          .catch((errors) => {
            //  console.log("errors", errors);
          });
        //  console.log("items", this.items);
      }
    },
    async uploadAssets(sheetID) {
      try {
        this.btnUploadLoading = true;
        let baseURL = "https://sheet-2-nft-server-i2dvr.ondigitalocean.app";
        let url = `${baseURL}/uploadAssets?sheetId=${sheetID}&projectId=${this.project.id}`;

        //  console.log("url", url);

        await Moralis.enableWeb3();
        let contractAbi = [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
              },
            ],
            name: "ChainlinkCancelled",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
              },
            ],
            name: "ChainlinkFulfilled",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
              },
            ],
            name: "ChainlinkRequested",
            type: "event",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "_requestId",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "_response",
                type: "bytes32",
              },
            ],
            name: "fulfill",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "URL",
                type: "string",
              },
            ],
            name: "requestResponse",
            outputs: [
              {
                internalType: "bytes32",
                name: "requestId",
                type: "bytes32",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "response",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ];
        let ContractAddress = "0x3f8FfF4EC4a949A72B29c4Df6385d4e9F443BF61";

        let options = {
          contractAddress: ContractAddress,
          functionName: "requestResponse",
          abi: contractAbi,
          params: { URL: url },
        };

        await Moralis.executeFunction(options).then((result) => {
          //  console.log("moralis result", result);
          setTimeout(async () => {
            bus.$emit("showNotification", [
              "Assets successfully upload to Moralis IPFS",
              "success",
              3000,
            ]);
            this.btnUploadLoading = false;
            await this.initialize();
            this.key = uuidv4();
          }, 30000);
        });
      } catch (error) {
        this.btnUploadLoading = false;
        bus.$emit("showNotification", [
          "Failed to update project",
          "red",
          3000,
        ]);
      }
    },
    async copyURI(text) {
      try {
        const tmpTextField = document.createElement("textarea");
        tmpTextField.textContent = text;
        tmpTextField.setAttribute("style", "position:absolute; right:200%;");
        document.body.appendChild(tmpTextField);
        tmpTextField.select();
        tmpTextField.setSelectionRange(0, 99999); /*For mobile devices*/
        document.execCommand("copy");
        tmpTextField.remove();
        bus.$emit("showNotification", ["Link copied", "success", 3000]);
      } catch ($e) {
        //  console.log("error", $e);
        bus.$emit("showNotification", ["Failed to copy link", "red", 3000]);
      }
    },
    async viewItem(item) {
      //  console.log("item: ", item);
      let route = "item";
      this.$store.commit("setItem", item);
      this.$route.params.itemId = item.id;
      if (this.$route.name !== route) {
        this.$router.push({ name: route }).catch((error) => {
          //  console.log(error);
        });
      }
    },
    async migrateAssets() {
      if (this.project.metadataURI) {
        try {
          // Download images
          this.btnMigrateLoading = true;
          let images = await fileManager.downloadImages(this.project);
          let imagesCID = await fileManager.uploadFiles(images);
          let imagesURI = `https://ipfs.io/ipfs/${imagesCID}`;
          //  console.log("images CID", imagesCID);

          // Download, edit and upload metadata
          let metadata = await fileManager.downloadMetadata(
            this.project,
            imagesURI
          );
          let metadataCID = await fileManager.uploadFiles(metadata);
          let metadataURI = `https://ipfs.io/ipfs/${metadataCID}`;
          //  console.log("metadataURI", metadataURI);

          // Create and upload contract
          let contract = await fileManager.createContract(
            metadataURI,
            this.project.name
          );
          let contractCID = await fileManager.uploadFiles(contract);
          let contractURI = `https://ipfs.io/ipfs/${contractCID}/MyNFT.sol`;
          //  console.log("contract CID", contractURI);

          // update Project
          let data = {
            projectId: this.project.id,
            imagesURI: imagesURI,
            metadataURI: metadataURI,
            contractURI: contractURI,
          };

          await moralisHelper.updateProject(data).then((result) => {
            if (result) {
              bus.$emit("showNotification", [
                "Assets successfully  migrated to Web3.storage ",
                "success",
                3000,
              ]);
              this.btnMigrateLoading = false;

              setTimeout(async () => {
                await this.initialize();

                this.key = uuidv4();
              }, 3500);
            } else {
              this.btnMigrateLoading = false;

              bus.$emit("showNotification", [
                "Failed to update project",
                "red",
                3000,
              ]);
            }
          });
        } catch (error) {
          //  console.log("error", error);
          this.btnMigrateLoading = false;

          bus.$emit("showNotification", [
            "Failed to migrate files",
            "red",
            3000,
          ]);
        }
      } else {
        this.btnMigrateLoading = false;

        bus.$emit("showNotification", [
          "You need to convert your Google sheet first, before migrating the NFT assets to Web3.storage",
          "red",
          5000,
        ]);
      }
    },
  },
};
</script>