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

    protected $noNeedLogin = ['login', 'mobilelogin', 'register', 'resetpwd', 'changeemail', 'changemobile', 'third'];
    protected $noNeedRight = '*';
    protected $pagesize=10;

    public function _initialize()
    {
        parent::_initialize();
    }




    /**
     * 手机验证码登录
     *
     * @param string $mobile 手机号
     * @param string $captcha 验证码
     */
    public function mobilelogin()
    {
        $mobile = $this->request->request('mobile');
        $captcha = $this->request->request('captcha');
        if (!$mobile || !$captcha)
        {
            $this->error(__('Invalid parameters'));
        }
        if (!Validate::regex($mobile, "^1\d{10}$"))
        {
            $this->error(__('Mobile is incorrect'));
        }
        if (!Sms::check($mobile, $captcha, 'mobilelogin'))
        {
            $this->error(__('Captcha is incorrect'));
        }
        $user = \app\common\model\User::getByMobile($mobile);
        if ($user)
        {
            //如果已经有账号则直接登录
            $ret = $this->auth->direct($user->id);
        }
        else
        {
            $ret = $this->auth->register($mobile, Random::alnum(), '', $mobile, []);
        }
        if ($ret)
        {
            Sms::flush($mobile, 'mobilelogin');
            $data = ['userinfo' => $this->auth->getUserinfo()];
            $this->success(__('Logged in successful'), $data);
        }
        else
        {
            $this->error($this->auth->getError());
        }
    }




    /**
     * 修改会员个人信息
     *
     * @param string $avatar 头像地址
     * @param string $username 用户名
     * @param string $nickname 昵称
     * @param string $bio 个人简介
     */
    public function profile()
    {
        $user = $this->auth->getUser();
        $username = $this->request->request('username');
        $nickname = $this->request->request('nickname');
        $bio = $this->request->request('bio');
        $avatar = $this->request->request('avatar');
        $exists = \app\common\model\User::where('username', $username)->where('id', '<>', $this->auth->id)->find();
        if ($exists)
        {
            $this->error(__('Username already exists'));
        }
        $user->username = $username;
        $user->nickname = $nickname;
        $user->bio = $bio;
        $user->avatar = $avatar;
        $user->save();
        $this->success();
    }


    /**
     * 修改手机号
     *
     * @param string $email 手机号
     * @param string $captcha 验证码
     */
    public function changemobile()
    {
        $user = $this->auth->getUser();
        $mobile = $this->request->request('mobile');
        $captcha = $this->request->request('captcha');
        if (!$mobile || !$captcha)
        {
            $this->error(__('Invalid parameters'));
        }
        if (!Validate::regex($mobile, "^1\d{10}$"))
        {
            $this->error(__('Mobile is incorrect'));
        }
        if (\app\common\model\User::where('mobile', $mobile)->where('id', '<>', $user->id)->find())
        {
            $this->error(__('Mobile already exists'));
        }
        $result = Sms::check($mobile, $captcha, 'changemobile');
        if (!$result)
        {
            $this->error(__('Captcha is incorrect'));
        }
        $verification = $user->verification;
        $verification->mobile = 1;
        $user->verification = $verification;
        $user->mobile = $mobile;
        $user->save();

        Sms::flush($mobile, 'changemobile');
        $this->success();
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





}
