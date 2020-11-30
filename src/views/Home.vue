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
      <vue-daum-map
        :appKey="appKey"
        :center.sync="center"
        :level.sync="level"
        :mapTypeId="mapTypeId"
        :libraries="libraries"
        @load="onLoad"
        style="width: 100%; height: 100%"
      />
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
      libraries: [], // 추가로 불러올 라이브러리
      map: null, // 지도 객체. 지도가 로드되면 할당됨.
      markers: [],
      infowindow: null, // 인포 윈도우 참조 객체
    };
  },
  methods: {
    onLoad(map) {
      this.map = map;

      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
      var mapTypeControl = new kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
      var zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      const createInfoWindow = (iwPosition) => {
        var iwContent = `<div style="padding:5px;">
          <input type="button" value="val" onclick="msg()"> </input>
        </div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        //  iwPosition = iwPosition; // new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
        var iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

        var infowindow = new kakao.maps.InfoWindow({
          map: map, // 인포윈도우가 표시될 지도
          position: iwPosition,
          content: iwContent,
          removable: iwRemoveable,
        });

        return infowindow;
      };

      kakao.maps.event.addListener(map, "rightclick", (e) => {
        console.log("멍미", this.infowindow);

        this.infowindow = createInfoWindow(e.latLng);
        // //마커를 생성합니다
        // var marker = new kakao.maps.Marker({
        //   position: e.latLng,
        // });

        // // 마커가 지도 위에 표시되도록 설정합니다
        // marker.setMap(map);

        // // 마커가 드래그 가능하도록 설정합니다
        // marker.setDraggable(true);
      });
    },
  },
  mounted() {
    console.log(window);

    window.msg = () => {
      console.log("멍미2", this.infowindow);
    };
  },
};
</script>