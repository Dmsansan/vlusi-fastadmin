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
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'title', title: __('Title')},
                        {field: 'article_category_id', title: __('Article_category_id')},
                        {field: 'flag', title: __('Flag'), searchList: {"recommend":__('Flag recommend')}, operate:'FIND_IN_SET', formatter: Table.api.formatter.label},
                        {field: 'coverimage', title: __('Coverimage'), formatter: Table.api.formatter.image},
                        {field: 'videofile', title: __('Videofile')},
                        {field: 'readnum', title: __('Readnum')},
                        {field: 'zan', title: __('Zan')},
                        {field: 'comments', title: __('Comments')},
                        {field: 'auth', title: __('Auth')},
                        {field: 'admin_id', title: __('Admin_id')},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'category.id', title: __('Category.id')},
                        {field: 'category.name', title: __('Category.name')},
                        {field: 'r.id', title: __('R.id')},
                        {field: 'r.username', title: __('R.username')},
                        {field: 'r.nickname', title: __('R.nickname')},
                        {field: 'r.signtext', title: __('R.signtext')},
                        {field: 'r.password', title: __('R.password')},
                        {field: 'r.salt', title: __('R.salt')},
                        {field: 'r.avatar', title: __('R.avatar')},
                        {field: 'r.email', title: __('R.email')},
                        {field: 'r.loginfailure', title: __('R.loginfailure')},
                        {field: 'r.logintime', title: __('R.logintime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'r.createtime', title: __('R.createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'r.updatetime', title: __('R.updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'r.token', title: __('R.token')},
                        {field: 'r.status', title: __('R.status'), formatter: Table.api.formatter.status},
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