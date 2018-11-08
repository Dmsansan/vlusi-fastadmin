window.onload = function () {
    let app = new Vue({
        el: '#app',
        data: {},
        methods: {
            goSetting:function () {
                mui.openWindow({
                    url:'user-setting.html'
                })
            },
            goMyCollection:function () {
                //去收藏夹
                mui.openWindow({
                    url:'my-collection.html'
                })
            },
            goMyCourse:function () {
                mui.openWindow({
                    url:'course-management.html'
                })
            }
        }
    });
};