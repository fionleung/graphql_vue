<template>
  <div class="autocomplete">
    <input v-model="search" @input="onChange" type="text" />
    <ul v-show="isOpen" class="autocomplete-results">
      <li
        v-for="(result, i) in results"
        :key="i"
        @click="setResult(result)"
        class="autocomplete-result"
      >
        {{ result }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SearchAutocomplete",
  props: {
    results: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      search: "",
      isOpen: false,
    };
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    },
    setResult(result) {
      this.search = result;
      this.isOpen = false;
      this.$emit("setState", result);
    },

    onChange() {
      this.isOpen = true;
      this.$emit("searchState", this.search);
      //console.log(this.results);
    },
  },
};
</script>

<style>
.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  min-height: 1em;
  max-height: 6em;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}
</style>
