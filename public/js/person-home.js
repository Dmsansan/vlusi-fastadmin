
var app = new Vue({
        el: '#app',
        data: {
            //底部导航
            navigationList:[
                {"id":"1","title":"课程"},
                {"id":"2","title":"发现"},
                {"id":"3","title":"我的"}
            ],
            //用户信息
            userInformation:[],
            //手动改变值变化
            tabContentTracker: 0,
        },
        mounted() {

        },
        methods: {
            init:function () {
                //获取用户信息数据
                var self = this;
                //请求获取数据
                $.post('/api/user/userinfo', {
                    token: localStorage.getItem('token'),
                }, function (data) {
                    self.userInformation = data.data;
                });
            },
            //认证弹窗
            authentication:function () {
                mui.toast('功能开发中，敬请期待！');
            },
            //底部导航栏
            switchPage:function (id) {
                if(id == 1){//课程
                    window.location.href = '/index';
                    mui.openWindow({
                        url:'/index'
                    })
                }else if(id == 2){//f发现
                    window.location.href = '/index/found';
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
        },
        created: function () {
            //获取用户信息
            this.init();
        },
    });
