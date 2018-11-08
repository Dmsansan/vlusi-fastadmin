window.onload = function () {
    let app = new Vue({
        el: '#app',
        data: {
            sendCodeContent: '获取验证码',
            phone: '',
            isDisabled: true,
            isBindPhone:false,
            code:'',
            waitSeconds:30,
            isSend:false
        },
        methods: {
            //验证手机号为11位
            validatePhone: function () {
                this.phone = this.phone.slice(0, 11);
            },
            //确认绑定（修改）手机号
            confirmBind:function () {
                
            },
            //验证验证码为6位
            validateCOde: function () {
                this.code = this.code.slice(0, 6);
            },
            //发送验证码
            sendPhoneCode: function () {
                this.isSend = true;
                let phoneReg = /^1(3|4|5|7|8)\d{9}$/;
                if (phoneReg.test(this.phone)) {
                    if (this.waitSeconds == 30) {
                        app.sendCodeContent = `${app.waitSeconds}s重新获取`;
                        let interval = setInterval(function () {
                            if (app.waitSeconds == 1) {
                                clearInterval(interval);
                                app.waitSeconds = 30;
                                app.sendCodeContent = '获取验证码';
                                this.isSend = false;
                            }
                            else {
                                app.sendCodeContent = `${--app.waitSeconds}s重新获取`;
                            }
                        }, 1000);
                    }
                }
                else {
                    mui.toast('手机号不合法');
                }
            },
        },
        watch:{
            phone:function (newVal,oldVal) {
                if(newVal.trim().length == 11 && this.code.trim().length== 6) {
                    this.isDisabled = false;
                }
                else {
                    this.isDisabled = true;
                }
            },
            code:function (newVal,oldVal) {
                if(newVal.trim().length == 6 && this.phone.trim().length == 11) {
                    this.isDisabled = false;
                }
                else {
                    this.isDisabled = true;
                }
            }
        }
    })
};