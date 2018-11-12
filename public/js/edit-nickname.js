window.onload = function () {
    let app = new Vue({
        el: "#app",
        data: {
            nickNames:'默认名称',
            isDisabled: false,
            isHidden:false
        },
        methods: {
            clearNickname:function () {
                this.nickNames = '';
            },
            modifyNickname:function () {
                let self = this;
                console.log(self.nickNames);
                $.post('/api/user/profile', {
                    nickname:self.nickNames,
                    token:localStorage.getItem('token')
                },function (data) {
                    self.$nextTick(function () {
                        mui.openWindow({
                            url: '/index/user/setting?token='+localStorage.getItem('token'),
                        })
                    })
                })
            }
        },
        watch:{
            nickname:function (newVal,oldVal) {
                if(newVal.trim() != '') {
                    this.isDisabled = false;
                    this.isHidden = false;
                    this.nickNames = newVal.trim();
                } else {
                    this.isDisabled = true;
                    this.isHidden = true;
                }

            }
        }
    })
};