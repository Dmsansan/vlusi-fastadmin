<?php

namespace app\index\controller;

use app\common\controller\Frontend;
use app\common\library\JSSDK;
use app\common\library\Token;

class Index extends Frontend
{

    protected $noNeedLogin = [];
    protected $noNeedRight = ['*'];
    protected $layout = '';

    public function _initialize()
    {
        parent::_initialize();
        $userinfo=$this->auth->getUser();
        if(!$userinfo){
            $this->redirect('user/login');
        }
    }

    public function index()
    {
//        $token=$this->request->get('token');
        $token=$this->auth->getToken();
        $this->assign('token',$token);

        return $this->view->fetch();
    }


    public function detail()
    {
        $userinfo=$this->auth->getUser();
        if(!$userinfo->mobile){
            $this->redirect('index/user/bind_phone');
        }

        $id  = (int)$this->request->request("id");

        $data=$this->getShareSigna($id);
        $info=db('course')->where(['id'=>$id])->field('*')->find();

        $sharedata['title']=$info['name'];
        $sharedata['desc']=mb_substr(strip_tags($info['content']),0,30).'...';
        $sharedata['img']='http://leyanglao.oss-cn-hangzhou.aliyuncs.com/'.$info['coverimage'];
        $sharedata['link']="http://".$_SERVER['HTTP_HOST'].'/index/index/course_detail?id='.$id;


        $this->assign('sharedata',$sharedata);
        $this->assign('signdata',$data);


        /**
         *   $data = [
        'appid' =>$appID,
        'timesTamp' => $signPackage["timestamp"],
        'nonceStr' => $signPackage["nonceStr"],
        'signaTure' => $signPackage["signature"]
        ];
         */

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


    public function getAccessToken()
    {

        $param['grant_type']='client_credential';
        $param['appid']='wx1fab8067cbc162c7';
        $param['secret']='d638ba9b21a7ca01277fa6a8e3f0fc9e';

//        $url="https://api.weixin.qq.com/cgi-bin/token?".http_build_query($param);
//        $access=file_get_contents($url);
//        dump($access);die;

    }


    function getShareSigna($course_id)
    {
//        $url  = $this->request->request("url");

        $url = "http://".$_SERVER['HTTP_HOST'].'/index/index/course_detail?id='.$course_id;


        $appID = 'wx1fab8067cbc162c7';
        $appSecret = 'd638ba9b21a7ca01277fa6a8e3f0fc9e';

        $jssdk = new JSSDK($appID, $appSecret);

        //确保你获取用来签名的url是动态获取的，动态页面可参见实例代码中php的实现方式。
        //如果是html的静态页面在前端通过ajax将url传到后台签名，前端需要用js获取当前页面除去'#'hash部分的链接
        //（可用location.href.split('#')[0]获取,而且需要encodeURIComponent），
        //因为页面一旦分享，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败。

        //后台接收到url 需要进行解析

        $signPackage = $jssdk->GetSignPackage($url);
        if (!isset($signPackage)) {return false;}
        $data = [
            'appid' =>$appID,
            'timesTamp' => $signPackage["timestamp"],
            'nonceStr' => $signPackage["nonceStr"],
            'signaTure' => $signPackage["signature"]
        ];
        return $data;
    }


}
