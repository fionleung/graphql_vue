<template>
  <div id="app">
    <SearchAutocomplete
      :results="this.filterStates"
      @setState="selected($event)"
      @searchState="getStates($event)"
    />

    {{ selectedState }}
    <GoogleMap />
  </div>
</template>

<script>
import gql from "graphql-tag";
import SearchAutocomplete from "./components/SearchAutocomplete.vue";
import GoogleMap from "./components/GoogleMap.vue";
export default {
  name: "app",
  states: [],
  components: {
    SearchAutocomplete,
    GoogleMap,
  },
  data() {
    return {
      selectedState: null,
      filterStates: [],
    };
  },
  apollo: {},
  methods: {
    selected(state) {
      this.selectedState = state;
      this.$apollo
        .query({
          query: gql`
            query ($key: String!) {
              Geo(key: $key) {
                geo
              }
            }
          `,
          variables: {
            key: state,
          },
        })
        .then((res) => {
          //console.log(res.data.Geo)
          let obj = JSON.parse(res.data.Geo.geo);
          this.$children[1].renderData(state, obj);
        });
    },
    getStates(keyword) {
      this.filterStates = [];
      this.$apollo
        .query({
          query: gql`
            query ($key: String!) {
              States(key: $key) {
                statename
              }
            }
          `,
          variables: {
            key: keyword,
          },
        })
        .then((res) =>
          res.data.States.forEach((ele) =>
            this.filterStates.push(ele.statename)
          )
        );
    },
  },
};
</script>
<style></style>
