define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'course/course/index',
                    add_url: 'course/course/add',
                    edit_url: 'course/course/edit',
                    del_url: 'course/course/del',
                    multi_url: 'course/course/multi',
                    table: 'course',
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
                        {field: 'category.name', title: __('分类名')},

                        {field: 'name', title: __('Name')},
                        {field: 'coverimage', title: __('Coverimage'), formatter: Table.api.formatter.image},
                        {field: 'flag', title: __('Flag'), searchList: {"recommend":__('Recommend')}, operate:'FIND_IN_SET', formatter: Table.api.formatter.label},
                        {field: 'readnum', title: __('实际阅读数')},
                        {field: 'zan', title: __('实际赞')},
                        {field: 'comments', title: __('实际评论数')},
                        {field: 'readnum_set', title: __('显示阅读数')},
                        {field: 'zan_set', title: __('显示赞')},
                        {field: 'comments_set', title: __('显示评论数')},
                        {field: 'weigh', title: __('权重')},
                        {field: 'o.nickname', title: __('发布人')},
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