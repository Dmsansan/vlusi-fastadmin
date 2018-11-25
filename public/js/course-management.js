
let app = new Vue({
        el: '#app',
        data: {
            //页面页码
            pageNumber:1,
            //页面总页数
            pageCount:null,
            //加载更多
            loadMore:false,
            //已通过数据
            adoptList:[],
            //w未审核数据
            unauditList:[],
            tabIndex:1,
            //分享内容
            imgUrl: '',
            title: '',
            desc: '',
            shareUrl: '',
            configWX: [],
        },
        methods: {
            touchStart (e) {
                this.startY = e.targetTouches[0].pageY
            },
            touchMove (e) {
                if (e.targetTouches[0].pageY < this.startY) { // 上拉
                    if(this.loadMore){
                        this.judgeScrollBarToTheEnd()
                    }
                }
            },
            // 判断滚动条是否到底
            judgeScrollBarToTheEnd () {
                let innerHeight = document.querySelector('.active').clientHeight
                // 变量scrollTop是滚动条滚动时，距离顶部的距离
                let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                // 变量scrollHeight是滚动条的总高度
                let scrollHeight = document.documentElement.clientHeight || document.body.scrollHeight
                // 滚动条到底部的条件
                if (scrollTop + scrollHeight >= innerHeight-6000) {
                    this.infiniteLoadDone()
                }
            },
            infiniteLoadDone () {
                let self = this;
                //总页数
                if(self.pageCount >self.pageNumber){
                    self.pageNumber +=1;
                    if(self.tabIndex == 1){
                        $.post('/api/user/my_succ_course', {
                            token:localStorage.getItem('token'),
                            page:self.pageNumber
                        }, function (data) {
                            data.data.forEach(function (item,index) {
                                self.adoptList.push(item)
                            });
                        });
                    }else {
                        $.post('/api/user/my_article', {
                            token:localStorage.getItem('token'),
                            page:self.pageNumber
                        }, function (data) {
                            data.data.forEach(function (item,index) {
                                self.articleList.push(item)
                            });
                        });
                    }
                }else {
                    return
                }


            },
            //课程里面审核通过接口
            reviewPass:function () {
                let self = this;
                $.post('/api/user/my_succ_course', {
                    token:localStorage.getItem('token'),
                    page:self.pageNumber
                }, function (data) {
                    self.adoptList = data.data;
                    self.pageCount = data.page.page_count;
                    self.loadMore = true;
                    //分享内容
                    self.imgUrl = '/img/logo.png';
                    self.title = '乐养老';
                    self.desc = '文化养老综合服务提供商';
                    self.$nextTick(function () {
                        self.sharingMethod();
                    })
                });
            },
            //课程里面未审核接口
            reviewUnpass:function () {
                let self = this;
                $.post('/api/user/my_wait_course', {
                    token:localStorage.getItem('token'),
                    page:self.pageNumber
                }, function (data) {
                    self.unauditList = data.data;
                    self.pageCount = data.page.page_count;
                    self.loadMore = true;
                    //分享内容
                    self.imgUrl = '/img/logo.png';
                    self.title = '乐养老';
                    self.desc = '文化养老综合服务提供商';
                    self.$nextTick(function () {
                        self.sharingMethod();
                    })
                });
            },
            //tab切换
            toggleActive:function (event,index) {
                let self = this;
                self.pageCount = null;
                self.pageNumber = 1;
                self.loadMore = false;
                if(!$(event.target).hasClass('active')) {
                    $(event.target).addClass('active');
                    $(event.target).siblings().removeClass('active');
                    //切换tab内容
                    $(".tab-content-list").removeClass('active');
                    $(".tab-content-list").eq(index).addClass('active');
                }
                if(index == 0){
                    //已通过
                    self.reviewPass();
                }else {
                    //未审核
                    self.tabIndex = 2;
                   self.reviewUnpass();
                }

            },
            //取消课程
            cancelCourse:function (id,index) {
                let self = this;
                console.log(index)
                $.post('/api/user/cancle_course', {
                    token:localStorage.getItem('token'),
                    course_id:id
                }, function (data) {
                   if (data.code ==1){
                       mui.toast('取消课程成功！')
                       //课程里面审核通过接口
                       if (self.index == 1){
                           self.reviewPass();
                       }else {
                           self.reviewUnpass();
                       }
                   }else {
                       mui.toast('取消课程失败！')
                   }
                });
            },
            goCourse:function (id) {
                //进入课程
                mui.openWindow({
                    url:'/index/index/detail?id='+id
                })
            },
            //分享方法
            sharingMethod:function () {
                let self = this;
                self.shareUrl = location.href.split('#')[0];
                $.post('/api/index/getShareSigna', {
                    url: encodeURIComponent(self.shareUrl),
                    token: localStorage.getItem('token')
                }, function (data) {
                    if (data.code == 1) {
                        self.configWX = data.data;
                        self.$nextTick(function () {
                            shareWeChat(self.configWX);
                        })
                    }
                });
                function shareWeChat(todo) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
                        appId: todo.appid, // 必填，公众号的唯一标识
                        timestamp: todo.timesTamp, // 必填，生成签名的时间戳
                        nonceStr: todo.nonceStr, // 必填，生成签名的随机串
                        signature: todo.signaTure,// 必填，签名
                        jsApiList: [
                            "onMenuShareAppMessage",//分享给朋友接口
                            "onMenuShareTimeline",//分享给朋友接口
                            "updateAppMessageShareData",//分享给朋友接口
                            "updateTimelineShareData",//分享给朋友接口
                        ] // 必填，需要使用的JS接口列表
                    });
                }
                wx.ready(function () {
                    wx.onMenuShareTimeline({
                        title: self.title, // 分享标题
                        desc: self.desc, // 分享描述
                        link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: self.imgUrl, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: self.title, // 分享标题
                        desc: self.desc, // 分享描述
                        link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: self.imgUrl, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // alert(1111);
                        }
                    });
                    wx.updateTimelineShareData({
                        title: self.title, // 分享标题
                        desc: self.desc, // 分享描述
                        link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: self.imgUrl, // 分享图标
                        success: function () {
                            // 设置成功
                            /* alert(141414);*/
                        }
                    });


                    wx.updateAppMessageShareData({
                        title: self.title, // 分享标题
                        desc: self.desc, // 分享描述
                        link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: self.imgUrl, // 分享图标
                        success: function () {
                            // 设置成功
                            /*alert(141414);*/
                        }
                    });



                })

            }
        },
        beforeDestroy(){
            $(window).unbind('scroll');
        },
        created: function () {
            //课程里面审核通过接口
            this.reviewPass();
        },
    });
