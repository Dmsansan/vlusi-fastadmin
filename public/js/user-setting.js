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
            localStorage.setItem('phoneNumber',phone);
            mui.openWindow({
                url: '/index/user/set_phone?token='+localStorage.getItem('token')
            })
        },
        //修改用户名
        editUserInfo:function (name) {
            localStorage.setItem('userName',name);
            mui.openWindow({
                url: '/index/user/set_name?token='+localStorage.getItem('token')
            })
        },
    },
    created: function () {
        //获取用户信息
    },
    watch:{
        city:function (newVal,oldVal) {
            if(newVal.trim() != oldVal) {
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
       /* var qq = {
            avatar: img,
            token:localStorage.getItem('token'),
        };
        $.ajax({
            type: "post",
            url: "/api/user/profile",
         /!*   cache: false,
            processData: false,
            dataType:"json",

            async: true,*!/
            contentType:'application/json;charset=UTF-8',//关键是要加上这行
            data: JSON.stringify(qq),
            success:function(data) {
                console.log(11111)
                // data.data.file;
            }
        });*/
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