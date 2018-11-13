<?php

namespace app\index\controller;

use app\common\controller\Frontend;
use app\common\library\Token;

class Index extends Frontend
{

    protected $noNeedLogin = [];
    protected $noNeedRight = ['*'];
    protected $layout = '';

    public function _initialize()
    {
        parent::_initialize();
    }

    public function index()
    {

        $userinfo=$this->auth->getUser();

        if($userinfo->jointime==time()){
            $this->redirect('index/user/bind_phone');
        }
        $token=$this->auth->getToken();
        $this->assign('token',$token);
        return $this->view->fetch();
    }


    public function detail()
    {

        return $this->view->fetch();
    }


    //评论详情
    public function comments()
    {
        return $this->view->fetch();
    }


    //课程详情
    public function course_detail(){
        return $this->view->fetch();
    }

}
