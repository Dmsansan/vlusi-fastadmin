<?php

namespace app\api\controller;

use app\common\controller\Api;
use app\common\library\Ems;
use app\common\library\Sms;
use fast\Random;
use think\Validate;

/**
 * 用户中心接口
 */
class User extends Api
{

    protected $noNeedLogin = ['login', 'mobilelogin', 'register', 'third'];
    protected $noNeedRight = '*';
    protected $pagesize=10;

    public function _initialize()
    {
        parent::_initialize();
    }





    /**
     * @ApiTitle    (修改个人信息)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/user/profile)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiParams   (name="nickname", type="string", required=false, description="用户名")
     * @ApiParams   (name="avatar", type="string", required=false, description="用户头像")
     * @ApiParams   (name="address", type="integer", required=false, description="区域管理")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */
    public function profile()
    {
        $user_id = $this->auth->getUser()->id;
        if (!$user_id)
        {
            $this->error(__('用户id为空'));
        }
        $nickname = $this->request->post("nickname");
        $address = $this->request->post('address');
        $avatar = $this->request->post('avatar');
        $data = array();
        if($nickname){
            $data['nickname'] = $nickname;
        }
        if($address){
            $data['address'] = $address;
        }
        if($avatar){
            $data['avatar'] = $avatar;
        }
        if($data == array()){
            $this->error(__('修改数据为空'));
        }
        $result = db('user')->where(array('id'=>$user_id))->update($data);
        if($result){
            $this->success("返回成功",$data);
        }else{
            $this->success("无变化",$data);
        }
    }

    /**
     *
     * @ApiTitle    (修改手机号)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/user/changemobile)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiParams   (name="mobile", type="string", required=true, description="手机号")
     * @ApiParams   (name="captcha", type="string", required=true, description="验证码")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */
    public function changemobile()
    {
        $user_id = $this->auth->getUser()->id;


        $mobile = $this->request->post("mobile");
        $captcha = $this->request->post('captcha');

        if (!$mobile || !$captcha)
        {
            $this->error(__('Invalid parameters'));
        }
        if (!Validate::regex($mobile, "^1\d{10}$"))
        {
            $this->error(__('Mobile is incorrect'));
        }
        if (\app\common\model\User::where('mobile', $mobile)->where('id', '<>', $user_id)->find())
        {
            $this->error(__('Mobile already exists'));
        }
        $result = Sms::check($mobile, $captcha, 'changemobile');
        if (!$result)
        {
            $this->error(__('Captcha is incorrect'));
        }
        $data = array(
            'mobile' => $mobile,
        );
        $result = db('user')->where(array('id'=>$user_id))->update($data);

        Sms::flush($mobile, 'changemobile');
        $this->success("返回成功");
    }

    /**
     * 第三方登录
     *
     * @param string $platform 平台名称
     * @param string $code Code码
     */
    public function third()
    {
        $url = url('user/index');
        $platform = $this->request->request("platform");
        $code = $this->request->request("code");
        $config = get_addon_config('third');
        if (!$config || !isset($config[$platform]))
        {
            $this->error(__('Invalid parameters'));
        }
        $app = new \addons\third\library\Application($config);
        //通过code换access_token和绑定会员
        $result = $app->{$platform}->getUserInfo(['code' => $code]);
        if ($result)
        {
            $loginret = \addons\third\library\Service::connect($platform, $result);
            if ($loginret)
            {
                $data = [
                    'userinfo'  => $this->auth->getUserinfo(),
                    'thirdinfo' => $result
                ];
                $this->success(__('Logged in successful'), $data);
            }
        }
        $this->error(__('Operation failed'), $url);
    }

    /**
     * 课程分类
     * @ApiTitle    (我的收藏课程)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/user/my_collection)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiParams  (name=page, type=string, required=true, description="分页数")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */
    public function my_collection()
    {
        $userid = $this->auth->getUser()->id;
        $page =(int)$this->request->post("page");

        $myCollection=db('course_collection')->alias('a')
                    ->join('course b','a.course_id=b.id')
                    ->where(['user_id'=>$userid])
                    ->field('a.id,a.course_id,b.name,b.coverimage,a.createtime')
                    ->page($page,$this->pagesize)
                    ->select();

        $allpage=db('course_collection')->alias('a')
                ->join('course b','a.course_id=b.id')
                ->where(['user_id'=>$userid])
                ->count('*');


        $pages['page_count']=ceil($allpage/$this->pagesize);

        foreach($myCollection as $key=>$val){
            $nodes=db('course_nodes')->where(['course_id'=>$val['course_id']])->field('title as node_title')->limit(0,3)->select();
            $myCollection[$key]['course_nodes']=$nodes;
        }

        $this->success('获取成功',$myCollection,$pages);

    }


    /**
     * 课程分类
     * @ApiTitle    (我的收藏文章)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/user/my_article)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiParams  (name=page, type=string, required=true, description="分页数")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */
    public function my_article()
    {
        $userid = $this->auth->getUser()->id;
        $page =(int)$this->request->post("page");

        $myCollection=db('article_collection')->alias('a')
            ->join('article b','a.article_id=b.id')
            ->where(['user_id'=>$userid])
            ->field('a.id,a.article_id,b.title,b.coverimage,b.content,a.createtime')
            ->page($page,$this->pagesize)
            ->select();

       $allpage= db('article_collection')->alias('a')
                ->join('article b','a.article_id=b.id')
                ->where(['user_id'=>$userid])
                ->count();

       $pages['page_count']=ceil($allpage/$this->pagesize);
        foreach($myCollection as $key=>$val){
            $myCollection[$key]['content']=strip_tags($val['content']);//$this->strip($val['content']);
        }


        $this->success('获取成功',$myCollection,$pages);

    }

    /**
     * 课程分类
     * @ApiTitle    (我的已审核课程)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/user/my_succ_course)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiParams  (name=page, type=string, required=true, description="分页数")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */
    public function my_succ_course()
    {
        $userid = $this->auth->getUser()->id;
        $page =(int)$this->request->post("page");
        $mycourse=db('course_audit')->alias('a')
            ->join('course b','a.course_id=b.id')
            ->where(['user_id'=>$userid,'checklist'=>'通过'])
            ->field('a.id,a.course_id,b.name,b.coverimage,a.createtime')
            ->page($page,$this->pagesize)
            ->select();



        $allpage=db('course_audit')->alias('a')
            ->join('course b','a.course_id=b.id')
            ->where(['user_id'=>$userid,'checklist'=>'通过'])
            ->count('*');

        $pages['page_count']=ceil($allpage/$this->pagesize);

        foreach($mycourse as $key=>$val){
            $nodes=db('course_nodes')->where(['course_id'=>$val['course_id']])->field('title as node_title')->limit(0,3)->select();
            $mycourse[$key]['course_nodes']=$nodes;
        }


        $this->success('获取成功',$mycourse,$pages);


    }


    /**
     * 课程分类
     * @ApiTitle    (我的待审核课程)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/user/my_wait_course)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiParams  (name=page, type=string, required=true, description="分页数")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */
    public function my_wait_course()
    {
        $userid = $this->auth->getUser()->id;
        $page =(int)$this->request->post("page");
        $mycourse=db('course_audit')->alias('a')
            ->join('course b','a.course_id=b.id')
            ->where(['user_id'=>$userid,'checklist'=>'待审核'])
            ->field('a.id,a.course_id,b.name,b.coverimage,a.createtime')
            ->page($page,$this->pagesize)
            ->select();



        $allpage=db('course_audit')->alias('a')
            ->join('course b','a.course_id=b.id')
            ->where(['user_id'=>$userid,'checklist'=>'待审核'])
            ->count('*');

        $pages['page_count']=ceil($allpage/$this->pagesize);

        foreach($mycourse as $key=>$val){
            $nodes=db('course_nodes')->where(['course_id'=>$val['course_id']])->field('title as node_title')->limit(0,3)->select();
            $mycourse[$key]['course_nodes']=$nodes;
        }


        $this->success('获取成功',$mycourse,$pages);
    }



    /**
     * 取消课程
     * @ApiTitle    (我的课程-取消课程)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/user/cancle_course)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiParams  (name=course_id, type=string, required=true, description="课程id")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */

    public function cancle_course()
    {
        $userid = $this->auth->getUser()->id;
        $course_id =(int)$this->request->post("course_id");

        $res=db('course_audit')->where(['user_id'=>$userid,'course_id'=>$course_id])->delete();
        if($res){
            $this->success('取消成功');
        }else{
            $this->error('取消失败');
        }
    }


    /**
     * 获取用户信息
     * @ApiTitle    (获取用户信息)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/user/userinfo)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */

    public function userinfo()
    {
        $userid = $this->auth->getUser()->id;

        $userinfo=db('user')->where(['id'=>$userid])->field('nickname,address,avatar,mobile')->find();

        $mobile=$userinfo['mobile'];
        $userinfo['mobile']=substr($mobile,0,3)."****".substr($mobile,7,4);

        $this->success('获取成功',$userinfo);
    }





}
