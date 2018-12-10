var app = new Vue({
    el: '#app',
    data: {
        sendCodeContent: '获取验证码',
        phone: '',
        isDisabled: true,
        isBindPhone: false,
        code: '',
        waitSeconds: 30,
        isSend: false,
        phoneNumber: null,
    },
    mounted() {
    },
    methods: {
        //验证手机号为11位
        validatePhone: function () {
            this.phone = this.phone.slice(0, 11);
        },
        //确认绑定（修改）手机号
        confirmBind: function () {
            var self = this;
            $.post('/api/user/changemobile', {
                token: localStorage.getItem('token'),
                mobile: self.phone,
                captcha: self.code
            }, function (data) {
                mui.toast(data.msg);
                if (data.code == 1) {
                    self.$nextTick(function () {
                        mui.openWindow({
                            url: '/index/user/setting?token=' + localStorage.getItem('token')
                        })
                    })
                } else {
                    mui.toast('手机号已被绑定');
                }
            });
        },
        //验证验证码为6位
        validateCOde: function () {
            this.code = this.code.slice(0, 6);
        },
        //发送验证码
        sendPhoneCode: function () {
            var self = this;
            self.isSend = true;
            var phoneReg = /^1(3|4|5|7|8)\d{9}$/;
            if (phoneReg.test(self.phone)) {
                if (self.waitSeconds == 30) {
                    app.sendCodeContent = `${app.waitSeconds}s重新获取`;
                    $.post('/api/Sms/send', {
                        token: localStorage.getItem('token'),
                        event: 'changemobile',
                        mobile: self.phone
                    }, function (data) {
                        if (data.code == 0) {
                            mui.toast(data.msg);
                        }
                    });
                    var interval = setInterval(function () {
                        if (app.waitSeconds == 1) {
                            clearInterval(interval);
                            app.waitSeconds = 30;
                            app.sendCodeContent = '获取验证码';
                            self.isSend = false;
                        } else {
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
    created: function () {
        console.log(localStorage.getItem('phoneNumber'))
        this.phoneNumber = localStorage.getItem('phoneNumber');
        /*  var code = window.location.href.split('?')[1];
          this.phoneNumber = code.split('=')[1];*/
        /* this.$nextTick(function () {
             //获取评论详情
             this.replyDetails();
         })*/

    },
    watch: {
        phone: function (newVal, oldVal) {
            if (newVal.trim().length == 11 && this.code.trim().length == 4) {
                this.isDisabled = false;
            } else {
                this.isDisabled = true;
            }
        },
        code: function (newVal, oldVal) {
            if (newVal.trim().length == 4 && this.phone.trim().length == 11) {
                this.isDisabled = false;
            }
            else {
                this.isDisabled = true;
            }
        }
    }
})
