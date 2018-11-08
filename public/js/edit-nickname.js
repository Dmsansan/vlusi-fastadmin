window.onload = function () {
    let app = new Vue({
        el: "#app",
        data: {
            nickname:'默认名称',
            isDisabled: false,
            isHidden:false
        },
        methods: {
            clearNickname:function () {
                this.nickname = '';
            }
        },
        watch:{
            nickname:function (newVal,oldVal) {
                if(newVal.trim() != '') {
                    this.isDisabled = false;
                    this.isHidden = false;
                }
                else {
                    this.isDisabled = true;
                    this.isHidden = true;
                }
            }
        }
    })
};