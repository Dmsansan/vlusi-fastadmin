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
                        {field: 'course_id', title: __('Course_id')},
                        {field: 'user_id', title: __('User_id')},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'checklist', title: __('Checklist'), searchList: {"拒绝":__('拒绝'),"待审核":__('待审核'),"通过":__('通过')}, formatter: Table.api.formatter.normal},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'user.id', title: __('User.id')},
                        {field: 'user.group_id', title: __('User.group_id')},
                        {field: 'user.username', title: __('User.username')},
                        {field: 'user.nickname', title: __('User.nickname')},
                        {field: 'user.password', title: __('User.password')},
                        {field: 'user.salt', title: __('User.salt')},
                        {field: 'user.email', title: __('User.email')},
                        {field: 'user.mobile', title: __('User.mobile')},
                        {field: 'user.avatar', title: __('User.avatar')},
                        {field: 'user.level', title: __('User.level')},
                        {field: 'user.gender', title: __('User.gender')},
                        {field: 'user.birthday', title: __('User.birthday'), operate:'RANGE', addclass:'datetimerange'},
                        {field: 'user.bio', title: __('User.bio')},
                        {field: 'user.score', title: __('User.score')},
                        {field: 'user.successions', title: __('User.successions')},
                        {field: 'user.maxsuccessions', title: __('User.maxsuccessions')},
                        {field: 'user.prevtime', title: __('User.prevtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'user.logintime', title: __('User.logintime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'user.loginip', title: __('User.loginip')},
                        {field: 'user.loginfailure', title: __('User.loginfailure')},
                        {field: 'user.joinip', title: __('User.joinip')},
                        {field: 'user.jointime', title: __('User.jointime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'user.createtime', title: __('User.createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'user.updatetime', title: __('User.updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'user.token', title: __('User.token')},
                        {field: 'user.status', title: __('User.status'), formatter: Table.api.formatter.status},
                        {field: 'user.verification', title: __('User.verification')},
                        {field: 'course.id', title: __('Course.id')},
                        {field: 'course.course_category_id', title: __('Course.course_category_id')},
                        {field: 'course.name', title: __('Course.name')},
                        {field: 'course.coverimage', title: __('Course.coverimage'), formatter: Table.api.formatter.image},
                        {field: 'course.flag', title: __('Course.flag'), operate:'FIND_IN_SET', formatter: Table.api.formatter.label},
                        {field: 'course.desc', title: __('Course.desc')},
                        {field: 'course.coursetimes', title: __('Course.coursetimes')},
                        {field: 'course.notice', title: __('Course.notice')},
                        {field: 'course.auth', title: __('Course.auth')},
                        {field: 'course.readnum', title: __('Course.readnum')},
                        {field: 'course.zan', title: __('Course.zan')},
                        {field: 'course.comments', title: __('Course.comments')},
                        {field: 'course.createtime', title: __('Course.createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
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