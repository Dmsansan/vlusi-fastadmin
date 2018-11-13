define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'course/audit/index',
                    add_url: 'course/audit/add',
                    edit_url: 'course/audit/edit',
                    del_url: 'course/audit/del',
                    multi_url: 'course/audit/multi',
                    table: 'course_audit',
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
                        {field: 'user.nickname', title: '申请人'},
                        {field: 'user.mobile', title: '申请人手机号'},
                        {field: 'course.name', title: '申请课程'},
                        {field: 'checklist', title: __('Checklist'), searchList: {"拒绝":__('拒绝'),"待审核":__('待审核'),"通过":__('通过')}, formatter: Table.api.formatter.normal},

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