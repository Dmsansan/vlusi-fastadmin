let set = new Set(JSON.parse(localStorage.getItem('history-home')));
//设置token
/*localStorage.setItem('token','a460f6f0b010dccb4560afeaaadfd5d161db044d');*/
let app = new Vue({
    el: '#app',
    data: {
        //选中的选项卡
        activeIndex: -1,
        //底部导航
        navigationList:[
            {"id":"1","title":"课程"},
            {"id":"2","title":"发现"},
            {"id":"3","title":"我的"}
        ],
        //轮播图
        bannerList:[],
        //选项卡
        tabList:[],
        //推荐列表
        detailsList:[],
        //搜索返回的结果
        searchList:[],
        //tab页内容
        tabContent: new Map(),
        //手动改变值变化
        tabContentTracker: 0,
        //历史记录
        historyList:Array.from(set),
        //搜索的关键字
        searchKeys:'',
        //第几页
        pageNumber:1,
        //页面总页数
        pageCount:null,
        //加载更多
        loadMore:false,
        //显示的页面标记
        currentPage:1,
        //显示历史记录还是搜索内容
        isInput:true
    },
    mounted() {
        /*  //获取 tab页内容和页面初始化数据
          this.init();
          //获取轮播图数据
          this.sowingMap();*/
        //推荐内容
        // this.getRecommendList();

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
                if(self.currentPage == 1){
                    if (self.activeIndex == -1){
                        $.post('/api/found/recommend', {
                            token: localStorage.getItem('token'),
                            page: self.pageNumber
                        }, function (data) {
                            data.data.forEach(function (item,index) {
                                self.detailsList.push(item)
                            });
                        });
                    }else {
                        //获取列表数据
                        let self = this;
                        //请求获取数据
                        $.post('/api/courses/course', {
                            token: localStorage.getItem('token'),
                            page: self.pageNumber
                        }, function (data) {
                            data.data.forEach(function (item,index) {
                                self.detailsList.push(item)
                            });
                        });
                    }
                }else if(self.currentPage ==  2 ){
                    $.post('/api/courses/course', {
                        title: self.searchKeys,
                        token:localStorage.getItem('token'),
                        page:self.pageNumber
                    }, function (data) {
                        data.data.forEach(function (item,index) {
                            self.searchList.push(item)
                        });
                    });
                }
            }else {
                return
            }


        },
        //获取 tab页内容和页面初始化数据
        init: function () {
            let self = this;
            $.getJSON('/api/courses/category',{
                token: localStorage.getItem('token'),
            }, function (data) {
                self.tabList = data.data;
                self.$nextTick(function () {
                    self.getRecommendList();
                })
            });
        },
        //获取轮播图内容和页面初始化数据
        sowingMap:function () {
            let self = this;
            $.getJSON(' /api/banner/lists', function (data) {
                console.log('获取轮播图内容和页面初始化数据',data.data)
                self.bannerList = data.data;
                self.$nextTick(function () {
                    mui("#slider").slider({
                        interval: 200
                    });
                })
            });
        },
        //推荐课程接口
        getRecommendList:function () {
            if(document.documentElement.scrollTop>0){
                document.documentElement.scrollTop=0;
            }
            let self = this;
            self.activeIndex = -1;
            $.post('/api/found/recommend', {
                token: localStorage.getItem('token'),
                page: self.pageNumber
            }, function (data) {
                self.detailsList = data.data;
                self.$nextTick(function () {
                    self.pageCount = data.page.pageCount;
                    self.loadMore = true;
                    console.log('推荐课程总页数',self.pageCount)
                })
            });
        },
        loadTabContent: function (tabId, index) {
            this.activeIndex = index;
            //切换的时候情况上一个选项卡的数据
            this.pageNumber = 1;
            this.pageCount = null;
            self.detailsList = [];
            if(document.documentElement.scrollTop>0){
                document.documentElement.scrollTop=0;
            }
            this.getItemList(tabId);
        },
        //获取某个分类课程
        getItemList: function (tabId) {
            let self = this;
            $.post('/api/courses/course', {
                type_id: tabId,
                token: localStorage.getItem('token'),
                page:self.pageNumber
            }, function (data) {
                self.detailsList = data.data;
                self.$nextTick(function () {
                    self.pageCount = data.page.pageCount;
                    self.loadMore = true;
                })
            });
        },
        showSearch:function () {
            let self = this;
            //显示搜索页面
            self.currentPage = 2;
            setTimeout(function () {
                document.getElementById('search-keys').focus();
                self.searchKeys = '';
            },100);
        },
        //返回首页
        goBack:function() {
            this.isInput = false;
            this.currentPage = 1;
            this.searchKeys = '';
            if(document.documentElement.scrollTop>0){
                document.documentElement.scrollTop=0;
            }
        },
        goInner:function(id) {
            mui.openWindow({
                url:'/index/index/detail?id='+id
            })
        },
        //清除历史记录
        clearHistory:function () {
            localStorage.removeItem('history-home');
            app.historyList = JSON.parse(localStorage.getItem('history-home'));
            set.clear();
        },
        //立即搜索
        searchContent:function (content) {
            let self = this;
            self.pageNumber = 1;
            this.pageCount = null;
            if(content) {
                this.searchKeys = content;
            }
            //改变显示状态
            self.isInput = false;
            if(self.searchKeys.trim() != '') {
                set.add(this.searchKeys);
                localStorage.setItem('history-home',JSON.stringify(Array.from(set)));
                app.historyList = Array.from(set);

                $.post('/api/courses/course', {
                    title: self.searchKeys,
                    token:localStorage.getItem('token'),
                    page:self.pageNumber
                }, function (data) {
                    console.log('立即搜索',data.data);
                    self.searchList = data.data;
                    self.$nextTick(function () {
                        self.pageCount = data.page.pageCount;
                        self.loadMore = true;
                    })
                });
            }
        },
        //显示历史记录
        showHistory:function () {
            //改变显示状态
            this.isInput = true;
        },
        //底部导航栏
        switchPage:function (id) {
            if(id == 2){//发现
                mui.openWindow({
                    url:'/index/found'
                })
            }else if(id == 3){//我的
                mui.openWindow({
                    url:'/index/user/index?token='+localStorage.getItem('token')
                })
            }
        }
    },
    created: function () {
        //获取轮播图数据
        this.sowingMap();
        //获取 tab页内容和页面初始化数据
        this.init();
        let token = $('input[name="token"]').val();
        localStorage.setItem('token',token);

    },
    beforeDestroy(){
        $(window).unbind('scroll');
    },
});
/**
 * 固定tab
 */
    //获取 id="course_container" 元素，offsetTop是当前元素·距离网页窗口顶部的距离
let offset_top = document.getElementById("tab-container").offsetTop;
let isSetHeight = false;
$(window).scroll(function () {
    //获取垂直滚动的距离（scrollTop()是从顶部开始滚动产生的距离）
    let scroll_top = $(document).scrollTop();
    //防止重复设置高度页面抖动
    if (scroll_top > offset_top) {
        // 到达顶部位置，动态的添加元素属性，并给元素添加相应的元素样式
        document.getElementById("tab-container").classList.add("fixed");
    }
    else {
        // 同理，把之前添加的元素移除即可
        document.getElementById("tab-container").classList.remove("fixed");
    }
});