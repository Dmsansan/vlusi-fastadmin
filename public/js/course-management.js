window.onload = function () {
    let app = new Vue({
        el: '#app',
        data: {},
        methods: {
            toggleActive:function (event,index) {
                if(!$(event.target).hasClass('active')) {
                    $(event.target).addClass('active');
                    $(event.target).siblings().removeClass('active');
                    //切换tab内容
                    $(".tab-content-list").removeClass('active');
                    $(".tab-content-list").eq(index).addClass('active');
                }
            },
            goCourse:function () {
                //进入课程
                mui.openWindow({
                    url:'course-detail.html'
                })
            },
        }
    });
}