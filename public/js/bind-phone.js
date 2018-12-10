var app = new Vue({
    el: '#app',
    data: {
        hasCode: true,
        sendCodeContent: '获取验证码',
        phone: '',
        code: '',
        serverCode: '',
        waitSeconds: 60,
        clearCode:false,
        clearPhone:false
    },
    mounted() {
        mui.toast('注册会员可继续阅读！');
    },
    methods: {
        test:function() {
            /*alert(666);*/
        },
        //验证手机号为11位
        validatePhone: function () {
            this.phone = this.phone.slice(0, 11);
        },
        //验证验证码为6位
        validateCOde: function () {
            this.code = this.code.slice(0, 4);
        },
        //发送验证码
        sendPhoneCode: function () {
            var self = this;
            var phoneReg = /^1(3|4|5|7|8)\d{9}$/;
            if (phoneReg.test(this.phone)) {
                if (this.waitSeconds == 60) {
                    $.post('/api/Sms/send', {
                        token:localStorage.getItem('token'),
                        mobile:self.phone,
                        event:'changemobile'
                    },function (data) {
                        if(data.code == 0){
                            mui.toast(data.msg);
                        }

                    });
                    app.sendCodeContent = `${app.waitSeconds}s重新获取`;
                    var interval = setInterval(function () {
                        if (app.waitSeconds == 1) {
                            clearInterval(interval);
                            app.waitSeconds = 60;
                            app.sendCodeContent = '获取验证码';
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
        //确认绑定
        goBindPhone:function () {
            var self = this;
            console.log(self.code)
            $.post('/api/user/changemobile', {
                token:localStorage.getItem('token'),
                mobile:self.phone,
                event:'changemobile',
                captcha:self.code
            },function (data) {
                if(data.code == 0){
                    mui.toast(data.msg);
                }else {
                    self.$nextTick(function () {
                     mui.openWindow({
                         url:'/index/user/set_data?token='+localStorage.getItem('token')
                     })
                 })
                }

            });
           /* if(app.hasCode) {
                mui.toast('绑定了');
            }
            else {
                mui.toast('信息填写有误');
            }*/
        },
        //跳过绑定
        skipBindPhone:function () {
            mui.openWindow({
                url:'/index/user/set_data?token='+localStorage.getItem('token')
            })
            /* mui.toast('跳过')*/
        },
        clearCodeFun: function () {
            app.code = '';
            app.hasCode = false;
        },
        clearPhoneFun: function () {
            app.phone = '';
            app.hasCode = false;
        }
    },
    watch: {
        phone: function (newPhone, oldPhone) {
            if (newPhone != '') {
                //显示清空按钮
                app.clearPhone = true;
            }
            else {
                //隐藏清空按钮
                app.clearPhone = false;
            }
            if(newPhone.length == 11 && app.code.length == 4) {
                app.hasCode = true;
            }
            else {
                app.hasCode = false;
            }
        },
        code: function (newCode, oldCode) {
            if (newCode != '') {
                //显示清空按钮
                app.clearCode = true;
            }
            else {
                //隐藏清空按钮
                app.clearCode = false;
            }
            if(newCode.length == 4 && app.phone.length == 11) {
                app.hasCode = true;
            }
            else {
                app.hasCode = false;
            }
        }
    },
    created: function () {
        var token = $('input[name="token"]').val();
        localStorage.setItem('token',token);
    },
});
