<template>
  <div class="ion-page" main>
    <ion-header>
      <ion-toolbar>
        <span @click="openStart" slot="start">
          <MdMenuIcon w="40px" h="40px" />
        </span>
        <ion-title>Menu - Basic</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="map_wrap">
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
      level: 13, // 지도의 레벨(확대, 축소 정도),127.0007353858026 /  37.5309123241908
      mapTypeId: VueDaumMap.MapTypeId.NORMAL, // 맵 타입
      libraries: ["services"], // 추가로 불러올 라이브러리
      map: null, // 지도 객체. 지도가 로드되면 할당됨.
      markers: [],
      infowindow: null, // 인포 윈도우 참조 객체
      geocoder: null,
      menuInfowindow: null,
      displayedMenuInfowindow: false
    };
  },
  methods: {
    onLoad(map) {
      this.map = map;

      this.geocoder = new kakao.maps.services.Geocoder();

      // console.log(new kakao.maps.services.Geocode())

      this.addInfo(this.map);
      this.createInforMenu();

      // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(map, "idle", () => {
        this.searchAddrFromCoords(map.getCenter(), this.displayCenterInfo);
      });
    },
    addInfo(map) {
      var marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
        infowindow = new kakao.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

      kakao.maps.event.addListener(map, "click", (mouseEvent) => {

         if(this.displayedMenuInfowindow) {

           console.log(this.menuInfowindow)
             this.menuInfowindow.close()
             this.displayedMenuInfowindow = false
         }


        this.searchDetailAddrFromCoords(mouseEvent.latLng, (result, status) => {
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
        //infowindow.open(map, marker);

        this.menuInfowindow.open(map, marker);
        this.displayedMenuInfowindow = true;
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
      this.menuInfowindow = new kakao.maps.InfoWindow({title:'메뉴', zindex: 1 });
      var content = `
        <div>
            <ul style='list-style:none;'> 
              <li>
                <input type='button' value='추가'/>
              </li> 
              <li>
                <input type='button' value='삭제'/>
              </li> 
              </ul>
         </div>
        `;
      this.menuInfowindow.setContent(content);
    },
  },
  mounted() {},
};
</script>

<style>
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
.bAddr {
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>