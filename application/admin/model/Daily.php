<?php

namespace app\admin\model;

use think\Model;

class Daily extends Model
{
    // 表名
    protected $name = 'daily';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = false;
    
    // 追加属性
    protected $append = [

    ];
    

    







    public function categroy()
    {
        return $this->belongsTo('Categroy', 'daily_categroy_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
