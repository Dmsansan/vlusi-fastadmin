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
        // historyList:Array.from(set),
        historyList:[],
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
        isInput:true,
        //分享内容
        //分享内容
        imgUrl: '',
        title: '',
        desc: '',
        shareUrl: '',
        configWX: [],
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
                        interval: 1000 * 5
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
            $.post('/api/courses/recommend', {
                token: localStorage.getItem('token'),
                page: self.pageNumber
            }, function (data) {
                self.detailsList = data.data;
                //分享内容
                self.imgUrl = '../img/logo.png';
                self.title = '乐养老';
                self.desc = '文化养老综合服务提供商';
                self.sharingMethod();
                self.$nextTick(function () {
                    self.pageCount = data.page.pageCount;
                    self.loadMore = true;

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
                //分享内容

                self.imgUrl = '../img/logo.png';
                self.title = '乐养老';
                self.desc = '文化养老综合服务提供商';
                self.sharingMethod();
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
            let self = this;
            $.post('/api/courses/delete_keywords', {
                token: localStorage.getItem('token'),
            }, function (data) {
                self.$nextTick(function () {
                    self.historyList =[];
                })
            });


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
                /*app.historyList = Array.from(set);*/

                $.post('/api/courses/course', {
                    title: self.searchKeys,
                    token:localStorage.getItem('token'),
                    page:self.pageNumber
                }, function (data) {
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
            let self = this;
            //改变显示状态
            self.isInput = true;
            // 获取用户课程搜索历史[10条]
            $.getJSON('/api/courses/search_keywords', {
                token:localStorage.getItem('token'),
            }, function (data) {
                self.historyList = data.data;
            });
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
        },
        //分享方法
        sharingMethod:function () {
            let self = this;
            self.shareUrl = location.href.split('#')[0];
            $.post('/api/index/getShareSigna', {
                url: encodeURIComponent(self.shareUrl),
                token: localStorage.getItem('token')
            }, function (data) {
                if (data.code == 1) {
                    self.configWX = data.data;
                    self.$nextTick(function () {
                        shareWeChat(self.configWX);
                    })
                }
            });
            function shareWeChat(todo) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
                    appId: todo.appid, // 必填，公众号的唯一标识
                    timestamp: todo.timesTamp, // 必填，生成签名的时间戳
                    nonceStr: todo.nonceStr, // 必填，生成签名的随机串
                    signature: todo.signaTure,// 必填，签名
                    jsApiList: [
                        "onMenuShareAppMessage",//分享给朋友接口
                        "onMenuShareTimeline",//分享给朋友接口
                        "updateAppMessageShareData",//分享给朋友接口
                        "updateTimelineShareData",//分享给朋友接口
                    ] // 必填，需要使用的JS接口列表
                });
            }
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: self.title, // 分享标题
                    desc: self.desc, // 分享描述
                    link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: self.imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareAppMessage({
                    title: self.title, // 分享标题
                    desc: self.desc, // 分享描述
                    link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: self.imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // alert(1111);
                    }
                });
                wx.updateTimelineShareData({
                    title: self.title, // 分享标题
                    desc: self.desc, // 分享描述
                    link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: self.imgUrl, // 分享图标
                    success: function () {
                        // 设置成功
                        /* alert(141414);*/
                    }
                });


                wx.updateAppMessageShareData({
                    title: self.title, // 分享标题
                    desc: self.desc, // 分享描述
                    link: self.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: self.imgUrl, // 分享图标
                    success: function () {
                        // 设置成功
                        /*alert(141414);*/
                    }
                });



            })

        }

    },
    created: function () {
        let self = this;
        //获取轮播图数据
        self.sowingMap();
        let token = $('input[name="token"]').val();
        localStorage.setItem('token',token);
        if (localStorage.getItem('token')){
            self.$nextTick(function () {
                //获取 tab页内容和页面初始化数据
                self.init();
            })
        }


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