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
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'title', title: __('Title')},
                        {field: 'cover_image', title: __('Cover_image'), formatter: Table.api.formatter.image},
                        {field: 'content', title: __('Content')},
                        {field: 'video_file', title: __('Video_file')},
                        {field: 'parise_num', title: __('Parise_num')},
                        {field: 'comment_num', title: __('Comment_num')},
                        {field: 'deploy_time', title: __('Deploy_time'), operate:'RANGE', addclass:'datetimerange'},
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