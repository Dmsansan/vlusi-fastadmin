let app = '';
window.onload = function () {
    app = new Vue({
        el: '#app',
        data: {
            isHidden: true,
            openTitle: '展开全部',
            courseList: [
                {
                    id: 0,
                    title: '广场舞16步',
                    desc: '适合初学者，一般由4个4步组成',
                    isOpen: true
                },
                {
                    id: 1,
                    title: '广场舞16步',
                    desc: '适合初学者，一般由4个4步组成',
                    isOpen: true
                },
                {
                    id: 2,
                    title: '广场舞16步',
                    desc: '适合初学者，一般由4个4步组成',
                    isOpen: false
                },
                {
                    id: 3,
                    title: '广场舞16步',
                    desc: '适合初学者，一般由4个4步组成',
                    isOpen: true
                },
                {
                    id: 4,
                    title: '广场舞16步',
                    desc: '适合初学者，一般由4个4步组成',
                    isOpen: false
                }
            ],
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
            //是否收藏
            isCollect:false,
            //文章点赞
            isLikeArt:false,
            likeArtNums:0,
            //课程状态0:可以申请，1：审核中，2：开放
            courseStatus:0,
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
                    this.likeArtNums = ++this.likeArtNums;
                }
                else {
                    this.likeArtNums = --this.likeArtNums;
                }
            },
            //回复
            replay:function () {
                $('.emoji-wysiwyg-editor').focus();
            },
            //进入课时
            goToCourseHour:function (id) {
                mui.openWindow({
                    //视频版
                    url:'course-hour-detail-video.html?id=' + id
                    // 图文版
                    // url:'course-hour-detail-pictures.html?id=' + id
                })
            },
            shareCourse:function() {
              mui.openWindow({
                  url:'share-page.html'
              })
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
            }
        },
        watch: {
            commentsContent: function (newVal, oldVal) {
                console.log(newVal);
                console.log(newVal.trim() == '');
                if (newVal.trim() != '') {
                    this.isDisabled = false;
                }
                else {
                    this.isDisabled = true;
                }
            },
            isUploadImage:function (newVal,oldVal) {

            }
        }
    });
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
};