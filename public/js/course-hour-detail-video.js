//vue实例化
let app = new Vue({
    el: '#app',
    data: {
        isPlay: false,
        videoTotalTime: '00:00',
        currentTime: '00:00',
        videoPlayer: ''
    },
    methods: {
        goCourse:function (id) {
            //进入课程
            mui.openWindow({
                url:'course-detail.html?id='+id
            })
        },
        goBack:function () {
            history.go(-1);
        }
    }
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