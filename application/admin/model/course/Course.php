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
        'flag_text'
    ];


    protected static function init()
    {
        Course::event('before_insert', function ($article) {
            $article->admin_id=session('admin')['id'];
        });
    }

    
    public function getFlagList()
    {
        return ['recommend' => __('Recommend')];
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
        return $this->belongsTo('Category', 'course_category_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function o()
    {
        return $this->belongsTo('Admin', 'admin_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
