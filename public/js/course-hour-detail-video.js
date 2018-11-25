//vue实例化
let app = new Vue({
    el: '#app',
    data: {
        courseID:null,//课时详情id
        courseList:[],//课时详情返回数据
        isPlay: false,
        videoTotalTime: '00:00',
        currentTime: '00:00',
        videoPlayer: '',
        //分享内容
        imgUrl: '',
        title: '',
        desc: '',
        shareUrl: '',
        configWX: [],

    },
    mounted() {
    },
    methods: {
        periodDetails:function () {
            let self = this;
            $.post('/api/courses/nodes_detail', {
                token:localStorage.getItem('token'),
                nodes_id: self.courseID
            }, function (data) {
                console.log('课时详情id',data.data);
                self.courseList = data.data;
                //分享内容
                self.imgUrl = 'http://yl.qclike.cn/img/logo.png';
                self.title = '乐养老';
                self.desc = '文化养老综合服务提供商';
                self.sendToFriend();
            });
        },
        goCourse:function (id) {
            //进入课程
            mui.openWindow({
                url:'/index/index/detail?id='+id
            })
        },
        goBack:function () {
            if( document.referrer === ''){
                mui.openWindow({
                    url:'/index'
                })
            }else {
                history.go(-1);
            }
        },
        sendToFriend: function () {
            let self = this;
            //发给好友
            self.shareUrl = location.href.split('#')[0];
            $.post('/api/index/getShareSigna', {
                url: encodeURIComponent(self.shareUrl),
                token: localStorage.getItem('token')
            }, function (data) {
                if (data.code == 1) {
                    self.configWX = data.data;
                    self.$nextTick(function () {
                        shareWeChat(self.configWX);
                    })
                }
            });

            function shareWeChat(todo) {
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
                    appId: todo.appid, // 必填，公众号的唯一标识
                    timestamp: todo.timesTamp, // 必填，生成签名的时间戳
                    nonceStr: todo.nonceStr, // 必填，生成签名的随机串
                    signature: todo.signaTure,// 必填，签名
                    jsApiList: [
                        "onMenuShareAppMessage",//分享给朋友接口
                        "onMenuShareTimeline",//分享给朋友接口
                        "updateAppMessageShareData",//分享给朋友接口
                        "updateTimelineShareData",//分享给朋友接口
                    ] // 必填，需要使用的JS接口列表
                });
            }
            let shareData = {
                title: self.title, // 分享标题
                desc: self.desc, // 分享描述
                link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: self.imgUrl, // 分享图标
                success: function () {
                    /*console.log(1111111111)*/
                },
                fail: function (res) {
                    /*alert(JSON.stringify(res));*/
                }
            };
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: self.title, // 分享标题
                    desc: self.desc, // 分享描述
                    link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: self.imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareAppMessage({
                    title: self.title, // 分享标题
                    desc: self.desc, // 分享描述
                    link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: self.imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // alert(1111);
                    }
                });
                wx.updateTimelineShareData({
                    title: self.title, // 分享标题
                    desc: self.desc, // 分享描述
                    link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: self.imgUrl, // 分享图标
                    success: function () {
                        // 设置成功
                        /* alert(141414);*/
                    }
                });


                wx.updateAppMessageShareData({
                    title: self.title, // 分享标题
                    desc: self.desc, // 分享描述
                    link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: self.imgUrl, // 分享图标
                    success: function () {
                        // 设置成功
                        /*alert(141414);*/
                    }
                });



            })





        },
    },
    created: function () {
        let code = window.location.href.split('?')[1];
        this.courseID = code.split('=')[1];
        this.$nextTick(function () {
            //获取课时详情
            this.periodDetails();
        })
    },
});

function transformTime(ms) {
    let minute = parseInt(ms / 60);
    let seconds = parseInt((ms / 60 - minute) * 60);
    minute = minute < 10 ? `0${minute}` : minute;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minute} : ${seconds}`;
}

function requestFullScreen() {
    var de = document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    }
}

function exitFullscreen() {
    var de = document;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}