window.onload = function () {
    let set = new Set(JSON.parse(localStorage.getItem('history-discovery')));
    let app = new Vue({
        el: '#app',
        data: {
            top: 0,
            startY: 0,
            pullUpState: 0, // 1:上拉加载更多, 2:加载中……, 3:我是有底线的
            isLoading: false, // 是否正在加载
            pullUpStateText: {
                moreDataTxt: '上拉加载更多',
                loadingMoreDataTxt: '加载中...',
                noMoreDataTxt: '我是有底线的'
            },
            //选中的选项卡
            activeIndex: -1,
            //轮播图
            bannerList:[],
            //选项卡
            tabList:[],
            //详情列表
            detailsList:[],
            //搜索返回的结果
            searchList: [],
            //tab页内容
            tabContent: new Map(),
            //手动改变值变化
            tabContentTracker: 0,
            //历史记录
            historyList: Array.from(set),
            //搜索的关键字
            searchKeys: '',
            //页面页码
            pageNumber:1,
            //显示的页面标记
            currentPage: 1,
            //显示历史记录还是搜索内容
            isInput: true
        },
        mounted() {
            //获取 tab页内容和页面初始化数据
            this.init();
        },

        methods: {
            touchStart (e) {
                this.startY = e.targetTouches[0].pageY
            },
            touchMove (e) {
                if (e.targetTouches[0].pageY < this.startY) { // 上拉
                    this.judgeScrollBarToTheEnd()
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
                if (scrollTop + scrollHeight >= innerHeight) {
                    this.infiniteLoad()
                }
            },

            infiniteLoad () {
                this.isLoading = true
                setTimeout(() => {
                   this.infiniteLoadDone();
                }, 800)
            },
            infiniteLoadDone () {
            let self = this;
                self.pageNumber +=1;

                $.post('/api/found/recommend', {
                    page: self.pageNumber
                }, function (data) {
                    if(data.data.length){
                        self.detailsList.push(data.data);
                        self.$nextTick(function () {
                            // this.listenScroll();
                        })
                    }else {
                        return
                    }

                });

            },
            //获取 tab页内容和页面初始化数据
            init: function () {
                let self = this;
                $.getJSON('/api/found/category', function (data) {
                    self.tabList = data.data;
                    self.$nextTick(function () {
                        //推荐内容
                        self.getRecommendList();
                    })
                });
            },
            //获取推荐数据
            getRecommendList: function () {
                let self = this;
                self.activeIndex = -1;
                $.post('/api/found/recommend', {
                    page: self.pageNumber
                }, function (data) {
                    self.detailsList = data.data;
                    self.$nextTick(function () {
                        // this.listenScroll();
                    })
                });
            },
            //获取轮播图数据
            sowingMap:function () {
                let self = this;
                $.getJSON('/api/banner/lists', function (data) {
                    console.log('获取轮播图数据',data.data)
                    self.bannerList = data.data;
                     self.$nextTick(function () {
                         console.log(1111)
                         mui.init({
                             swipeBack:true //启用右滑关闭功能
                         });
                         mui("#slider2").slider({interval: 30});
                         mui("#slider3").slider({interval: 30});
                     })

                });
            },
            loadTabContent: function (tabId, index) {
                this.activeIndex = index;
                //获取列表数据
                this.getDetailsList(tabId);
            },
            //获取详情数据
            getDetailsList: function (tabId) {
                let self = this;
                //请求获取数据
                $.post('/api/found/article', {
                    type_id: tabId,
                    page: self.pageNumber,
                }, function (data) {
                    console.log(data)
                    self.detailsList = data.data;
                });
            },
            showSearch: function () {
                //显示搜索页面
                this.currentPage = 2;
                setTimeout(function () {
                    document.getElementById('search-keys').focus();
                }, 100);
            },
            //返回首页
            goBack: function () {
                this.isInput = false;
                this.currentPage = 1;
                this.searchKeys = '';
            },
            //清除历史记录
            clearHistory: function () {
                localStorage.removeItem('history-discovery');
                app.historyList = JSON.parse(localStorage.getItem('history-discovery'));
                set.clear();
            },
            //立即搜索
            searchContent: function (content) {
                let self = this;
                if (content) {
                    self.searchKeys = content;
                }
                //改变显示状态
                self.isInput = false;
                if (self.searchKeys.trim() != '') {
                    set.add(self.searchKeys);
                    localStorage.setItem('history-discovery', JSON.stringify(Array.from(set)));
                    app.historyList = Array.from(set);
                    //请求搜索接口获取数据
                    $.post('/api/found/article', {
                        title: self.searchKeys,
                        page: self.pageNumber,
                    }, function (data) {
                        console.log(data)
                        self.searchList = data.data;
                    });

                }
            },
            //查看详情
            goInner: function (id) {
                console.log('查看详情',id);
                sessionStorage.setItem('detailId',id)
                mui.openWindow({
                    url: '/index/found/detail',
                })
            },
            //显示历史记录
            showHistory: function () {
                //改变显示状态
                this.isInput = true;
            }
        },
        created: function () {
            //获取轮播图数据
            this.sowingMap();


        },
        beforeDestroy(){
            $(window).unbind('scroll');
        },
    });
    /**
     * 固定tab
     */
        //获取 id="course_container" 元素，offsetTop是当前元素·距离网页窗口顶部的距离
   /* let offset_top = document.getElementById("tab-container").offsetTop;
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
    });*/

}