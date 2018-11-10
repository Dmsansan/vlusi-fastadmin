define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'course/nodes/index',
                    add_url: 'course/nodes/add',
                    edit_url: 'course/nodes/edit',
                    del_url: 'course/nodes/del',
                    multi_url: 'course/nodes/multi',
                    table: 'course_nodes',
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
                        {field: 'course.name', title: __('Course.name')},
                        {field: 'sort', title: __('Sort')},
                        {field: 'title', title: __('Title')},
                        {field: 'desc', title: __('Desc')},
                        {field: 'content', title: __('Content')},
                        {field: 'coverimage', title: __('Coverimage'), formatter: Table.api.formatter.image},
                        {field: 'videofile', title: __('Videofile')},
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