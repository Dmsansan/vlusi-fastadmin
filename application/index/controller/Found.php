<?php

namespace app\index\controller;

use app\common\controller\Frontend;
use app\common\library\Token;

class Found extends Frontend
{

    protected $noNeedLogin = '*';
    protected $noNeedRight = '*';
    protected $layout = '';

    public function _initialize()
    {
        parent::_initialize();
    }

    public function index()
    {
        return $this->view->fetch();
    }




}
