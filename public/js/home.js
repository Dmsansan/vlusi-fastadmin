window.onload = function () {
    let set = new Set(JSON.parse(localStorage.getItem('history-home')));
    let app = new Vue({
        el: '#app',
        data: {
            //选中的选项卡
            activeIndex: -1,
            //选项卡
            tabList:[],
            //推荐列表
            detailsList:[],
            //搜索返回的结果
            searchList:[
                {
                    "id": 0,
                    "img": "img/show.jpg",
                    "label": "养生",
                    "title": "这是标题",
                    "content": "这是内容",
                    "date": "2018-02-25",
                    "times":2000,
                    "comments":100
                },
                {
                    "id": 1,
                    "img": "img/show.jpg",
                    "label": "养生",
                    "title": "这是标题",
                    "content": "这是内容",
                    "date": "2018-02-25",
                    "times":2000,
                    "comments":100
                },
                {
                    "id": 2,
                    "img": "img/show.jpg",
                    "label": "养生",
                    "title": "这是标题",
                    "content": "这是内容",
                    "date": "2018-02-25",
                    "times":2000,
                    "comments":100
                }
            ],
            //tab页内容
            tabContent: new Map(),
            //手动改变值变化
            tabContentTracker: 0,
            //历史记录
            historyList:Array.from(set),
            //搜索的关键字
            searchKeys:'',
            //显示的页面标记
            currentPage:1,
            //显示历史记录还是搜索内容
            isInput:true
        },
        mounted() {
            //获取 tab页内容和页面初始化数据
            this.init();
            //获取轮播图数据
            //this.sowingMap();
            //推荐内容
            // this.getRecommendList();
        },
        methods: {
            //获取 tab页内容和页面初始化数据
            init: function () {
                let self = this;
                $.getJSON('/api/courses/category', function (data) {
                    self.tabList = data.data;
                    self.$nextTick(function () {
                        self.getRecommendList();
                    })
                });
            },
            //推荐课程接口
            getRecommendList:function () {
                let self = this;
                self.activeIndex = -1;
                $.post('/api/found/recommend', {
                    page: self.currentPage
                }, function (data) {
                    console.log('推荐课程接口',data.data)
                    self.detailsList = data.data;
                });
            },
            loadTabContent: function (tabId, index) {
                this.activeIndex = index;
                this.getItemList(tabId);
            },
            //获取某个分类课程
            getItemList: function (tabId) {
                console.log(tabId)
                let self = this;
                $.post('/api/courses/course', {
                    type_id: tabId,
                    page:self.currentPage
                    }, function (data) {
                    console.log('获取某个分类课程',data.data);
                    self.detailsList = data.data;
                });
            },
            showSearch:function () {
                //显示搜索页面
                this.currentPage = 2;
                setTimeout(function () {
                    document.getElementById('search-keys').focus();
                },100);
            },
            //返回首页
            goBack:function() {
                this.isInput = false;
                this.currentPage = 1;
                this.searchKeys = '';
            },
            goInner:function(id) {
                sessionStorage.setItem('curriculumId',id)
                console.log('00000',id);
              mui.openWindow({
                  url:'/index/detail'
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
                if(content) {
                    this.searchKeys = content;
                }
                //改变显示状态
                this.isInput = false;
                if(this.searchKeys.trim() != '') {
                    set.add(this.searchKeys);
                    localStorage.setItem('history-home',JSON.stringify(Array.from(set)));
                    app.historyList = Array.from(set);
                }
            },
            //显示历史记录
            showHistory:function () {
                //改变显示状态
                this.isInput = true;
            }
        },
        created: function () {
            //获取第一个tab页内容
            this.getItemList(this.tabList[0].id);
        }
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

}