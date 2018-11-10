$(function () {
    let app = new Vue({
            el: '#app',
            data: {
                isLikeArt:false,
                likeNum:20,
                isPlay: false,
                videoTotalTime: '00:00',
                currentTime: '00:00',
                videoPlayer: '',
                //评论输入的内容
                commentsContent:'',
                //发送按钮禁用
                isDisabled:true,
                isVideo:true,
                //评论发表聚焦
                isFocus: false,
                //是否收藏
                isCollect:false,
                //上传图片地址数组
                imgList:[],
                //是否展示卡片视图
                isShowCard:false,
                commentsList:[
                    {
                        id:0,
                        logo:'img/course-detail/logo.jpg',
                        commenter:'滑小稽',
                        isLiked:true,
                        comments:'这是评论吧啦啦啦',
                        imgs:'<img src="img/show.jpg"/><img src="img/show.jpg"/><img src="img/show.jpg"/>',
                        time:'2018-02-22',
                        count:10
                    },
                    {
                        id:1,
                        logo:'img/course-detail/logo.jpg',
                        commenter:'悟净',
                        isLiked:false,
                        comments:'这是评论吧啦啦啦',
                        imgs:'<img src="img/show.jpg"/><img src="img/show.jpg"/><img src="img/show.jpg"/>',
                        time:'2018-02-22',
                        count:10
                    },
                    {
                        id:2,
                        logo:'img/course-detail/logo.jpg',
                        commenter:'悟能',
                        isLiked:false,
                        comments:'这是评论吧啦啦啦',
                        imgs:'<img src="img/show.jpg"/><img src="img/show.jpg"/><img src="img/show.jpg"/>',
                        time:'2018-02-22',
                        count:10
                    }
                ]
            },
            methods: {
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
                //点赞
                likeComment:function (flag) {

                },
                //文章点赞
                likeArticle:function(flag) {
                    this.isLikeArt = flag;
                    if(flag) {
                        this.likeNum = ++this.likeNum;
                    }
                    else {
                        this.likeNum = --this.likeNum;
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
                    if(flag) {
                        this.isCollect = true;
                        mui.toast('已收藏');
                    }
                    else {
                        this.isCollect = false;
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

                }
            },
            watch: {
                commentsContent: function (newVal, oldVal) {
                    if (newVal.trim() != '') {
                        this.isDisabled = false;
                    }
                    else {
                        this.isDisabled = true;
                    }
                }
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
