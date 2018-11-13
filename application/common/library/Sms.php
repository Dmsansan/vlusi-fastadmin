<?php

namespace app\common\library;

use think\Hook;

/**
 * 短信验证码类
 */
class Sms
{

    /**
     * 验证码有效时长
     * @var int
     */
    protected static $expire = 120;

    /**
     * 最大允许检测的次数
     * @var int
     */
    protected static $maxCheckNums = 10;

    /**
     * 获取最后一次手机发送的数据
     *
     * @param   int       $mobile   手机号
     * @param   string    $event    事件
     * @return  Sms
     */
    public static function get($mobile, $event = 'default')
    {
        $sms = \app\common\model\Sms::
        where(['mobile' => $mobile, 'event' => $event])
            ->order('id', 'DESC')
            ->find();
        Hook::listen('sms_get', $sms, null, true);
        return $sms ? $sms : NULL;
    }

    /**
     *
     * @ApiTitle    (发送验证码)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/user/profile)
     * @ApiParams  (name=token, type=string, required=true, description="请求的Token")
     * @ApiParams   (name="mobile", type="integer", required=true, description="手机号")
     * @ApiParams   (name="event", type="string", required=false, description="验证码,为空时将自动生成4位数字")
     * @ApiParams   (name="code", type="string", required=false, description="事件")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */
    public static function send($mobile, $code = NULL, $event = 'default')
    {
        $code = is_null($code) ? mt_rand(1000, 9999) : $code;
        $time = time();
        $ip = request()->ip();
        $sms = \app\common\model\Sms::create(['event' => $event, 'mobile' => $mobile, 'code' => $code, 'ip' => $ip, 'createtime' => $time]);
        $post_data = array();
        $post_data['account'] = "Thxy2018_Lyltz";
        $post_data['pswd'] = "Lyltz2018@";
        $post_data['mobile'] =$mobile;
        $post_data['msg']= '验证码为'.$code;
        $post_data['needstatus'] ="true";
        $url='http://114.55.25.138/msg/HttpBatchSendSM';
        $o="";
        foreach ($post_data as $k=>$v)
        {
            $o.= "$k=".urlencode($v)."&";
        }
        $post_data=substr($o,0,-1);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_exec($ch);
        curl_close($ch);
//        $result = Hook::listen('sms_send', $sms, null, true);
//        if (!$result)
//        {
//            $sms->delete();
//            return FALSE;
//        }
        return TRUE;
    }

    /**
     * 发送通知
     *
     * @param   mixed     $mobile   手机号,多个以,分隔
     * @param   string    $msg      消息内容
     * @param   string    $template 消息模板
     * @return  boolean
     */
    public static function notice($mobile, $msg = '', $template = NULL)
    {
        $params = [
            'mobile'   => $mobile,
            'msg'      => $msg,
            'template' => $template
        ];
        $result = Hook::listen('sms_notice', $params, null, true);
        return $result ? TRUE : FALSE;
    }

    /**
     * 校验验证码
     *
     * @param   int       $mobile     手机号
     * @param   int       $code       验证码
     * @param   string    $event      事件
     * @return  boolean
     */
    public static function check($mobile, $code, $event = 'default')
    {
        $time = time() - self::$expire;
        $sms = \app\common\model\Sms::where(['mobile' => $mobile, 'event' => $event])
            ->order('id', 'DESC')
            ->find();
        if ($sms)
        {
            if ($sms['createtime'] > $time && $sms['times'] <= self::$maxCheckNums)
            {
                $correct = $code == $sms->code;

                if (!$correct)
                {
                    $sms->times = $sms->times + 1;
                    $sms->save();
                    return FALSE;
                }
                else
                {
//                    $result = Hook::listen('sms_check', $sms, null, true);

                    return true;
                }
            } else {
                // 过期则清空该手机验证码
                self::flush($mobile, $event);
                return FALSE;
            }
        }
        else
        {
            return FALSE;
        }
    }

    /**
     * 清空指定手机号验证码
     *
     * @param   int       $mobile     手机号
     * @param   string    $event      事件
     * @return  boolean
     */
    public static function flush($mobile, $event = 'default')
    {
        \app\common\model\Sms::where(['mobile' => $mobile, 'event' => $event])
            ->delete();
        Hook::listen('sms_flush');
        return TRUE;
    }

}
