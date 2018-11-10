<?php

namespace app\admin\model\course;

use think\Model;

class Course extends Model
{
    // 表名
    protected $name = 'course';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = false;
    
    // 追加属性
    protected $append = [

    ];
    

    







}
