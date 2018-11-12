window.onload = function () {
    let app = new Vue({
        el: '#app',
        data: {
            //底部导航
            navigationList:[
                {"id":"1","title":"课程"},
                {"id":"2","title":"发现"},
                {"id":"3","title":"我的"}
            ],
        },
        mounted() {

        },
        methods: {
            //底部导航栏
            switchPage:function (id) {
                if(id == 1){//课程
                    mui.openWindow({
                        url:'/index'
                    })
                }else if(id == 2){//我的
                    mui.openWindow({
                        url:'/index/found'
                    })
                }
            },
            goSetting:function () {
                mui.openWindow({
                    url:'/index/user/setting?token='+localStorage.getItem('token')
                })
            },
            goMyCollection:function () {
                //去收藏夹
                mui.openWindow({
                    url:'/index/user/my_collection?token='+localStorage.getItem('token')
                })
            },
            goMyCourse:function () {
                mui.openWindow({
                    url:'/index/user/my_course?token='+localStorage.getItem('token')
                })
            }
        }
    });
};