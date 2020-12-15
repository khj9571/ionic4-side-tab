<template>
  <div class="ion-page" main>
    <ion-header>
      <ion-toolbar>
        <span @click="openStart" slot="start">
          <MdMenuIcon w="40px" h="40px" />
        </span>
        <ion-title
          >Menu
          <span>
            <el-select
              v-model="value"
              placeholder="Select"
              @change="onRegionChange"
            >
              <el-option-group
                v-for="group in options"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </span>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content id="content">
      <div style="padding: 10px; border: solid 1px">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="Activity name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Activity name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Activity name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="Activity name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Activity name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Activity name">
                <p id="result"></p>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="8"
              ><div class="grid-content bg-purple">4</div></el-col
            >
            <el-col :span="8"
              ><div class="grid-content bg-purple-light">5</div></el-col
            >
            <el-col :span="8"
              ><div class="grid-content bg-purple">6</div></el-col
            >
          </el-row> -->
        </el-form>
      </div>

      <div class="map_wrap" v-if="mapVisible">
        <vue-daum-map
          :appKey="appKey"
          :center.sync="center"
          :level.sync="level"
          :mapTypeId="mapTypeId"
          :libraries="libraries"
          @load="onLoad"
          style="
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            border: solid 1px;
          "
        />

        <div class="hAddr">
          <span class="title">지도중심기준 행정동 주소정보</span>
          <span id="centerAddr"></span>
        </div>
      </div>
    </ion-content>
  </div>
</template>

<script>
// import { map } from "ionicons/icons";
// import { addIcons } from "ionicons";
// addIcons({
//   "ios-map": map.ios,
//   "md-map": map.md
// });

import seoulMapInfo from "../assets/maps/seoulMap.json";
import seoulLocaleInfo from "../assets/locales/seoulLocale.json";

import MdMenuIcon from "vue-ionicons/dist/md-menu.vue";

import VueDaumMap from "vue-daum-map";

export default {
  components: {
    VueDaumMap,
    MdMenuIcon,
  },
  data: () => {
    return {
      appKey: "fc5d8d39927c118100f488a8296beb60", // 테스트용 appkey    center: { lat: 37.5411, lng: 127.068 },
      center: { lat: 37.5309123241908, lng: 127.0007353858026 }, // 지도의 중심 좌표 33.450701, 126.570667
      level: 10, // 지도의 레벨(확대, 축소 정도),127.0007353858026 /  37.5309123241908
      mapTypeId: VueDaumMap.MapTypeId.NORMAL, // 맵 타입
      libraries: ["services", "drawing"], // 추가로 불러올 라이브러리
      map: null, // 지도 객체. 지도가 로드되면 할당됨.
      markers: [],
      infowindow: null, // 인포 윈도우 참조 객체
      geocoder: null,
      menuInfowindow: null,
      displayedMenuInfowindow: false,

      mapVisible: false,
      form: {
        name: "",
      },
      customOverlay: null,
      polygonInfoWindow: null,
      areas: [],
      options: seoulLocaleInfo.list,
      value: "",
    };
  },
  methods: {
    onLoad(map) {
      this.map = map;

      this.geocoder = new kakao.maps.services.Geocoder();

      this.customOverlay = new kakao.maps.CustomOverlay({});
      this.polygonInfoWindow = new kakao.maps.InfoWindow({ removable: true });

      this.addInfo(this.map);
      this.createInforMenu();
      this.loadMapData();

      this.areas.forEach((d) => {
        this.displayArea(d);
      });

      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
      var mapTypeControl = new kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
      var zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(map, "idle", () => {
        this.searchAddrFromCoords(map.getCenter(), this.displayCenterInfo);
      });

      kakao.maps.event.addListener(map, "center_changed", function () {
        // 지도의  레벨을 얻어옵니다
        // var level = map.getLevel();

        // // 지도의 중심좌표를 얻어옵니다
        // var latlng = map.getCenter();

        // var message = ""; //"<p>지도 레벨은 " + level + " 이고</p>";
        // message +=
        //   "<p>중심 좌표는 위도 " +
        //   latlng.getLat() +
        //   ", 경도 " +
        //   latlng.getLng() +
        //   "레벨 =>" +
        //   level +
        //   "</p>";

        // var resultDiv = document.getElementById("result");
        // resultDiv.innerHTML = message;
      });
    },
    addInfo(map) {
      var marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
        infowindow = new kakao.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

      kakao.maps.event.addListener(map, "click", (mouseEvent) => {
        if (this.displayedMenuInfowindow) {
          console.log(this.menuInfowindow);
          this.menuInfowindow.close();
          this.displayedMenuInfowindow = false;
        }

        this.searchDetailAddrFromCoords(mouseEvent.latLng, (result, status) => {
          console.log(mouseEvent);

          if (status === kakao.maps.services.Status.OK) {
            var detailAddr = !!result[0].road_address
              ? "<div>도로명주소 : " +
                result[0].road_address.address_name +
                "</div>"
              : "";
            detailAddr +=
              "<div>지번 주소 : " + result[0].address.address_name + "</div>";

            var content =
              '<div class="bAddr">' +
              '<span class="title">법정동 주소정보</span>' +
              detailAddr +
              "</div>";

            // 마커를 클릭한 위치에 표시합니다
            marker.setPosition(mouseEvent.latLng);
            marker.setMap(map);

            // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
            infowindow.setContent(content);
            infowindow.open(map, marker);
          }
        });
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "click", () => {
        // 마커 위에 인포윈도우를 표시합니다

        if (!this.displayedMenuInfowindow) {
          this.menuInfowindow.open(map, marker);
          this.displayedMenuInfowindow = true;

          this.infowonodwReset();
        } else {
          this.menuInfowindow.close();
          this.displayedMenuInfowindow = false;
        }
      });
    },
    searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      this.geocoder.coord2RegionCode(
        coords.getLng(),
        coords.getLat(),
        callback
      );
    },

    searchDetailAddrFromCoords(coords, callback) {
      // 좌표로 법정동 상세 주소 정보를 요청합니다
      this.geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    },
    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    displayCenterInfo(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        var infoDiv = document.getElementById("centerAddr");

        for (var i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === "H") {
            infoDiv.innerHTML = result[i].address_name;
            break;
          }
        }
      }
    },
    createInforMenu() {
      this.menuInfowindow = new kakao.maps.InfoWindow({
        title: "메뉴",
        zindex: 1,
      });
      // var content = `
      //   <span class="info-title">
      //       <ul style='list-style:none;'>
      //         <li>
      //           <input type='button' value='추가'/>
      //         </li>
      //         <li>
      //           <input type='button' value='삭제'/>
      //         </li>
      //         </ul>
      //    </span>
      //   `;

      var content = `
        <span class="info-title">
             <input type='button' value='추가'><br/>
             <input type='button' value='삭제'>
         </span>
      `;
      this.menuInfowindow.setContent(content);
    },
    infowonodwReset() {
      var infoTitle = document.querySelectorAll(".info-title");
      infoTitle.forEach(function (e) {
        var w = e.offsetWidth + 10;
        var ml = w / 2;
        e.parentElement.style.top = "112px"; // 82
        e.parentElement.style.left = "50%";
        e.parentElement.style.marginLeft = -ml + "px";
        e.parentElement.style.width = w + "px";
        e.parentElement.previousSibling.style.display = "none";
        e.parentElement.parentElement.style.border = "0px";
        e.parentElement.parentElement.style.background = "unset";
      });
    },
    displayArea(area) {
      // 다각형을 생성합니다
      var polygon = new kakao.maps.Polygon({
        map: this.map, // 다각형을 표시할 지도 객체
        path: area.path,
        strokeWeight: 2,
        strokeColor: "#004c80",
        strokeOpacity: 0.8,
        fillColor: "#fff",
        fillOpacity: 0.1,
      });

      // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
      // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
      kakao.maps.event.addListener(polygon, "mouseover", (mouseEvent) => {
        polygon.setOptions({
          fillColor: "#fff",
          fillOpacity: 0.1,
          strokeWeight: 5,
        });

        var content = "<div class='area'>" + area.name + "</div>";

        this.customOverlay.setContent(content);

        this.customOverlay.setPosition(mouseEvent.latLng);
        this.customOverlay.setMap(this.map);
      });

      // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
      kakao.maps.event.addListener(polygon, "mousemove", (mouseEvent) => {
        this.customOverlay.setPosition(mouseEvent.latLng);
      });

      // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
      // 커스텀 오버레이를 지도에서 제거합니다
      kakao.maps.event.addListener(polygon, "mouseout", () => {
        polygon.setOptions({
          fillColor: "#fff",
          fillOpacity: 0.1,
          strokeWeight: 2,
        });
        this.customOverlay.setMap(null);
      });

      // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
      kakao.maps.event.addListener(polygon, "click", (mouseEvent) => {
        // var content =
        //   '<div class="info">' +
        //   '   <div class="title">' +
        //   area.name +
        //   "</div>" +
        //   '   <div class="size">총 면적 : 약 ' +
        //   Math.floor(polygon.getArea()) +
        //   " m<sup>2</sup></area>" +
        //   "</div>";
        // this.polygonInfoWindow.setContent(content);
        // this.polygonInfoWindow.setPosition(mouseEvent.latLng);
        // this.polygonInfoWindow.setMap(this.map);
      });
    },
    loadMapData() {
      const areas = seoulMapInfo.features.map((d, idx) => {
        const { name } = d.properties;
        const [coordinates] = d.geometry.coordinates;
        const path = [];

        coordinates.forEach((c) => {
          const [x, y] = c;
          path.push(new kakao.maps.LatLng(y, x));
        });

        const obj = {
          name: name,
          path: path,
        };

        return obj;
      });

      this.areas = areas;
    },

    onRegionChange(d) {
      var currentObj = null;
      var isFind = this.options.some((p) => {
        const { options } = p;

        var find = options.some((c) => {
          if (c.value == d) {
            currentObj = c;
            return true;
          }
          return false;
        });

        return find;
      });

      if (!isFind) return;

      //{ lat: 37.5309123241908, lng: 127.0007353858026 }

      const { pos } = currentObj;

      console.log(pos);

      if (JSON.stringify(pos) == "{}") return;

      const { lat, lng } = pos;

      var moveLatLon = new kakao.maps.LatLng(lat, lng);

      this.map.setLevel(7);

      this.$nextTick(() => {
        this.map.panTo(moveLatLon);
      });
    },
  },
  created() {},
  mounted() {
    //  this.$nextTick(()=>{
    //    this.mapSize = true
    //  });
    //this.mapVisible = true

    setTimeout(() => {
      this.mapVisible = true;
    }, 100);
  },
};
</script>

<style lang="scss" scoped>
/* .map_wrap {position:relative;width:100%;height:350px;}
    .title {font-weight:bold;display:block;}
    .hAddr {position:absolute;left:10px;top:10px;border-radius: 2px;background:#fff;background:rgba(255,255,255,0.8);z-index:1;padding:5px;}
    #centerAddr {display:block;margin-top:2px;font-weight: normal;}
    .bAddr {padding:5px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;} */
.map_wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.title {
  font-weight: bold;
  display: block;
}
.hAddr {
  position: absolute;
  left: 10px;
  top: 10px;
  border-radius: 2px;
  background: #fff;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1;
  padding: 5px;
}
#centerAddr {
  display: block;
  margin-top: 2px;
  font-weight: normal;
}

/deep/ {
  .bAddr {
    padding: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .area {
    position: absolute;
    background: #fff;
    border: 1px solid #888;
    border-radius: 3px;
    font-size: 12px;
    top: -5px;
    left: 15px;
    padding: 2px;
  }
}

.info-title {
  display: block;
  /* background: #50627f;
  color: #fff; */
  text-align: center;
  /* height: 24px; */
  line-height: 22px;
  /* border-radius: 4px;
  padding: 0px 10px; */
}

.info {
  font-size: 12px;
  padding: 5px;
}
.info .title {
  font-weight: bold;
}

.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>