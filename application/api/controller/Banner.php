<?php

namespace app\api\controller;

use app\common\controller\Api;
use think\Db;

/**
 * 轮播图
 */
class Banner extends Api
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    /**
     * 获取轮播图
     *
     * @ApiTitle    (轮播图接口)
     * @ApiMethod   (GET)
     * @ApiRoute    (/api/banner/lists)
     * @ApiHeaders  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
     * })
     */
    public function lists()
    {
        //分类数据
        $data=db('banner')->select();
        $this->success("返回成功",$data);
    }

}