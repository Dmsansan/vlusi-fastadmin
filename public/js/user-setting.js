var app = new Vue({
    el: '#app',
    data: {
        city: '',
        imgUrl: '',
        //用户信息
        userInformation: [],
        showAddress: false,
        birthDate: '',
        selectedSex: 'male',
        isMale: true,
    },
    mounted() {
        //获取用户信息
        this.init();

    },
    methods: {
        //获取用户信息
        init: function () {
            var self = this;
            $.post('/api/user/userinfo', {
                token: localStorage.getItem('token')
            }, function (data) {
                self.userInformation = data.data;
                self.city = data.data.address;
                self.imgUrl = data.data.avatar;
                self.birthDate = data.data.birthday;
                self.selectedSex = data.data.gender;
                self.isMale = data.data.gender == 1 ? true : false;
            })

        },
        selectSex: function (sex) {
            this.selectedSex = sex;
            this.isMale = (sex == 'male' ? true : false);
        },
        //修改地址
        modifyAddress: function () {
            this.showAddress = true;
            this.userInformation.address = this.city;
        },
        //
        submitBtn: function () {
            var self = this;
            $.post('/api/user/profile', {
                token: localStorage.getItem('token'),
                address: self.city
            }, function (data) {
                /*if(data.code == 1){

                    mui.toast('修改地址成功！')
                }*/
            })
        },
        //修改手机号
        modifyPhone: function (phone) {
            localStorage.setItem('phoneNumber', phone);
            mui.openWindow({
                url: '/index/user/set_phone?token=' + localStorage.getItem('token')
            })
        },
        //修改用户名
        editUserInfo: function (name) {
            localStorage.setItem('userName', name);
            mui.openWindow({
                url: '/index/user/set_name?token=' + localStorage.getItem('token')
            })
        },
        //修改头像
        reviseImage: function () {
            var self = this;
            mui('body').on('tap', '#editLogo', function () {
                $("#file").click();
            });
            var clipArea = new bjj.PhotoClip("#clipArea", {
                size: [260, 260],
                outputSize: [640, 640],
                file: "#file",
                view: "#view",
                ok: "#confirm-btn",
                loadStart: function () {
                    $("#wait-loading").css("display", "flex");
                },
                loadCompvare: function () {
                    $("#wait-loading").css("display", "none");
                    mui('#sheet').popover('toggle');
                },
                clipFinish: function (dataURL) {
                    mui('#sheet').popover('toggle');
                    var img = $("#view").css("background-image");
                    img = img.substring(5, img.length - 1);
                    //上传图片
                    console.log('上传图片', self.imgUrl);

                    $.post('/api/user/profile', {
                        token: localStorage.getItem('token'),
                        avatar: self.imgUrl
                    }, function (data) {
                        mui.toast('头像修改成功！')
                    })
                }
            });
        },
        //修改性别
        selectSex: function (sex) {
            var self = this;
            self.selectedSex = sex;
            self.isMale = (sex == 'male' ? true : false);
            $.post('/api/user/binduserinfo', {
                token: localStorage.getItem('token'),
                gender: self.selectedSex == 'male' ? 1 : 2,
            }, function (data) {
            });
        },
        //修改生日
        amendBirthday: function () {
            var self = this;
            $.post('/api/user/binduserinfo', {
                token: localStorage.getItem('token'),
                birthday: self.birthDate,
            }, function (data) {

            });
        }
    },
    created: function () {
        //获取用户信息
    },
    watch: {
        city: function (newVal, oldVal) {
            if (newVal != oldVal) {
                this.$nextTick(function () {
                    this.submitBtn();
                })
            } else {
                console.log(222)
            }
        },
        //生日
        birthDate: function (newVal, oldVal) {
            if (newVal != oldVal) {
                this.$nextTick(function () {
                    this.amendBirthday();
                })
            } else {
                console.log(222)
            }
        }

    }

});

/**
 * 选择日期
 */
(function ($) {
    document.getElementById('show-date').addEventListener('tap', function () {
        var _self = this;
        if (_self.picker) {
            _self.picker.show(function (rs) {
                console.log(rs.text);
                _self.picker.dispose();
                _self.picker = null;
            });
        } else {
            var options = {"type": "date", "beginYear": "1900"};
            /*
            * 首次显示时实例化组件
            * 示例为了简洁，将 options 放在了按钮的 dom 上
            * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
            */
            _self.picker = new $.DtPicker(options);
            _self.picker.show(function (rs) {
                /*
                * rs.value 拼合后的 value
                * rs.text 拼合后的 text
                * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                * rs.m 月，用法同年
                * rs.d 日，用法同年
                * rs.h 时，用法同年
                * rs.i 分（minutes 的第二个字母），用法同年
                */
                app.birthDate = rs.text;
                /*
                * 返回 false 可以阻止选择框的关闭
                * return false;
                */
                /*
                * 释放组件资源，释放后将将不能再操作组件
                * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
                * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
                * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
                */
                _self.picker.dispose();
                _self.picker = null;
            });
        }
    }, false);
    /**
     * 选择城市
     */

    var _getParam = function (obj, param) {
        return obj[param] || '';
    };
    var cityPicker = new mui.PopPicker({
        layer: 3
    });
    cityPicker.setData(cityData);
    var showCityPickerButton = document.getElementById('city');
    showCityPickerButton.addEventListener('tap', function (event) {
        cityPicker.show(function (items) {
            showCityPickerButton.value = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text');
            app.address = showCityPickerButton.value;
            //返回 false 可以阻止选择框的关闭
            //return false;
        });
    }, false);

})(mui);

//保存头像
function saveImg() {
    console.log('111');
}

/**
 * 城市选择
 */
var _getParam = function (obj, param) {
    return obj[param] || '';
};
var cityPicker = new mui.PopPicker({
    layer: 3
});
cityPicker.setData(cityData);
var showCityPickerButton = document.getElementById('city');
showCityPickerButton.addEventListener('tap', function (event) {
    cityPicker.show(function (items) {
        showCityPickerButton.value = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text');
        app.city = showCityPickerButton.value;
        //返回 false 可以阻止选择框的关闭
        //return false;
    });
}, false);