define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'article/comment/index',
                    add_url: 'article/comment/add',
                    edit_url: 'article/comment/edit',
                    del_url: 'article/comment/del',
                    multi_url: 'article/comment/multi',
                    table: 'article_comment',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'article.title', title: __('Article.title')},
                        {field: 'content', title: __('Content')},
                        {field: 'img', title: __('Img'),formatter: Controller.api.formatter.url, operate: false},
                        {field: 'user.nickname', title: __('评论人')},
                        {field: 'user.avatar',title: __('用户头像'),formatter: Table.api.formatter.image, operate: false},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                    ]
                ]
            });

            

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            },
            formatter: {

                url: function (value, row, index) {
                    return '<a href="' +row.img + '" target="_blank" class="label bg-green"></a>';
                },

            }
        }
    };
    return Controller;
});