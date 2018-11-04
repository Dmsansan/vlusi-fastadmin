<?php

namespace app\admin\model;

use think\Model;

class Information extends Model
{
    // 表名
    protected $name = 'information';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $createTime = false;
    protected $updateTime = false;
    
    // 追加属性
    protected $append = [

    ];
    

    







    public function categroy()
    {
        return $this->belongsTo('Categroy', 'categroy_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
