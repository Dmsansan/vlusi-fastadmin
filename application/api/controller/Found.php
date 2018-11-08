<?php

namespace app\api\controller;

use app\admin\model\article\Article;
use app\admin\model\article\Category;
use app\common\controller\Api;
use think\Db;

/**
 * 首页接口
 */
class Found extends Api
{

    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];
    protected $pagesize= 10;

    /**
     * 发现分类
     *
     * @ApiTitle    (发现的分类)
     * @ApiSummary  (article)
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
        //分类数据
        $cate=db('article_category')->select();
        $this->success("返回成功",$cate);
    }

    /**
     * 推荐文章
     *
     * @ApiTitle    (推荐文章)
     * @ApiSummary  (article)
     * @ApiSector   (测试分组)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/category)
     * @ApiParams   (name="page", type="integer", required=true, description="页码")
     * @ApiHeaders  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
     * })
     */
    public function recommend()
    {
        $page =  $this->request->request("page");
        //分类数据
        $list=db('article')->order('flag desc,views desc')
//            ->field('id,title,coverimage,content,videfile,views,comments,auth,createtime')
            ->limit($page*$this->pagesize,$this->pagesize)->select();
        $this->success("返回成功",$list);
    }

    /**
     * 获取分类文章
     *
     * @ApiTitle    (推荐文章)
     * @ApiSummary  (article)
     * @ApiSector   (测试分组)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/category)
     * @ApiParams   (name="page", type="integer", required=true, description="页码")
     * @ApiHeaders  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
     * })
     */
    public function article()
    {
        $page =  $this->request->request("page");
        //分类数据
        $list=db('article')->order('flag desc,views desc')
//            ->field('id,title,coverimage,content,videfile,views,comments,auth,createtime')
            ->limit($page*$this->pagesize,$this->pagesize)->select();
        $this->success("返回成功",$list);
    }







}
