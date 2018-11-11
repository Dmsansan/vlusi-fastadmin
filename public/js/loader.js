/**
 * 添加title
 */
document.querySelector('title').innerHTML = '乐养老';
/**
 * 添加meta标签
 */
let metaNode = document.createElement('meta');
metaNode.name = 'viewport';
metaNode.content = 'width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1.0';
document.querySelector('head').appendChild(metaNode);
let jsList = [
    '/assets/jquery/jquery-3.3.1.min.js',
    // '/assets/mui/js/mui.min.js?version=1.0',
    '/assets/vue/vue.min.js'
];

let cssList = [
    '/assets/mui/css/mui.min.css',
    '/css/common.css'
];
/**
 * 加载css样式表
 */
cssList.forEach(function (link, index) {
    let linkNode = document.createElement('link');
    linkNode.href = link;
    linkNode.rel = 'stylesheet';
    document.querySelector('head').appendChild(linkNode);
});

/**
 * 加载js脚本
 */
jsList.forEach(function (src, index) {
    let jsNode = document.createElement('script');
    jsNode.src = src;
    jsNode.type = 'text/javascript';
    document.querySelector('head').appendChild(jsNode);
    if(jsNode.src.indexOf('version') != -1) {
        jsNode.onload = function () {
            mui('body').on('tap','a.mui-tab-item',function () {
                if(this.href != 'javascript:;') {
                    mui.openWindow({
                        url:this.href
                    })
                }
            })
        }
    }
});


function openWindow(url) {
    window.location.href = url;
}