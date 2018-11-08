<?php

namespace app\api\controller;

use app\admin\controller\article\Category;
use app\common\controller\Api;

/**
 * 首页接口
 */
class Found extends Api
{

    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    /**
     * 测试方法
     *
     * @ApiTitle    (发现的分类)
     * @ApiSummary  (发现的分类)
     * @ApiSector   (测试分组)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/category)
     * @ApiHeaders  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
     * })
     */
    public function category()
    {
        $list=Category::find()->where()->toArray()->all();
        $this->success("返回成功", $this->request->request());
    }



}
