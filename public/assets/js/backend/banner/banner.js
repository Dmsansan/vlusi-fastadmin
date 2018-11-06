define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'banner/banner/index',
                    add_url: 'banner/banner/add',
                    edit_url: 'banner/banner/edit',
                    del_url: 'banner/banner/del',
                    multi_url: 'banner/banner/multi',
                    table: 'banner',
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
                        {field: 'img_url', title: __('Preview'), formatter: Controller.api.formatter.thumb},
                        {field: 'img_url', title: __('Img_url'), formatter: Controller.api.formatter.url},
                        {field: 'link_url', title: __('Link_url'), formatter: Table.api.formatter.url},
                        {field: 'status', title: __('Status'), formatter: Controller.api.formatter.status, operate: false},
                        {field: 'remark', title: __('Remark')},
                        {field: 'add_time', title: __('Add_time'), operate:'RANGE', addclass:'datetimerange'},
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
            },
            formatter: {
                status: function (value, row, index) {
                    if (row.status == 1) {
                        return __('Yes');
                    } else {
                        return __('No');
                    }
                },
                url: function (value, row, index) {
                    return '<a href="' + row.fullurl + '" target="_blank" class="label bg-green">' + value + '</a>';
                },thumb: function (value, row, index) {
                    if(row.img_url != null){
                        var style = row.storage == 'upyun' ? '!/fwfh/120x90' : '';
                        return '<a href="' + row.fullurl + '" target="_blank"><img src="' + row.fullurl + style + '" alt="" style="max-height:90px;max-width:120px"></a>';
                    } else {
                        return '<a href="' + row.fullurl + '" target="_blank">' + __('None') + '</a>';
                    }
                },
            }
        }
    };
    return Controller;
});