let app = new Vue({
    el: '#app',
    data: {
        city:'',
        imgUrl:'/img/course-detail/logo.jpg',
        //用户信息
        userInformation:[],
        showAddress:false,
    },
    mounted() {
        //获取用户信息
        this.init();
    },
    methods: {
        //获取用户信息
        init:function () {
            let self = this;
            $.post('/api/user/userinfo', {
                token:localStorage.getItem('token')
            },function (data) {
                console.log('获取用户信息',data.data)
                self.userInformation = data.data;
                self.city =  data.data.address;
            })

        },
        //修改地址
        modifyAddress:function () {
            this.showAddress = true;
            this.userInformation.address = this.city;
        },
        //
        submitBtn:function () {
            console.log(1111)
            let self = this;
            $.post('/api/user/profile', {
                token:localStorage.getItem('token'),
                address:self.city
            },function (data) {
                /*if(data.code == 1){

                    mui.toast('修改地址成功！')
                }*/
            })
        },
        //修改手机号
        modifyPhone:function (phone) {
            console.log(phone)
            localStorage.setItem('phoneNumber',phone);
            mui.openWindow({
                url: '/index/user/set_phone?token='+a460f6f0b010dccb4560afeaaadfd5d161db044d
            })
        },

        editUserInfo: function (url) {
            mui.openWindow({
                url: url
            })
        }
    },
    created: function () {
        //获取用户信息
    },
    watch:{
        city:function (newVal,oldVal) {
            if(newVal.trim() != oldVal) {
                console.log(111)
                this.$nextTick(function () {
                    this.submitBtn();
                })

            } else {
                console.log(222)
            }

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