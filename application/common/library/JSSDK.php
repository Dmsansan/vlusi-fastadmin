<?php
/**
 *
 * Created by PhpStorm.
 * User: wangerpangci
 * Date: 2018/11/16
 * Time: 11:27
 * Email: 18037235202@163.com
 */

namespace app\common\library;

use think\Cache;

class JSSDK
{
    private $appId;
    private $appSecret;

    public function __construct($appId, $appSecret)
    {
        $this->appId = $appId;
        $this->appSecret = $appSecret;
    }

    public function getSignPackage($url)
    {
        $jsapiTicket = $this->getJsApiTicket();
        //$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        $timestamp = time();
        $nonceStr = $this->createNonceStr();

        // 这里参数的顺序要按照 key 值 ASCII 码升序排序
        $string = "jsapi_ticket=".$jsapiTicket."&noncestr=".$nonceStr."&timestamp=".$timestamp."&url=".$url;
        $signature = sha1($string);
        $signPackage = array(
            "appId" => $this->appId,
            "nonceStr" => $nonceStr,
            "timestamp" => $timestamp,
            "url" => $url,
            "signature" => $signature,
            "rawString" => $string
        );
        return $signPackage;
    }

    private function createNonceStr($length = 16)
    {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }

    private function getJsApiTicket()
    {

        // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
//        $data = json_decode(file_get_contents("jsapi_ticket.json",true),true);
        $data= Cache::get('jsapi_ticket');
        if (!isset($data['jsapi_ticket']) || !$data) {
            $accessToken = $this->getAccessToken();
            $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
            $res = json_decode($this->httpGet($url));
            $ticket = $res->ticket;
            if ($ticket) {
//                $data = array();
//                $data['expires'] = time() + 7000;
//                $data['jsapi_ticket']= $ticket;
//                $fp = fopen("jsapi_ticket.json", "w");
//                fwrite($fp, json_encode($data));
//                fclose($fp);
                Cache::set('jsapi_ticket',$ticket,7000);
            }
        } else {
            $ticket = $data;
        }

        return $ticket;
    }

    private function getAccessToken()
    {
        // access_token 应该全局存储与更新，以下代码以写入到文件中做示例
//        $data = json_decode(file_get_contents("access_token.json",true),true);
        $data= Cache::get('jsapi_access_token');
        if (!isset($data['jsapi_access_token'])|| !$data){
            $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$this->appId&secret=$this->appSecret";
            $res = json_decode($this->httpGet($url));
            $access_token = $res->access_token;
            if ($access_token) {
                Cache::set('jsapi_access_token',$access_token,7000);
//                $data = array();
//                $data['access_token']= time() + 7000;
//                $data['expires']= $access_token;
//                $fp = fopen("access_token.json", "w");
//                fwrite($fp, json_encode($data));
//                fclose($fp);
                return $access_token;
            }
        } else {
            $access_token = $data;
        }
        return $access_token;
    }

    private function httpGet($url)
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_TIMEOUT, 500);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_URL, $url);
        $res = curl_exec($curl);
        curl_close($curl);
        return $res;
    }

}