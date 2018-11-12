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
    protected $userid;


    public function _initialize()
    {
        parent::_initialize();
        $this->userid = $this->auth->getUser()->id;
    }
    /**
     * 发现分类
     *
     * @ApiTitle    (发现的分类)
     * @ApiMethod   (GET)
     * @ApiRoute    (/api/found/category)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
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
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
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

        //分类数据
         $list=db('article')->alias('a')
                ->join('article_category b','b.id=a.article_category_id')
                ->order('flag desc,zan desc')
                ->field('a.*,b.name as type_name')
                ->page($page,$this->pagesize)
                ->select();
//            ->field('id,title,coverimage,content,videfile,views,comments,auth,createtime')

         $allpage = db('article')->alias('a')
                    ->join('article_category b','b.id=a.article_category_id')
                    ->count('*');
        $pages['pageCount']=ceil($allpage/$this->pagesize);


        foreach($list as $key=>$val){
            $list[$key]['createtime']=date('Y-m-d',$val['createtime']);
        }




        $this->success("返回成功",$list,$pages);
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
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */
    public function article()
    {
        $userid=$this->userid;
        $page   =   (int)$this->request->post("page");
        $typeid =  (int)$this->request->post("type_id");
        $search = $this->request->post('title');

        if(strlen($search)>100){
            $search=mb_substr($search,0,20);
        }
        //分类数据
        if($search){
            $where['title']=['like','%'.$search.'%'];

//            $is_history=db('article_search')->where(['user_id'=>$this->userid,'word'=>$search])->find();
//            if(!$is_history){
                //添加搜索历史
                db('article_search')->insert(['user_id'=>$this->userid,'word'=>$search,'createtime'=>time()]);
//            }
        }else{
            $where['article_category_id']=$typeid;
        };

//            ->field('id,title,coverimage,content,videfile,views,comments,auth,createtime')
        
        $allpage=db('article')->where($where)->count();
        $pages['pageCount']=ceil($allpage/$this->pagesize);



        $data=db('article')->where($where)->page($page,$this->pagesize)->select();
        foreach($data as $key=>$val){
            $data[$key]['createtime']=date('Y-m-d',$val['createtime']);
        }




        $this->success("返回成功",$data,$pages);
    }



    /**
     * 文章点赞接口
     *
     * @ApiTitle    (对某文章进行点赞)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/article_zan)
     * @ApiParams   (name="article_id", type="integer", required=true, description="文章id")
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
     * })
     */
    public function article_zan()
    {
        $userid=$this->userid;
        $article_id  =  (int)$this->request->request("article_id");

        $res=db('article_zan')->where(['user_id'=>$userid,'article_id'=>$article_id])->find();
        if($res){
             db('article_zan')->where(['id'=>$res['id']])->delete();
             db('article')->where('id', $article_id)->setDec('zan');

            $this->success("取消成功");
        }

        //无文章，返回成功
        $is_article=db('article')->field('id')->where(['id'=>$article_id])->find();
        if(!$is_article){
            $this->success("点赞成功");
        }

        $insert['article_id']=$article_id;
        $insert['user_id']=$userid;
        $insert['createtime']=time();
        $res=db('article_zan')->insert($insert);
        if($res){
            //同步新增到article_comment表 赞+1
            db('article')->where('id', $article_id)->setInc('zan');

            $this->success("点赞成功");
        }else{
            $this->error('点赞失败');
        }
    }


    /**
     * 获取文章详情及评论接口
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/detail)
     * @ApiParams   (name="page", type="integer", required=true, description="评论页码")
     * @ApiParams   (name="article_id", type="integer", required=true, description="文章id")
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
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
        $userid=$this->userid;

        $page   =  (int)$this->request->post("page");
        $page = $page?$page-1:0;

        $article_id  =  (int)$this->request->post("article_id");

        $data=[];
        //初次加载
        if($page===0){
            $data['detail']=db('article')->ailas('a')
                            ->where(['a.id'=>$article_id])
                            ->join('admin b','a.admin_id=b.id')
                            ->field('a.*,b.nickname as auth,b.signtext,b.avatar as auth_avatar')
                            ->find();

            //同步新增到article浏览数+1
            db('article')->where('id',$article_id)->setInc('readnum');

            //TODO 获取用户信息 判断用户是否点赞
            $collection=db('article_collection')->where(['user_id'=>$userid,'article_id'=>$article_id])->find();
            $data['is_collection']=$collection?1:0;

            $zan=db('article_zan')->where(['user_id'=>$userid,'article_id'=>$article_id])->find();
            $data['is_zan']=$zan?1:0;



        }

        //获取第一级评论内容

        $where=['article_id'=>$article_id,'pid'=>0];

        $data['comment']=db('article_comment')->alias('a')->join('user','user.id=a.user_id')
                        ->field('user.nickname,avatar,a.*')
                        ->where($where)
                        ->order('a.createtime desc')
                        ->page($page,$this->pagesize)
                        ->select();

        //分页
        $allpage = db('article_comment')->alias('a')->join('user','user.id=a.user_id')->count('*');
        $pages['pageCount']=ceil($allpage/$this->pagesize);


        //查询该用户对评论点赞的数量
        if($data['comment']){
            foreach($data['comment'] as $key=>$val){
                $data['comment'][$key]['createtime']=date('Y-m-d',$val['createtime']);
                if($val['user_id']==$this->userid){
                    $data['comment'][$key]['is_zan']=1;
                }else{
                    $data['comment'][$key]['is_zan']=0;
                }
            }
        }


        $this->success("返回成功",$data,$pages);
    }


    /**
     * 提交评论接口
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/comment)
     * @ApiParams   (name="article_id", type="integer", required=true, description="文章id")
     * @ApiParams   (name="content", type="string", required=true, description="评论信息")
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
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
        $userid=$this->userid;
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
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
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
        $userid=$this->userid;
        $comment_id  =  (int)$this->request->request("comment_id");
        $res=db('article_comment_zan')->where(['user_id'=>$userid,'comment_id'=>$comment_id])->find();
        if($res){

            db('article_comment_zan')->where(['id'=>$res['id']])->delete();
            //同步新增到article_comment表 赞-1
            db('article_comment')->where('id', $comment_id)->setDec('zan');

            $this->success("取消成功");
        }


        $insert['comment_id']=$comment_id;
        $insert['user_id']=$userid;
        $insert['createtime']=time();
        $res=db('article_comment_zan')->insert($insert);
        if($res){
            //同步新增到article_comment表 赞+1
            db('article_comment')->where('id', $comment_id)->setInc('zan');

            $this->success("点赞成功");
        }else{
            $this->error('点赞失败');
        }
    }


    /**
     * 收藏接口
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/collection)
     * @ApiParams   (name="article_id", type="integer", required=true, description="文章id")
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
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
        $userid=$this->userid;

        $article_id= (int)$this->request->request("article_id");
        $is_have=db('article_collection')->where(['article_id'=>$article_id,'user_id'=>$userid])->find();
        if($is_have){

            db('article_collection')->where(['id'=>$is_have['id']])->delete();
            $this->success("取消成功",[]);
        }

        $insert['article_id']=$article_id;
        $insert['user_id']=$userid;
        $insert['createtime']=time();
        $res=db('article_collection')->insert($insert);
        if(!$res){
            $this->error('收藏失败',[]);
        }
        $this->success("收藏成功",[]);
    }

    /**
     * 获取某条评论详情
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/found/comment_detail)
     * @ApiParams   (name="comment_id", type="integer", required=true, description="该评论的id")
     * @ApiParams   (name="page", type="integer", required=true, description="分页数")
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
     * })
     */

    public function comment_detail()
    {
        $comment_id= (int)$this->request->request("comment_id");
        $page= (int)$this->request->request("page");

        $allPage=db('article_comment')->alias('a')
            ->join('user u','u.id=a.user_id')
            ->where(['pid'=>$comment_id])
            ->count();

        //获取当前数据的详情
        $detail=db('article_comment')->alias('a')
            ->join('user u','u.id=a.user_id')
            ->where(['a.id'=>$comment_id])
            ->field('u.nickname,avatar,a.*')
            ->find();

        //获取用户是否点赞
        $zan=db('article_comment_zan')->where(['user_id'=>$this->userid,'comment_id'=>$comment_id])->find();
        $detail['is_zan']=($zan?1:0);



        $pages['page_count']=ceil($allPage/$this->pagesize);
        $detail['children']=$this->commentTree($comment_id,true,$page);

        $this->success('获取成功',$detail,$pages);
    }




    protected function commentTree($id,$is_first=false,$page=1)
    {
        $tree=[];
        $query=db('article_comment')->alias('a')
            ->join('user u','u.id=a.user_id')
            ->where(['pid'=>$id]);
        if($is_first) {
            $query->page($page,$this->pagesize);
        }

        $data= $query->field('u.nickname,avatar,a.*')->select();


        if($data){
            //子类存在数据
            foreach($data as $key=>$val){
                $zan=db('article_comment_zan')->where(['user_id'=>$this->userid,'comment_id'=>$val['id']])->find();
                $val['is_zan']=($zan?1:0);

                $val['children']=$this->commentTree($val['id']);
                $tree[]=$val;
            }
        }
        return $tree;
    }




    /**
     * 获取用户发现搜索历史[10条]
     * @ApiMethod   (GET)
     * @ApiRoute    (/api/found/search_keywords)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
    'code':'1',
    'mesg':'返回成功'
    })
     */
    public function search_keywords()
    {
        $userid=$this->userid;
        $list=db('article_search')->where(['user_id'=>$userid])->group('word')->limit(0,10)->field('word')->select();
        $this->success('获取成功',$list);
    }

}
