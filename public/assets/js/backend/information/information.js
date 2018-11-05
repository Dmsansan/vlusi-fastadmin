define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'information/information/index',
                    add_url: 'information/information/add',
                    edit_url: 'information/information/edit',
                    del_url: 'information/information/del',
                    multi_url: 'information/information/multi',
                    table: 'information',
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
                        {field: 'categroy_id', title: __('Categroy_id')},
                        {field: 'content', title: __('Content')},
                        {field: 'comment_num', title: __('Comment_num')},
                        {field: 'praise_num', title: __('Praise_num')},
                        {field: 'collection_num', title: __('Collection_num')},
                        {field: 'report_time', title: __('Report_time'), operate:'RANGE', addclass:'datetimerange'},
                        {field: 'add_time', title: __('Add_time'), operate:'RANGE', addclass:'datetimerange'},
                        {field: 'categroy.id', title: __('Categroy.id')},
                        {field: 'categroy.categroy_name', title: __('Categroy.categroy_name')},
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