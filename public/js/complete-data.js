window.onload = function () {
    /**
     * 引入picker组件
     * @type {HTMLElement}
     */
    let jsNode = document.createElement('script');
    jsNode.src = 'assets/mui/js/mui.picker.min.js';
    jsNode.type = 'text/javascript';
    document.querySelector('head').appendChild(jsNode);
    /**
     * Vue实例化
     */
    let app = new Vue({
        el: '#app',
        data: {
            birthDate: '',
            isMale:true,
            selectedSex:'male',
            nickName:'微信名称',
            address:''
        },
        methods: {
            selectSex:function (sex) {
                this.selectedSex = sex;
                this.isMale = (sex == 'male' ? true : false);
            },
            confirmChange:function () {
                if(app.isFilled) {
                    //提交
                    mui.toast('修改');
                }

            },
            skipChange:function () {
                mui.toast('跳过')
            }
        },
        computed:{
            isFilled:function () {
                return this.nickName != '';
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
                var options = {"type": "date","beginYear":"1900"};
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
        jsNode.onload = function () {
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
                    app.address = showCityPickerButton.value;
                    //返回 false 可以阻止选择框的关闭
                    //return false;
                });
            }, false);
        };
    })(mui);
};