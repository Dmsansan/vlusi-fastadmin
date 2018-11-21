<?php

namespace app\admin\model\article;

use think\Model;
use  app\admin\model\user;
class Category extends Model
{
    // 表名
    protected $name = 'article_category';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $createTime = false;
    protected $updateTime = false;
    
    // 追加属性
    protected $append = [

    ];

//    protected static function init()
//    {
//        Category::event('before_insert', function ($data) {
//            $ab=Category::max('weight');
//            $data->weight=$abt+1;
//        });
//    }
    

    







}
