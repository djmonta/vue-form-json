<template>
  <div style="margin-bottom:.5rem;" class="field is-grouped mb-5">
    <p class="control">
      <input name="lat" :value="coordinates.lat ? coordinates.lat : ''" class="input" placeholder="Latitude" readonly>
    </p>
    <p class="control">
      <input name="lng" :value="coordinates.lng ? coordinates.lng : ''" class="input" placeholder="Longitude" readonly>
    </p>
    <p class="control">
      <el-button type="primary" icon="el-icon-location" class="btn-link" @click="beforeOpen">地図で位置を確認</el-button>
    </p>
    <el-dialog title="店舗位置" :visible.sync="dialogVisible" width="30rem" :before-close="handleClose">
      <input name="modal-input" type="hidden" :value="address">
      <gmap-map id="map" :center="center" :zoom="16" style="width: 100%; height: 400px">
        <gmap-marker
          :key="index"
          v-for="(m, index) in markers"
          :position="center = m.position"
          :clickable="true"
          :draggable="true"
          @click="center=m.position"
          @dragend="updateCoordinates"
        ></gmap-marker>
      </gmap-map>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">戻る</el-button>
        <el-button type="primary" @click="confirmButtonClick">適用</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps'

export default {
  name: 'popupMap',
  props: {
    address: String
  },
  data () {
    return {
      center: { lat: 35, lng: 139 },
      markers: [{ position: { lat: 35, lng: 139 } }],
      places: [],
      currentPlace: null,
      coordinates: {},
      description: '',
      inputValue: '',
      dialogVisible: false
    }
  },
  watch: {
    address: function (newValue) {
      this.address = newValue
    }
  },
  methods: {
    beforeOpen () {
      const value = this.address
      this.$gmapApiPromiseLazy().then(google => {
        let theLocation = value
        let geocoder = new google.maps.Geocoder()
        geocoder.geocode(
          { address: theLocation },
          function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              this.center.lat = results[0].geometry.viewport.na.j
              this.center.lng = results[0].geometry.viewport.ga.j
              this.markers[0].position.lat = results[0].geometry.viewport.na.j
              this.markers[0].position.lng = results[0].geometry.viewport.ga.j
              this.coordinates.lat = results[0].geometry.viewport.na.j
              this.coordinates.lng = results[0].geometry.viewport.ga.j
            }
          }.bind(this)
        )
      })
      this.dialogVisible = true
    },
    handleClose (done) {
      this.dialogVisible = false
    },
    confirmButtonClick () {
      this.dialogVisible = false
      this.$root.$emit('confirmPosition', this.coordinates)
    },
    updateCoordinates (location) {
      this.coordinates = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      }
      // console.log(this.coordinates)
    }
  }
}
</script>

<style lang="stylus" scoped>
input
  line-height 2
  width 8rem

.btn-link
  margin-left 1rem

</style>
