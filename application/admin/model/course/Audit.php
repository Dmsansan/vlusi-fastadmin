<?php

namespace app\admin\model\course;

use think\Model;

class Audit extends Model
{
    // 表名
    protected $name = 'course_audit';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    
    // 追加属性
    protected $append = [
        'checklist_text'
    ];
    

    
    public function getChecklistList()
    {
        return ['拒绝' => __('拒绝'),'待审核' => __('待审核'),'通过' => __('通过')];
    }     


    public function getChecklistTextAttr($value, $data)
    {        
        $value = $value ? $value : (isset($data['checklist']) ? $data['checklist'] : '');
        $list = $this->getChecklistList();
        return isset($list[$value]) ? $list[$value] : '';
    }




    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function course()
    {
        return $this->belongsTo('Course', 'course_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
