<template>
  <v-container>
    <div height="400px" class="mt-10">
      <v-row class="mx-10">
        <v-col cols="6">
          <p style="" class="text-h4">
            Create your own NFT collection using a Google sheet
          </p>
          <p style="" class="text-h8 mt-4">
            Create your NFT collection with a tool that you are already
            familiared with. You won't have to worry about uploading images and
            metadata to IPFS or writing your smart contract from scratch.
          </p>
          <v-row>
            <v-btn class="mt-10" @click="openSampleSheet()" color=""
              >Sample sheet</v-btn
            >
            <v-btn
              class="mt-10 ml-4"
              @click="navigateTo('projects')"
              color="primary"
              >Get started</v-btn
            >
          </v-row>
        </v-col>
        <v-col cols="6">
          <video
            height="300px"
            controls
            loop
            src="https://bafybeidppckbw7seuminz4l47efb6536byzlmb5plwoek3uft2hs7q2ika.ipfs.dweb.link/edit3.mp4"
          ></video>
        </v-col>
      </v-row>
    </div>
    <v-divider class="mt-5"></v-divider>
    <div height="" class="mt-15">
      <v-row class="mx-10 mt-5">
        <v-col cols="12">
          <p style="" class="text-h4 text-center">How does it work ?</p>
          <div class="mt-6 ml-8" v-for="(step, i) in steps" :key="i">
            <p style="" class="text-h8 mt-4 text-left">
              {{ i + 1 }}. {{ step }}
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-5 justify-center">
        <iframe
          id="ytdefer_vid1"
          style="width: 485px; height: 338px; position: relative"
          allowfullscreen="1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="YouTube video player"
          src="https://www.youtube.com/embed/xEvvZ3nLeY4?enablejsapi=1"
          width="485px"
          height="338px"
          frameborder="0"
        ></iframe>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { bus } from "../main";

export default {
  data: () => ({
    steps: [
      "Upload your images to a folder in your Google Drive account and allow them to be downloaded by any one with the link",
      "Make a copy of the sample Google Sheet provided by Sheet2NFT and fill it with your NFT items data (name, images, description,...). In the image field, paste the link of your image stored in Google Drive. At the moment we only accept Google Drive links.",
      "Allow anyone with your sheet link to view it and Copy your sheet id",
      "Go back to Sheet2NFT and use your Ethereum account to sign in. The authentication process is handled by Moralis and Metamask so your Ethereum account is safe.",
      "Create a new project in Sheet2NFT and paste your sheet id. Your project will be saved in Moralis database",
      'Click to view the project, and click the button "Convert" to convert the data on your Google Sheet into your NFT ',
      "After clicking the button mentioned above, We will use your Ethereum account to call a smart contract that uses Chainlink to make an HTTP GET request to Sheet2site server (Kovan network only). The request contains your projectId and sheetId.",
      "The server will use the data sent in the request and fetch the desired Google Sheet data. After that, it will download and store the images in a temporary local folder.",
      "Once the images are stored locally, the server will use Moralis to upload all of them to a folder in IPFS.",
      "The server will get the images URIs in IPFS, use them to create a metadata file for each image URI and then use Moralis upload every metadata file to a folder in IPFS",
      "Once every metadata file is uploaded, the server will take the metadata URI and use it to create an Ethereum smart contract file. After the smart contract file with your metadata URI is created, the server will use Moralis to store this file in IPFS.",
      "Finally, the server will use Moralis to update your project with the number of items, images, metadata, and contract URI.",
      "The only thing left for you to do is copy your contract URI, paste it in the Remix IDE and deploy it",
    ],
  }),
  methods: {
    async navigateTo(route) {
      //  console.log("route");
      let user = await this.$store.state.user;
      //  console.log("user", Object.keys(user).length > 0);

      if (Object.keys(user).length > 0) {
        if (this.$route.name !== route) {
          this.$router.push({ name: route }).catch((error) => {
            //  console.log(error);
          });
        }
      } else {
        bus.$emit("showNotification", [
          "Please use your ethereum account to signin first (Kovan Network only)",
          "red",
          5000,
        ]);
      }
    },
    openSampleSheet() {
      let value =
        "https://docs.google.com/spreadsheets/d/1UGgITdAYQy_xXUaPgsFAYBj2ppH0gjGav25oMaW-6Z8/edit?usp=sharing";
      window.open(value, "_blank");
    },
    showNotification(text, color, timeout) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.timeout = timeout;
      this.snackbar = true;
    },
  },
};
</script>

<style>
.auth {
  min-height: 300;
}
</style>