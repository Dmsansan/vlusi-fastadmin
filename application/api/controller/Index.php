<?php

namespace app\api\controller;

use app\common\controller\Api;

/**
 *
 */

class Index extends Api
{

    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    /**
     * 首页
     * 
     */
    public function index()
    {
        $this->success('请求成功');
    }

    public function testWords()
    {

        $str=  $this->request->request("str");

        $res=$this->wordCheck($str);
        dump($res);

    }

}
