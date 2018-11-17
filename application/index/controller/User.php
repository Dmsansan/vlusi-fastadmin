<?php

namespace app\index\controller;

use app\common\controller\Frontend;
use think\Config;
use think\Cookie;
use think\Hook;
use think\Session;
use think\Validate;

/**
 * 会员中心
 */
class User extends Frontend
{

//    protected $layout = 'default';
    protected $noNeedLogin = ['login', 'register', 'third'];
    protected $noNeedRight = '*';

//    protected $userid;

    public function _initialize()
    {
        parent::_initialize();
//        $this->userid = $this->auth;
    }


    /**
     * 会员中心
     */
    public function index()
    {

        return $this->view->fetch();
    }


    /**
     * 个人信息
     */
    public function my_collection()
    {
        return $this->view->fetch();
    }

    public function third()
    {
        $this->redirect('third/connect/wechat','platform');
    }

    public function my_course()
    {
        return $this->view->fetch();
    }

    public function setting()
    {
        return $this->view->fetch();
    }

    public function set_name()
    {
        return $this->view->fetch();
    }

    public function set_phone()
    {
        return $this->view->fetch();
    }

    public function bind_phone()
    {
        $token=$this->auth->getToken();
        $this->assign('token',$token);
        return $this->view->fetch();
    }

    public function set_data()
    {
        $token=$this->auth->getToken();
        $this->assign('token',$token);
        return $this->view->fetch();
    }

    public function share_page()
        {
            return $this->view->fetch();
        }

}
