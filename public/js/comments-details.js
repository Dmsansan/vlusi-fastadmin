window.onload = function () {
    let app = new Vue({
            el: '#app',
            data: {
                //回复传递ID
                replyID:null,
                //第几页
                pageNumber:1,
                //页面总页数
                pageCount:null,
                //加载更多
                loadMore:false,
                //评论详情数据
                commentsList:[],
                commentsContent: '',
                //发送按钮禁用
                isDisabled: true,
                //评论点赞
                isLikeArt:false,
                imgList:[]
            },
            mounted() {

            },
            methods: {
                //解决键盘遮挡
                focusInput:function () {
                    var bfscrolltop = 0;//获取软键盘唤起前浏览器滚动部分的高度
                    $('.comment-input').focus(function() {
                        //给个延迟
                        bfscrolltop = document.body.scrollTop;//获取软键盘唤起前浏览器滚动部分的高度
                        interval = setInterval(function() {
                            document.body.scrollTop = document.body.scrollHeight}, 100
                        );
                        window.addEventListener('touchmove', fn, false);

                    }).blur(function(){
                        clearInterval(interval);
                    });
                },
                //返回上一步
                goBack: function () {
                    history.go(-1);
                },
                //评论点赞
                likeComment:function(id,flag) {

                    this.isLikeArt = flag;
                    if(flag) {
                        mui.toast('点赞成功！');
                    } else {
                        mui.toast('取消点赞成功！');
                    }
                    let self = this;
                    $.post(' /api/found/comment_zan', {
                        token:localStorage.getItem('token'),
                        comment_id: id
                    }, function (data) {
                        self.$nextTick(function () {
                            self.replyDetails();
                        })
                    });
                },
                //点击发送按钮
                reviewBtn:function () {
                    let self = this;
                    $.post('/api/found/comment', {
                        token:localStorage.getItem('token'),
                        article_id: localStorage.getItem('ReplyId'),
                        content:self.commentsContent
                    }, function (data) {
                        self.$nextTick(function () {
                            self.replyDetails();
                            self.commentsContent = '';
                        })
                    });
                },
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
                        $.post('/api/found/comment_detail', {
                            token:localStorage.getItem('token'),
                            page:self.pageNumber
                        }, function (data) {
                            data.data.children.forEach(function (item,index) {
                                self.commentsList.push(item)
                            });
                        });
                    }else {
                        return
                    }


                },
                //获取评论详情
                replyDetails:function () {
                    let self = this;
                    $.post('/api/found/comment_detail', {
                        token:localStorage.getItem('token'),
                        comment_id: self.replyID,
                        page:self.pageNumber
                    }, function (data) {
                        self.commentsList =data.data;
                        console.log(data.data)
                        self.pageCount = data.page.page_count;
                        self.loadMore = true;
                    });
                },
                //上传图片
                uploadImg: function () {
                    document.getElementById('upload-img').click();
                },
                //返回上一步
                goBack: function () {
                    history.go(-1);
                },
                //回复
                replay:function (id) {
                    localStorage.setItem('ReplyId',id)
                    $('.emoji-wysiwyg-editor').focus();
                },

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
            },
            created: function () {
                let code = window.location.href.split('?')[1];
                this.replyID = code.split('=')[1];
                this.$nextTick(function () {
                    //获取评论详情
                    this.replyDetails();
                })
            },
        }
    );

    /**
     * 监听文件上传框变化
     */
    $("#upload-img").change(function () {
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
    document.querySelector('.emoji-wysiwyg-editor').addEventListener('input', function () {
        app.commentsContent = $(this).text();
    });
};
