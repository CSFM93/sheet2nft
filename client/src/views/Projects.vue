<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    sort-by="name"
    class="elevation-2 mt-8"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Projects</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
              >New Project</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row v-for="(value, key) in editedItem" v-bind:key="key">
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="editedItem[key]"
                      :label="key"
                      v-if="key !== 'id'"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <!-- change this in the tutorial to disable warning-->
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn icon color="success" class="" @click="viewProject(item.id)">
        <v-icon small>mdi-eye</v-icon>
      </v-btn>
      <v-btn icon color="red" class="ml-2" @click="deleteItem(item)">
        <v-icon small color="danger">mdi-delete</v-icon>
      </v-btn>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>



<script>
import moralisHelper from "../components/MoralisHelper";
import { bus } from "../main";

export default {
  name: "Projects",
  data: () => ({
    dialog: false,
    headers: [
      { text: "ID", value: "id" },
      { text: "Name", value: "name" },
      { text: "sheetId", value: "sheetID" },
      { text: "images URI", value: "imagesURI" },
      { text: "metadata URI", value: "metadataURI" },
      { text: "contract URI", value: "contractURI" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    rows: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      sheetID: "",
    },
    defaultItem: {
      name: "",
      sheetID: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    //  console.log("route this", this.$route.name);
    this.initialize();
  },
  methods: {
    async initialize() {
      let projects = await moralisHelper.getProjects();
      //  console.log("projects", projects);
      this.rows = projects;
    },
    editItem(item) {
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteItem(item) {
      const index = this.rows.indexOf(item);
      confirm("Are you sure you want to delete this project?") &&
        (await moralisHelper.deleteProject(item.id));
      this.rows.splice(index, 1);
      bus.$emit("showNotification", [
        "Project deleted successfuly",
        "success",
        3000,
      ]);
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async save() {
      if (this.editedIndex > -1) {
        //  console.log("edited", this.editedItem);
      } else {
        await moralisHelper.createProject(this.editedItem).then((project) => {
          this.rows.push(project);
          bus.$emit("showNotification", [
            "Project created successfuly",
            "success",
            3000,
          ]);
        });
      }
      this.close();
    },
    viewProject(id) {
      let route = "project";
      this.$route.params.projectId = id;
      if (this.$route.name !== route) {
        this.$router.push({ name: route }).catch((error) => {
          //  console.log(error);
        });
      }
    },
  },
};
</script>