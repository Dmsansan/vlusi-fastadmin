
let app = new Vue({
        el: "#app",
        data: {
            nickNames:'',
            isDisabled: false,
            isHidden:false
        },
        mounted() {
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
        created: function () {
            console.log(localStorage.getItem('userName'))
            this.nickNames = localStorage.getItem('userName');
            /*  let code = window.location.href.split('?')[1];
              this.phoneNumber = code.split('=')[1];*/
            /* this.$nextTick(function () {
                 //获取评论详情
                 this.replyDetails();
             })*/

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
