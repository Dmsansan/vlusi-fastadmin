$(function () {
    let app = new Vue({
            el: '#app',
            data: {
                //第几页
                pageNumber:1,
                //页面总页数
                pageCount:null,
                //加载更多
                loadMore:false,
                //详情ID
                passID:null,
                //评论列表
                reviewList:[],
               /* isLikeArt:false,*/
                likeNum:20,
                isPlay: false,
                videoTotalTime: '00:00',
                currentTime: '00:00',
                videoPlayer: '',
                //评论输入的内容
                commentsContent:'',
                //发送按钮禁用
                isDisabled:true,
                //是否有视频
                isVideo:false,
                //评论发表聚焦
                isFocus: false,
               /* //是否收藏
                isCollect:false,*/
                //上传图片地址数组
                imgList:[],
                //是否展示卡片视图
                isShowCard:false,
                //分享图片
                sharePictures:'',
                //详情数据
                detailsList:[],
                //上传图片
                imgUrl:null,
                formdata:new FormData(),
            },
            mounted(){
               /* //初始化数据
                this.init();*/
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
                    if (scrollTop + scrollHeight >= innerHeight-10000) {
                        this.infiniteLoadDone()
                    }
                },
                infiniteLoadDone () {
                    let self = this;
                    //总页数
                    if(self.pageCount >self.pageNumber){
                        self.pageNumber +=1;
                        $.post('/api/found/detail', {
                            token:localStorage.getItem('token'),
                            article_id: self.passID,
                            page: self.pageNumber,
                        }, function (data) {
                            data.data.comment.forEach(function (item,index) {
                                self.reviewList.push(item)
                            });
                        });
                    }else {
                        return
                    }
                },
                //初始化数据
                init:function () {
                    let self = this;
                    $.post(' /api/found/detail', {
                        article_id: self.passID,
                        token:localStorage.getItem('token'),
                        page: self.pageNumber,
                    }, function (data) {
                        self.detailsList = data.data;
                        self.reviewList = data.data.comment;
                        self.pageCount = data.page.pageCount;
                        self.loadMore = true;
                        self.isVideo = data.data.detail.videofile?true:false;
                    });

                },
                //上传图片
                uploadImg:function () {
                    document.getElementById('upload-img').click();
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
                //返回上一步
                goBack: function () {
                    history.go(-1);
                },
                likeComment:function (flag,id) {
                    let self = this;
                    $.post(' /api/found/comment_zan', {
                        token:localStorage.getItem('token'),
                        comment_id: id,
                    }, function (data) {
                        self.$nextTick(function () {
                            self.init();
                        })
                    });
                },

                //文章点赞
                likeArticle:function(id,flag) {
                    let self = this;
                    $.post('/api/found/article_zan', {
                        article_id: id,
                        token:localStorage.getItem('token')
                    }, function (data) {
                       /* self.$nextTick(function () {
                            self.init();
                        })*/

                    });
                    if(flag) {
                        self.detailsList.is_zan = true;
                        self.detailsList.detail.zan =++self.detailsList.detail.zan;
                        /*mui.toast('点赞成功！');*/
                    } else {
                        self.detailsList.is_zan = false;
                        self.detailsList.detail.zan = --self.detailsList.detail.zan;
                       /* mui.toast('取消点赞！');*/
                    }
                },
                //回复
                replay:function () {
                    $('.emoji-wysiwyg-editor').focus();
                },
                shareCourse:function() {
                    mui('#share-sheet').popover('toggle');
                },
                //收藏，取消收藏
                collect:function (flag) {
                    let self = this;
                    $.post('/api/found/collection', {
                        article_id: self.passID,
                        token:localStorage.getItem('token')
                    }, function (data) {
                        self.$nextTick(function () {
                            //初始化数据
                            self.init();
                        })
                    });
                   /* if(flag) {
                        self.detailsList.is_collection = true;
                        mui.toast('已收藏');
                    }
                    else {
                        self.detailsList.is_collection = false;
                        mui.toast('已取消收藏');
                    }*/
                },
                //解决键盘遮挡
                focusInput:function () {
                    let bfscrolltop = 0;//获取软键盘唤起前浏览器滚动部分的高度
                    let interval;
                    $('#form_article').focus(function() {
                        //给个延迟
                        bfscrolltop = document.body.scrollTop;//获取软键盘唤起前浏览器滚动部分的高度
                        interval = setInterval(function() {
                            document.body.scrollTop = document.body.scrollHeight}, 100
                        );
                        window.addEventListener('touchmove', function () {
                            
                        }, false);

                    }).blur(function(){
                        clearInterval(interval);
                    });
                },
                goCommentsDetail:function (id) {
                    //查看评论详情
                    mui.openWindow({
                        url:'/index/found/comments?id='+id

                    })

                },
                sendToFriend:function () {
                    //发给好友
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
                saveImg:function () {
                    let self = this;
                    self.isDisabled = false;
                    $("#upload-img").change(function () {
                        self.hideSmile();
                        self.formdata.append('image', $('#upload-img')[0].files[0]);
                        let reads = new FileReader();
                        let f = document.getElementById('upload-img')[0].files[0];
                        console.log(f)
                        reads.readAsDataURL(f);
                        reads.onload = function (e) {

                            /*mui.toast('文件读取成功!');*/
                        };
                    });

                },
                //发布评论
                sendInformation:function () {
                    let self = this;
                    self.isDisabled = true;
                    self.formdata.append('article_id', self.passID);
                    self.formdata.append('token', localStorage.getItem('token'));
                    self.formdata.append('content', self.commentsContent);
                    $.ajax({
                        url:'/api/found/comment',
                        type:'post',
                        cache:false,
                        data:self.formdata,
                        /*  dataType:'json',*/
                        processData:false,
                        contentType:false,
                        success:function (data) {
                            self.$nextTick(function () {
                                self.formdata.append('article_id', '');
                                self.formdata.append('token', '');
                                self.formdata.append('content', '');
                                self.formdata.append('image', '');
                                self.commentsContent = '';
                                self.isDisabled = false;
                                self.init();
                            })
                        },
                        error:function (data) {

                        }
                    })
                },

            },
            watch: {
                commentsContent: function (newVal, oldVal) {
                    if (newVal.trim() != '') {
                        this.isDisabled = false;
                        self.commentsContent = newVal;
                    }
                    else {
                        this.isDisabled = true;
                    }
                }
            },
            created: function () {
                let self = this;
                let code = window.location.href.split('?')[1];
                self.passID = code.split('=')[1];
                self.$nextTick(function () {
                    //初始化数据
                    self.init();
                })
            },
            beforeDestroy(){
                $(window).unbind('scroll');
            },
        }
    );

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

});


