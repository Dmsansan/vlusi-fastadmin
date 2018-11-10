$(function () {
    let app = new Vue({
            el: '#app',
            data: {
                //分页
                currentPage:1,
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

                //详情数据
                detailsList:[],

            },
            mounted(){
                //初始化数据
                this.init();
            },
            methods: {
                init:function () {
                    let self = this;
                    id = sessionStorage.getItem('detailId');
                    console.log(sessionStorage.getItem('detailId'))
                    $.post(' /api/found/detail', {
                        article_id: 10,
                        page: self.currentPage,
                    }, function (data) {
                        console.log(data)
                        self.detailsList = data.data;
                    });

                },
                //上传图片
                uploadImg:function () {
                    document.getElementById('upload-img').click();
                },
                //显示上传图片图标等
                hideSmile: function () {
                    this.isFocus = true;
                },
                //隐藏上传图标
                showSmile: function () {
                    console.log('show');
                    this.isFocus = false;
                },
                //上传图片
                uploadImg: function () {
                    document.getElementById('upload-img').click();
                },
                goBack: function () {
                    history.go(-1);
                },
                //评论内容点赞
                likeComment:function (flag,id) {
                    let self = this;
                    $.post('/api/found/article_zan', {
                        article_id: id,
                    }, function (data) {
                        console.log(data);
                        self.init();
                    });
                },
                //文章点赞
                likeArticle:function(flag) {
                    let self = this;
                    $.post('/api/found/article_zan', {
                        article_id: sessionStorage.getItem('detailId'),
                    }, function (data) {
                        console.log(data);
                        self.init();
                    });
                    if(flag) {
                        self.detailsList.is_zan = true;
                    } else {
                        self.detailsList.is_zan = false;
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
                        article_id: sessionStorage.getItem('detailId'),
                    }, function (data) {
                        console.log(data)
                    });
                    if(flag) {
                        self.detailsList.is_collection = true;
                        mui.toast('已收藏');
                    }
                    else {
                        self.detailsList.is_collection = false;
                        mui.toast('已取消收藏');
                    }
                },
                goCommentsDetail:function () {
                    //查看评论详情
                    mui.openWindow({
                        url:'comments-detail.html'
                    })
                },
                sendToFriend:function () {
                    //发给好友
                },
                generateCard:function () {
                    mui('#share-sheet').popover('toggle');
                    //生成卡片
                    this.isShowCard = true;
                },
                hidePreview:function () {
                    //关闭图片预览
                    this.isShowCard = false;
                },
                saveImg:function () {

                },
                sendInformation:function () {
                    let self = this;
                    $.post('/api/found/comment', {
                        article_id: sessionStorage.getItem('detailId'),
                        content:self.commentsContent
                    }, function (data) {
                        console.log(data);
                        if (data.code == 1){
                            self.isDisabled = false;
                            self.init();
                        }
                    });
                }
            },
            watch: {
                commentsContent: function (newVal, oldVal) {
                    if (newVal.trim() != '') {
                        console.log(11111)
                        this.isDisabled = false;
                    }
                    else {
                        console.log(222)
                        this.isDisabled = true;
                    }
                }
            },
            creat:{

            }
        }
    );
    /**
     * 监听文件上传框变化
     */
    $("#upload-img").change(function () {
        app.hideSmile();
        let reads = new FileReader();
        let f = document.getElementById('upload-img').files[0];
        reads.readAsDataURL(f);
        reads.onload = function (e) {
            app.imgList.push(this.result);
            mui.toast('文件读取成功!');
        };
    });
    window.emojiPicker = new EmojiPicker({
        emojiable_selector: '[data-emojiable=true]',
        assetsPath: 'assets/emoji/img/',
        popupButtonClasses: 'fa fa-smile-o'
    });
    // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
    // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
    // It can be called as many times as necessary; previously converted input fields will not be converted again
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


