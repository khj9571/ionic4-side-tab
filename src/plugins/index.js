const AppPlugIn = {};

AppPlugIn.install = function (Vue, options) {
    console.log('안녕')

    // 1. 전역 메소드 또는 속성 추가
    // Vue.myGlobalMethod = function () {
    //   // 필요한 로직 ...
    // }

    // 2. 전역 에셋 추가
    // Vue.directive('my-directive', {
    //   bind (el, binding, vnode, oldVnode) {
    //     // 필요한 로직 ...
    //   }

    // })

    // 3. 컴포넌트 옵션 주입
    Vue.mixin({
        // created: function () {
        //     // 필요한 로직 ...
        // },
        methods: {
            openStart() {
                document.querySelector("ion-menu-controller").open("start");
            },
            closeStart() {
                document.querySelector("ion-menu-controller").close("start");
            },
            openEnd() {
                document.querySelector("ion-menu-controller").open("end");
            },
        }

    })

    // 4. 인스턴스 메소드 추가
    // Vue.prototype.$createConfirmSave = () => {
    //     // 필요한 로직 ...
    //     const message = '저장 하시겠습니까?';
    //     const title = '확인';

    //     return Vue.prototype.$confirm(message, title, {
    //         confirmButtonText: 'OK',
    //         cancelButtonText: 'Cancel',
    //         type: 'info',
    //         center: true
    //     })

    // }


    // Vue.prototype.$createConfirmDelete = () => {

    //     const message = '삭제 하시겠습니까?';
    //     const title = '확인';

    //     return Vue.prototype.$confirm(message, title, {
    //         confirmButtonText: 'OK',
    //         cancelButtonText: 'Cancel',
    //         type: 'info',
    //         center: true
    //     })

    // }


    // Vue.prototype.$createAlert = ({title,msg}) => {
    //     Vue.prototype.$alert(msg, title, {
    //         confirmButtonText: 'OK',
    //         callback: action => {

    //         }
    //     });

    // }
}


export default AppPlugIn;
