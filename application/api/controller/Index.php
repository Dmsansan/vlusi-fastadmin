<?php

namespace app\api\controller;

use app\common\controller\Api;
use app\common\library\JSSDK;

/**
 * 微信分享
 */
class Index extends Api
{

    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];
//
//
//    public function index()
//    {
//        $url=urlencode('http://yl.qclike.cn/index/index/detail?id=44');
//        echo $url;die;
//        $this->success('请求成功');
//    }

    /**
     * 获取签名
     * @ApiTitle    (获取签名)
     * @ApiSummary  (测试描述信息)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/index/getShareSigna)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiParams  (name=url, type=string, required=true, description="encode编码后的url链接")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     */
    function getShareSigna()
    {

//        $url  = $this->request->request("url");
        $url='http%3A%2F%2Fyl.qclike.cn%2Findex%2Findex%2Fdetail%3Fid%3D44';
        if(!$url){$this->error('无效参数');}


        $appID = 'wx1fab8067cbc162c7';
        $appSecret = 'd638ba9b21a7ca01277fa6a8e3f0fc9e';

        $jssdk = new JSSDK($appID, $appSecret);

        //确保你获取用来签名的url是动态获取的，动态页面可参见实例代码中php的实现方式。
        //如果是html的静态页面在前端通过ajax将url传到后台签名，前端需要用js获取当前页面除去'#'hash部分的链接
        //（可用location.href.split('#')[0]获取,而且需要encodeURIComponent），
        //因为页面一旦分享，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败。

        //后台接收到url 需要进行解析

        $signPackage = $jssdk->GetSignPackage(urldecode($url));
        if (!isset($signPackage)) {$this->error('签名失败');}
        $data = [
            'appid' =>$appID,
            'timesTamp' => $signPackage["timestamp"],
            'nonceStr' => $signPackage["nonceStr"],
            'signaTure' => $signPackage["signature"]
        ];
        $this->success('请求成功',$data);

    }


    public function pregTest()
    {

//        $str=<<<EOF
//<p class="MsoNormal"><span style="mso-spacerun:'yes';font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:'Times New Roman';font-size:10.5000pt;mso-font-kerning:1.0000pt;"> <font face="宋体">高龄友善康健专题：日本用小学空教室照顾老人</font></span><span style="mso-spacerun:'yes';font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:'Times New Roman';font-size:10.5000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p>
//EOF;
//
//        $preg1='/>([\u4e00-\u9fa5]+)</';
//        $preg2='/^[\u4e00-\u9fa5，。]+)+/';

    }

}
