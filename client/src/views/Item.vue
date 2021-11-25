
<template>
  <v-container fluid v-if="item !== {}">
    <v-row>
      <v-col class="col-5">
        <v-card
          v-model="item"
          :key="item.name"
          height="368px"
          width="508px"
          justify="center"
          class="d-flex align-center"
        >
          <v-img
            :src="item.image"
            height="80%"
            width="80%"
            style="margin-left: 10%; margin-right: 10%"
          ></v-img>
        </v-card>
      </v-col>
      <v-col class="col-6 ml-4">
        <p style="color: black" class="font-weight-black text-h4 text-left">
          {{ project.name }}
        </p>
        <v-row class="mt-5">
          <p style="color: black" class="font-weight-black text-h6 text-left">
            Item name:
          </p>
          <p style="color: black" class="text-h6 ml-2">
            {{ item.name }}
          </p>
        </v-row>
        <v-row class="mt-2">
          <p style="color: black" class="font-weight-black text-h6 text-left">
            Description:
          </p>
          <p style="color: black" class="text-h6 ml-2">
            {{ item.description }}
          </p>
        </v-row>
        <v-row class="mt-2">
          <p style="color: black" class="font-weight-black text-h6 text-left">
            External URL:
          </p>
          <p
            style="color: black; max-width: 350px"
            class="text-h6 ml-2 text-truncate"
          >
            {{ item.external_url !== "" ? item.external_url : "empty" }}
          </p>
          <v-btn icon color="blue" class="" @click="copyURI(item.external_url)">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-row>
        <v-row class="mt-2">
          <p style="color: black" class="font-weight-black text-h6 text-left">
            Image URI:
          </p>
          <p
            style="color: black; max-width: 350px"
            class="text-h6 ml-2 text-truncate"
          >
            {{ item.image }}
          </p>
          <v-btn icon color="blue" class="" @click="copyURI(item.image)">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>




<script>
import axios from "axios";
import { bus } from "../main";

export default {
  name: "Item",
  data: () => ({
    project: {},
    item: {},
  }),
  computed: {},
  created() {
    //  console.log("route this", this.$route.name);
    this.initialize();
  },
  methods: {
    async initialize() {
      this.project = await this.$store.state.project;
      this.item = await this.$store.state.item;
      //  console.log("item: ", this.item);
    },
    async getItems() {
      let requests = [];
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
      let url = "http://localhost:3002/uploadAssets";
      let data = {
        sheetId: sheetID,
        projectId: this.project.id,
      };
      //  console.log("data", data);
      axios
        .post(url, { data })
        .then((res) => {
          //  console.log("res", res.data);
        })
        .catch((err) => {
          //  console.log("error", err);
        });
    },
    async copyURI(text) {
      try {
        const tmpTextField = document.createElement("textarea");
        tmpTextField.textContent = text;
        tmpTextField.setAttribute("style", "position:absolute; right:200%;");
        document.body.appendChild(tmpTextField);
        tmpTextField.select();
        tmpTextField.setSelectionRange(0, 99999); 
        document.execCommand("copy");
        tmpTextField.remove();
        bus.$emit("showNotification", ["Link copied", "success", 3000]);
      } catch ($e) {
        bus.$emit("showNotification", ["Failed to copy link", "red", 3000]);
      }
    },
    async viewItem(item) {
      let route = "item";
      this.$store.commit("setItem", item);
      this.$route.params.itemId = item.id;
      if (this.$route.name !== route) {
        this.$router.push({ name: route }).catch((error) => {
          //  console.log(error);
        });
      }
    },
  },
};
</script>