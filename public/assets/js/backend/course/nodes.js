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
                        // {field: 'course_id', title: __('Course_id')},
                        {field: 'course.name', title: __('Course.name')},
                        {field: 'sort', title: __('Sort')},
                        {field: 'title', title: __('Title')},
                        // {field: 'desc', title: __('Desc')},
                        // {field: 'content', title: __('Content')},
                        {field: 'coverimage', title: __('Coverimage'), formatter: Table.api.formatter.image},
                        {field: 'videofile', title: __('Videofile')},
                        {field: 'isviewlist', title: __('Isviewlist'), searchList: {"不可体验":__('不可体验'),"可体验":__('可体验')}, formatter: Table.api.formatter.normal},

                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        // {field: 'course.id', title: __('Course.id')},
                        // {field: 'course.course_category_id', title: __('Course.course_category_id')},
                        // {field: 'course.coverimage', title: __('Course.coverimage'), formatter: Table.api.formatter.image},
                        // {field: 'course.flag', title: __('Course.flag'), operate:'FIND_IN_SET', formatter: Table.api.formatter.label},
                        // {field: 'course.desc', title: __('Course.desc')},
                        // {field: 'course.coursetimes', title: __('Course.coursetimes')},
                        // {field: 'course.notice', title: __('Course.notice')},
                        // {field: 'course.auth', title: __('Course.auth')},
                        // {field: 'course.readnum', title: __('Course.readnum')},
                        // {field: 'course.zan', title: __('Course.zan')},
                        // {field: 'course.comments', title: __('Course.comments')},
                        // {field: 'course.createtime', title: __('Course.createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
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