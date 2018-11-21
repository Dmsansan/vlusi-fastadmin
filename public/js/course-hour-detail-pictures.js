window.onload = function() {
	/**
	 * 引入图片浏览器组件
	 * @type {HTMLElement}
	 */
	let jsList = [
		'assets/mui/js/mui.zoom.js',
		'assets/mui/js/mui.previewimage.js'
	];
	jsList.forEach(function(src, i) {
		let jsNode = document.createElement('script');
		jsNode.src = src;
		jsNode.type = 'text/javascript';
		document.querySelector('head').appendChild(jsNode);
		if(i == 1) {
			jsNode.onload = function() {
				mui.previewImage();
			}
		}
	});
	let app = new Vue({
		el: '#app',
		data: {},
		methods: {
            goCourse:function (id) {
                //进入课程
                mui.openWindow({
                    url:'course-detail.html?id='+id
                })
            },
            goBack: function () {
                history.go(-1);
            }
		}
	});
};