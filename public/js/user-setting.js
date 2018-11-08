let app = new Vue({
    el: '#app',
    data: {
        city:'',
        imgUrl:'img/course-detail/logo.jpg'
    },
    methods: {
        editUserInfo: function (url) {
            mui.openWindow({
                url: url
            })
        }
    }
});

mui('body').on('tap', '#editLogo', function() {
    $("#file").click();
});
var clipArea = new bjj.PhotoClip("#clipArea", {
    size: [260, 260],
    outputSize: [640, 640],
    file: "#file",
    view: "#view",
    ok: "#confirm-btn",
    loadStart: function() {
        $("#wait-loading").css("display", "flex");
    },
    loadComplete: function() {
        $("#wait-loading").css("display", "none");
        mui('#sheet').popover('toggle');
    },
    clipFinish: function(dataURL) {
        mui('#sheet').popover('toggle');
        var img = $("#view").css("background-image");
        img = img.substring(5, img.length - 1);
        //上传图片
        // $.ajax({
        //     type: "post",
        //     url: "",
        //     cache: false,
        //     processData: false,
        //     contentType: false,
        //     async: true,
        //     data: {
        //         file: img
        //     },
        //     success:function(data) {
        //         data.data.file;
        //     }
        // });
    }
});
//关闭actionsheet
function closeSheet() {
    mui('#sheet').popover('toggle');
}
//保存头像
function saveImg() {
    console.log('111');
}

/**
 * 城市选择
 */
let _getParam = function (obj, param) {
    return obj[param] || '';
};
let cityPicker = new mui.PopPicker({
    layer: 3
});
cityPicker.setData(cityData);
let showCityPickerButton = document.getElementById('city');
showCityPickerButton.addEventListener('tap', function (event) {
    cityPicker.show(function (items) {
        showCityPickerButton.value = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text');
        app.city = showCityPickerButton.value;
        //返回 false 可以阻止选择框的关闭
        //return false;
    });
}, false);