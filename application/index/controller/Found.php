<?php

namespace app\index\controller;

use app\common\controller\Frontend;
use app\common\library\Token;

class Found extends Frontend
{

    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];
    protected $layout = '';

    public function _initialize()
    {
        parent::_initialize();
//        $userinfo=$this->auth->getUser();
//        if(!$userinfo){
//            $this->redirect('user/login');
//        }

    }

    public function index()
    {
        $list=db('banner')->select();
        $this->assign('banner',$list);
        return $this->view->fetch();
    }



    public function detail()
    {

//        $userinfo=$this->auth->getUser();
//        if(!$userinfo->mobile){
//            $this->redirect('index/user/bind_phone');
//        }
        return $this->view->fetch();
    }


    //评论详情
    public function comments()
    {
        return $this->view->fetch();
    }

}
