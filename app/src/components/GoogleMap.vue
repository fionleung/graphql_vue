<template>
  <div id="map-container">
    <div id="map" ref="map"></div>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  props: {
    results: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      map: null,
      polygon: null,
      infowindow: null,
    };
  },
  mounted() {
    //console.log(window.google.maps);
    this.map = new window.google.maps.Map(this.$refs["map"], {
      zoom: 4,
      center: new window.google.maps.LatLng(39.3, -95.8),
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    });
  },
  methods: {
    convertCoordinates(coordinates) {
      let paths = [];
      let bounds = new window.google.maps.LatLngBounds();

      if (coordinates.length == 1) {
        for (let i = 0; i < coordinates.length; i++) {
          for (let j = 0; j < coordinates[i].length; j++) {
            let latLng = new window.google.maps.LatLng(
              coordinates[i][j][1],
              coordinates[i][j][0]
            );
            paths.push(latLng);
            bounds.extend(latLng);
          }
        }
      } else {
        for (let i = 0; i < coordinates.length; i++) {
          let region = this.convertCoordinates(coordinates[i]);
          paths.push(region.paths);
          bounds.union(region.bounds);
        }
      }
      return { paths: paths, bounds: bounds };
    },
    render(state, region) {
      if (this.polygon) {
        this.polygon.setMap(null);
      }

      this.polygon = new window.google.maps.Polygon({
        strokeWeight: 0.3,
        fillOpacity: 0.2,
        paths: region.paths,
        fillColor: "#66f6fd",
      });

      this.polygon.setMap(this.map);

      let htmlContent = this.recordHtmlContent(state);
      this.handle_clicks(this.polygon, htmlContent);

      this.map.fitBounds(region.bounds);
    },
    renderData(state, data) {
      console.log(data);
      let region = this.convertCoordinates(data.coordinates);
      this.render(state, region);
    },

    recordHtmlContent(state) {
      let content = "<b>" + "state" + "</b>: " + state + "<br>";
      return content;
    },

    handle_clicks(overlay, info) {
      window.google.maps.event.addListener(overlay, "click", function (e) {
        if (typeof this.infowindow != "undefined") {
          this.infowindow.close();
        }

        this.infowindow = new window.google.maps.InfoWindow({
          content: info,
          position: e.latLng,
          map: this.map,
        });
      });
    },
  },
};
</script>

<style>
#map {
  height: 600px;
}
</style>
