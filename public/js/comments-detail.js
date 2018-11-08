window.onload = function () {
    let app = new Vue({
            el: '#app',
            data: {
                commentsContent: '',
                //发送按钮禁用
                isDisabled: true,
                imgList:[]
            },
            methods: {
                //上传图片
                uploadImg: function () {
                    document.getElementById('upload-img').click();
                },
                //回复
                replay:function () {
                    $('.emoji-wysiwyg-editor').focus();
                },
                //点赞
                likeComment:function () {
                    
                }
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
            }
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