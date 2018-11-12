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
            });
        },
        goCourse:function (id) {
            //进入课程
            mui.openWindow({
                url:'/index/index/detail?id='+id
            })
        },
        goBack:function () {
            history.go(-1);
        }
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