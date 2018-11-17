let app = '';
window.onload = function () {
    app = new Vue({
        el: '#app',
        data: {
            isHidden: true,
            openTitle: '展开全部',
            //获取课程数据
            detailList:[],
            //课时列表
            courseList:[],
            //评论输入的内容
            commentsContent: '',
            //评论发表聚焦
            isFocus: false,
            //发送按钮禁用
            isDisabled: true,
            //是否点击上传按钮
            isUploadImage:true,
            //上传图片地址数组
            imgList:[],
           /* //是否收藏
            isCollect:false,*/
            //页面页码
            pageNumber:1,
            //页面总页数
            pageCount:null,
            //加载更多
            loadMore:false,
            //文章点赞
            isLikeArt:false,
            likeArtNums:0,
            //课程状态0:可以申请，1：审核中，2：开放
            courseStatus:0,
            //是否展示卡片视图
            isShowCard:false,
            //课程评论
            commentsList:[],
            //分享图片
            sharePictures:'',
            //页面跳转时传递的id
            passID:null,
            formdata:new FormData(),
            imgs: [],
            //分享内容
            imgUrl:'',
            title:'',
            desc:'',
            shareUrl:'',
            configWX:[],

        },
        mounted() {

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
                    $.post('/api/courses/course', {
                        title: self.searchKeys,
                        token:localStorage.getItem('token'),
                        page:self.pageNumber
                    }, function (data) {
                        data.data.forEach(function (item,index) {
                            self.searchList.push(item)
                        });
                    });
                }else {
                    return
                }
            },

            //课程详情
            courseDetails:function () {
                let self = this;
                $.post('/api/courses/detail', {
                    token:localStorage.getItem('token'),
                    course_id: self.passID,
                    page:self.pageNumber
                }, function (data) {
                    self.detailList = data.data;
                    self.courseList = data.data.detail.node;
                    self.commentsList = data.data.comment;
                    self.pageCount = data.page.pageCount;
                    self.loadMore = true;
                    //分享内容
                    self.imgUrl = data.data.detail.coverimage;
                    self.title = data.data.detail.name;
                    self.desc = data.data.detail.desc;

                    wx.ready(function () {
                        let shareData = {
                            title: self.title, // 分享标题
                            desc: self.desc, // 分享描述
                            link:  self.shareUrl , // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: self.imgUrl, // 分享图标
                        };
                        if(wx.onMenuShareAppMessage){
                            wx.onMenuShareAppMessage(shareData);//1.0 分享到朋友
                        }else {
                            wx.updateAppMessageShareData(shareData);//1.4 分享到朋友
                        }

                    })


                });

            },
            //申请课程
            applicationClass:function (id) {
                let self = this;
                $.post('/api/courses/audit', {
                    token:localStorage.getItem('token'),
                    course_id: id,
                }, function (data) {
                   self.$nextTick(function () {
                       self.courseDetails();
                   })
                });
            },
            //展开列表
            openAllCourse: function () {
                if (this.isHidden) {
                    this.openTitle = '收起列表';
                }
                else {
                    this.openTitle = '展开全部';
                }
                this.isHidden = !this.isHidden;
            },
            //显示上传图片图标等
            hideSmile: function () {
                let self = this;
                self.isFocus = true;
                self.$nextTick(function () {
                    self.saveImg();
                })
            },
            //隐藏上传图标
            showSmile: function () {
                this.isFocus = false;
            },
            //上传图片
            uploadImg: function () {
                document.getElementById('upload-img').click();
            },
            goBack: function () {
                if( document.referrer === ''){
                    mui.openWindow({
                        url:'/index'
                    })
                }else {
                    history.go(-1);
                }


            },
            saveImg:function () {
                let self = this;
                self.isDisabled = false;
                $("#upload-img").change(function () {
                    self.hideSmile();
                    self.formdata.append('image', $('#upload-img')[0].files[0]);
                });

            },
            //评论点赞
            likeComment:function (flag,id) {
                let self = this;
                $.post(' /api/courses/comment_zan', {
                    token:localStorage.getItem('token'),
                    comment_id: id
                }, function (data) {
                    self.$nextTick(function () {
                        self.courseDetails();
                    })
                });
               /* if(flag){
                    mui.toast('点赞成功！');
                }else {
                    mui.toast('取消点赞成功！');
                }*/
            },
            //文章点赞
            likeArticle:function(id,flag) {
                let self = this;
                self.isLikeArt = flag;
                if(flag) {
                    self.detailList.detail.zan = ++self.detailList.detail.zan;
                   self.detailList.is_zan = true;
                    // mui.toast('点赞成功！');
                } else {
                    self.detailList.detail.zan = --self.detailList.detail.zan;
                    self.detailList.is_zan = flag;
                    // mui.toast('取消点赞成功！');
                }

                $.post('/api/courses/course_zan', {
                    token:localStorage.getItem('token'),
                    course_id: id
                }, function (data) {
                    self.$nextTick(function () {
                        // self.courseDetails();
                    })
                });
            },
            //回复
            replay:function (id) {
                $('.emoji-wysiwyg-editor').focus();
            },
            //进入课时
            goToCourseHour:function (id,name) {
                console.log(name)
                if(name == '可体验'){
                    mui.openWindow({
                        //视频版
                        url:'/index/index/course_detail?id=' + id
                        // 图文版
                        // url:'course-hour-detail-pictures.html?id=' + id
                    })
                }else {

                }

            },
            shareCourse:function() {
                mui('#share-sheet').popover('toggle');
            },
            //收藏，取消收藏
            collect:function (flag) {
                let self = this;
                $.post('/api/courses/collection', {
                    token:localStorage.getItem('token'),
                    course_id: self.passID
                }, function (data) {
                    self.$nextTick(function () {
                        self.courseDetails();

                    })
                });
               /* if(flag) {
                    self.detailList.detail.is_collection = true;
                    // mui.toast('已收藏');
                }
                else {
                    self.detailList.detail.is_collection = false;
                    // mui.toast('已取消收藏');
                }*/
            },
            //点击发送按钮
            reviewBtn:function () {
                let self = this;
                self.isDisabled = true;
                self.formdata.append('course_id', self.passID);
                self.formdata.append('token', localStorage.getItem('token'));
                self.formdata.append('content', self.commentsContent);
                $.ajax({
                    url:'/api/courses/comment',
                    type:'post',
                    cache:false,
                    data:self.formdata,
                    /*  dataType:'json',*/
                    processData:false,
                    contentType:false,
                    success:function (data) {
                        self.$nextTick(function () {
                            self.formdata = new FormData();
                            self.commentsContent = '';
                            self.isDisabled = false;
                            self.isFocus = false;
                            self.courseDetails();
                        })
                    },
                    error:function (data) {

                    }
                })
            },
            blruFn:function () {
                let self = this;
                self.isFocus = false;
            },
            goCommentsDetail:function (id) {
                //查看评论详情
                mui.openWindow({
                    url:'/index/index/comments?id='+id
                })
            },
            //确保你获取用来签名的url是动态获取的，动态页面可参见实例代码中php的实现方式。
            //如果是html的静态页面在前端通过ajax将url传到后台签名，前端需要用js获取当前页面除去'#'hash部分的链接
            //（可用location.href.split('#')[0]获取,而且需要encodeURIComponent），
            //因为页面一旦分享，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败。
            sendToFriend:function () {
                let self = this;
                //发给好友
                self.shareUrl  = location.href.split('#')[0];
                $.post('/api/index/getShareSigna', {
                    url: encodeURIComponent(self.shareUrl),
                    token:localStorage.getItem('token')
                }, function (data) {
                    if(data.code == 1){
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
                           "updateAppMessageShareData"//分享给朋友接口
                       ] // 必填，需要使用的JS接口列表
                   });
               }

            },
            generateCard:function () {
                let self = this;
                mui('#share-sheet').popover('toggle');
                mui.showLoading("正在加载..","div");
                //生成卡片
                self.isShowCard = true;

                $.post('/api/share/getimage', {
                    article_id: self.passID,
                    token:localStorage.getItem('token')
                }, function (data) {
                    self.sharePictures = data.data.url;
                    mui.hideLoading();
                });
            },
            hidePreview:function () {
                //关闭图片预览
                this.isShowCard = false;
            },
        },
        watch: {
            commentsContent: function (newVal, oldVal) {
                let self = this;
                if (newVal.trim() != '') {
                    self.isDisabled = false;
                } else {
                    self.isDisabled = true;
                }

            },
            isUploadImage:function (newVal,oldVal) {

            }
        },
        created: function () {
            let code = window.location.href.split('?')[1];
            this.passID = code.split('=')[1];
            this.$nextTick(function () {
                //获取课程详情
                this.courseDetails();
            })
        },

    });

    window.emojiPicker = new EmojiPicker({
        emojiable_selector: '[data-emojiable=true]',
        assetsPath: 'assets/emoji/img/',
        popupButtonClasses: 'fa fa-smile-o'
    });

    window.emojiPicker.discover();
    document.querySelector('.emoji-wysiwyg-editor').addEventListener('focus', function () {
        app.hideSmile();
    });
    document.querySelector('.emoji-wysiwyg-editor').addEventListener('blur', function () {
        let elem = $(this);
        setTimeout(function () {
            if(app.commentsContent.length == 0 && app.imgList.length == 0) {
                app.showSmile();
            }
        },500);
        document.querySelector('#uploadImg').addEventListener('click', function () {
            app.isUploadImage = true;
            app.uploadImg();
        });
    });
    document.querySelector('.emoji-wysiwyg-editor').addEventListener('input', function () {
        app.commentsContent = $(this).text();
    });
};