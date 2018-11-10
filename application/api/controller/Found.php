<?php

namespace app\api\controller;

use app\admin\model\article\Article;
use app\admin\model\article\Category;
use app\common\controller\Api;
use think\Db;

/**
 * 发现
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
     * @ApiMethod   (GET)
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
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/recommend)
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
        $page =   (int)$this->request->post("page");
        $page = $page?$page-1:0;
        //分类数据
        $list=db('article')->order('flag desc,views desc')
//            ->field('id,title,coverimage,content,videfile,views,comments,auth,createtime')
            ->limit($page*$this->pagesize,$this->pagesize)->select();

        foreach($list as $key=>$val){
            $list[$key]['createtime']=date('Y-m-d',$val['createtime']);
        }


        $this->success("返回成功",$list);
    }

    /**
     * 获取分类文章
     *
     * @ApiTitle    (获取某分类的文章)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/article)
     * @ApiParams   (name="type_id", type="integer", required=true, description="分类id")
     * @ApiParams   (name="page", type="integer", required=true, description="页码")
     * @ApiParams   (name="title", type="integer", required=false, description="搜索的标题")
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
        $page   =   (int)$this->request->post("page");
        $typeid =  (int)$this->request->post("type_id");
        $page = $page?$page-1:0;
        $search = $this->request->post('title');

        //分类数据
        $list=db('article')->order('flag desc,views desc');
        $list->where(['article_category_id'=>$typeid]);
        if($search){
            $list->where(['title'=>['like','%'.$search.'%']]);
        };
//            ->field('id,title,coverimage,content,videfile,views,comments,auth,createtime')
        $data=$list->limit($page*$this->pagesize,$this->pagesize)->select();

        foreach($data as $key=>$val){
            $data[$key]['createtime']=date('Y-m-d',$val['createtime']);
        }

        $this->success("返回成功",$data);
    }


    /**
     * 获取文章详情及评论接口
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/detail)
     * @ApiParams   (name="page", type="integer", required=true, description="评论页码")
     * @ApiParams   (name="article_id", type="integer", required=true, description="文章id")
     * @ApiHeaders  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
     * })
     */
    public function detail()
    {
        $userid=47;

        $page   =  (int)$this->request->post("page");
        $page = $page?$page-1:0;

        $article_id  =  (int)$this->request->post("article_id");

        $data=[];
        //初次加载
        if($page===0){
            $data['detail'] =db('article')->where(['id'=>$article_id])->find();

            //同步新增到article浏览数+1
            db('article')->where('id',$article_id)->setInc('browse');

            //TODO 获取用户信息 判断用户是否点赞
            $collection=db('article_collection')->where(['user_id'=>$userid,'article_id'=>$article_id])->find();
            $data['is_collection']=$collection?1:0;

        }

        //获取第一级评论内容
        $data['comment']=db('article_comment')->alias('a')->join('user','user.id=a.user_id')
                ->field('user.nickname,avatar,a.*')
                ->where(['article_id'=>$article_id,'pid'=>0])
                ->order('createtime desc')
                ->limit($page*$this->pagesize,$this->pagesize)
                ->select();


        foreach($data['comment'] as $key=>$val){
            $data['comment'][$key]['createtime']=date('Y-m-d',$val['createtime']);
        }



        $this->success("返回成功",$data);
    }


    /**
     * 提交评论接口
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/comment)
     * @ApiParams   (name="article_id", type="integer", required=true, description="文章id")
     * @ApiParams   (name="content", type="string", required=true, description="评论信息")
     * @ApiHeaders  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
     * })
     */
    public function comment()
    {
        $userid=47;
        $article_id  =  (int)$this->request->request("article_id");
        $content=$this->request->request("content");

        $insert['article_id']=$article_id;
        $insert['content']=$content;
        $insert['user_id']=$userid;
        $insert['createtime']=time();
        $res=db('article_comment')->insert($insert);
        if($res){
            //同步新增到article表 评论数加1
            db('article')->where('id', $article_id)->setInc('comments');

            $this->success("评论成功");
        }else{
            $this->error('评论失败');
        }
    }


    /**
     * 评论点赞接口
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/comment_zan)
     * @ApiParams   (name="comment_id", type="integer", required=true, description="评论id")
     * @ApiHeaders  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
     * })
     */
    public function comment_zan()
    {
        $userid=47;
        $comment_id  =  (int)$this->request->request("comment_id");

        $insert['comment_id']=$comment_id;
        $insert['user_id']=$userid;
        $insert['createtime']=time();
        $res=db('article_comment_zan')->insert($insert);
        if($res){
            //同步新增到article_comment表 赞+1
            db('article_comment')->where('id', $comment_id)->setInc('zan');

            $this->success("评论成功");
        }else{
            $this->error('评论失败');
        }
    }


    /**
     * 收藏接口
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/collection)
     * @ApiParams   (name="article_id", type="integer", required=true, description="文章id")
     * @ApiHeaders  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
     * })
     */
    public function collection()
    {
        $userid=47;

        $article_id= (int)$this->request->request("article_id");
        $is_have=db('article_collection')->where(['article_id'=>$article_id,'user_id'=>$userid])->find();
        if(!$is_have){
            $insert['article_id']=$article_id;
            $insert['user_id']=$userid;
            $insert['createtime']=time();
            $res=db('article_collection')->insert($insert);
            if(!$res){
                $this->error('收藏失败',[]);
            }
        }

        $this->success("收藏成功",[]);
    }

    public function comment_detail()
    {
        
    }





}
