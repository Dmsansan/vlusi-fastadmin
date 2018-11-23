
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
        },
        beforeDestroy(){
            $(window).unbind('scroll');
        },
        created: function () {
            //课程里面审核通过接口
            this.reviewPass();
        },
    });
