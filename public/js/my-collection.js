
let app = new Vue({
        el: '#app',
        data: {
            //页面页码
            pageNumber:1,
            //页面总页数
            pageCount:null,
            //加载更多
            loadMore:false,
            //课程数据
            curriculumList:[],
            //w文章数据
            articleList:[],
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
                        $.post('/api/user/my_collection', {
                            token:localStorage.getItem('token'),
                            page:self.pageNumber
                        }, function (data) {
                            data.data.forEach(function (item,index) {
                                self.curriculumList.push(item)
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
            //收藏里面课程接口
            collectionHour:function () {
                let self = this;
                $.post('/api/user/my_collection', {
                    token:localStorage.getItem('token'),
                    page:self.pageNumber
                }, function (data) {
                    console.log('获取某个分类课程',data);
                    self.curriculumList = data.data;
                    self.pageCount = data.page.page_count;
                    self.loadMore = true;
                });
            },
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
                console.log(index)
                if(index == 0){
                    //课程
                    self.collectionHour();
                }else {
                    //文章
                    self.tabIndex = 2;
                    $.post('/api/user/my_article', {
                        token:localStorage.getItem('token'),
                        page:self.pageNumber
                    }, function (data) {
                        console.log('文章',data);
                        self.articleList = data.data;
                        self.pageCount = data.page.page_count;
                        self.loadMore = true;
                    });
                }
            },
            //课程详情
            goCourse:function (id) {
                //进入课程
                mui.openWindow({
                    url:'/index/index/detail?id='+id
                })
            },
            //文章详情
            goDiscovery:function (id) {
                //进入文章
                mui.openWindow({
                    url:'/index/found/detail?id='+id
                })
            }
        },
        beforeDestroy(){
            $(window).unbind('scroll');
        },
        created: function () {
            //收藏里面课程接口
            this.collectionHour();
        },
    });
