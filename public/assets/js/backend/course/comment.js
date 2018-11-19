define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'course/comment/index',
                    add_url: 'course/comment/add',
                    // edit_url: 'course/comment/edit',
                    del_url: 'course/comment/del',
                    multi_url: 'course/comment/multi',
                    table: 'course_comment',
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
                        {field: 'img', title: __('Img'),formatter: Controller.api.formatter.url, operate: false},
                        {field: 'content', title: __('评论内容'), operate: false},
                        {field: 'user.nickname', title: __('评论人')},
                        {field: 'user.avatar',title: __('用户头像'),formatter: Table.api.formatter.image, operate: false},
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
        // edit: function () {
        //     Controller.api.bindevent();
        // },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            },
            formatter: {

                url: function (value, row, index) {
                    console.log(vale);
                    if(value){
                        return '<a href="' +row.img + '" target="_blank" class="label bg-green"></a>';
                    }else{
                        return '-';
                    }
                },

            }
        }
    };
    return Controller;
});