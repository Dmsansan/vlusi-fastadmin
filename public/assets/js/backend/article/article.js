define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'article/article/index',
                    add_url: 'article/article/add',
                    edit_url: 'article/article/edit',
                    del_url: 'article/article/del',
                    multi_url: 'article/article/multi',
                    table: 'article',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'weigh',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'title', title: __('Title')},
                        {field: 'category.name', title: __('分类名')},
                        {field: 'flag', title: __('Flag'), searchList: {"recommend":__('Flag recommend')}, operate:'FIND_IN_SET', formatter: Table.api.formatter.label},
                        {field: 'coverimage', title: __('Coverimage'), formatter: Table.api.formatter.image},
                        {field: 'videofile', title: __('Videofile')},
                        {field: 'readnum', title: __('实际阅读数')},
                        {field: 'zan', title: __('实际赞')},
                        {field: 'comments', title: __('实际评论数')},
                        {field: 'readnum_set', title: __('显示阅读数')},
                        {field: 'zan_set', title: __('显示赞数')},
                        {field: 'comments_set', title: __('显示评论数')},
                        {field: 'r.nickname', title: __('发布人')},
                        {field: 'weigh', title: __('权重')},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
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
            }
        }
    };
    return Controller;
});