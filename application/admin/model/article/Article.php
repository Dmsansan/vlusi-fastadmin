<?php

namespace app\admin\model\article;

use think\Model;

class Article extends Model
{
    // 表名
    protected $name = 'article';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = false;
    
    // 追加属性
    protected $append = [
        'flag_text'
    ];
    

    
    public function getFlagList()
    {
        return ['recommend' => __('Flag recommend')];
    }     


    public function getFlagTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['flag']) ? $data['flag'] : '');
        $valueArr = explode(',', $value);
        $list = $this->getFlagList();
        return implode(',', array_intersect_key($list, array_flip($valueArr)));
    }

    protected function setFlagAttr($value)
    {
        return is_array($value) ? implode(',', $value) : $value;
    }


    public function category()
    {
        return $this->belongsTo('Category', 'article_category_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
