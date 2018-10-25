<?php

namespace addons\third\controller;

use addons\third\library\Application;
use addons\third\library\Service;
use think\addons\Controller;
use think\Cookie;
use think\Hook;

/**
 * 第三方登录插件
 */
class Index extends Controller
{

    protected $app = null;
    protected $options = [];

    public function _initialize()
    {
        parent::_initialize();
        $config = get_addon_config('third');
        if (!$config) {
            $this->error(__('Invalid parameters'));
        }
        $options = array_intersect_key($config, array_flip(['qq', 'weibo', 'wechat']));
        foreach ($options as $k => &$v) {
            $v['callback'] = addon_url('third/index/callback', [':platform' => $k], false, true);
            $options[$k] = $v;
        }
        unset($v);
        $this->app = new Application($options);
    }

    /**
     * 插件首页
     */
    public function index()
    {
        return $this->view->fetch();
    }

    /**
     * 发起授权
     */
    public function connect()
    {
        $platform = $this->request->param('platform');
        if (!$this->app->{$platform}) {
            $this->error(__('Invalid parameters'));
        }
        // 跳转到登录授权页面
        $this->redirect($this->app->{$platform}->getAuthorizeUrl());
        return;
    }

    /**
     * 通知回调
     */
    public function callback()
    {
        $auth = $this->auth;

        //监听注册登录注销的事件
        Hook::add('user_login_successed', function ($user) use ($auth) {
            $expire = input('post.keeplogin') ? 30 * 86400 : 0;
            Cookie::set('uid', $user->id, $expire);
            Cookie::set('token', $auth->getToken(), $expire);
        });
        Hook::add('user_register_successed', function ($user) use ($auth) {
            Cookie::set('uid', $user->id);
            Cookie::set('token', $auth->getToken());
        });
        Hook::add('user_logout_successed', function ($user) use ($auth) {
            Cookie::delete('uid');
            Cookie::delete('token');
        });
        $platform = $this->request->param('platform');

        // 成功后返回会员中心
        $url = url('index/user/index');

        // 授权成功后的回调
        $result = $this->app->{$platform}->getUserInfo();
        if ($result) {
            $loginret = Service::connect($platform, $result);
            if ($loginret) {
                $synchtml = '';
                ////////////////同步到Ucenter////////////////
                if (defined('UC_STATUS') && UC_STATUS) {
                    $uc = new \addons\ucenter\library\client\Client();
                    $synchtml = $uc->uc_user_synlogin($this->auth->id);
                }
                $this->success(__('Logged in successful') . $synchtml, $url);
            }
        }
        $this->error(__('Operation failed'), $url);
    }

}
