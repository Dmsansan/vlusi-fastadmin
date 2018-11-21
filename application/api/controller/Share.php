<?php

namespace app\api\controller;

use app\common\controller\Api;
use think\Db;

/**
 * 分享
 */
class Share extends Api
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    /**
     * 获取分享图片
     *
     * @ApiTitle    (获取分享图片接口)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/share/getimage)
     * @ApiParams   (name="article_id", type="integer", required=true, description="文章id")
     * @ApiParams   (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */
    public function getimage()
    {
        $article_id =   (int)$this->request->request("article_id");
$article_id = 107;
        if (!$article_id)
        {
            $this->error(__('文章id为空'));
        }
        $detail =db('article')->where(['id'=>$article_id])->find();
		if(!$detail){
			$this->error(__('文章不存在'));
		}
        $detail_user =db('admin')->where(['id'=>$detail['admin_id']])->find();
        if(!$detail_user){
			$this->error(__('作者不存在'));
		}
        $detail['nickname'] = $detail_user['nickname'];
        $detail['signtext'] = $detail_user['signtext'];
        $detail['avatar'] = $detail_user['avatar'];
        $folderName = date('Y',time()).date('m',time()).date('d',time());
        if(!is_dir("uploads/".$folderName)){
            mkdir("uploads/".$folderName);
        }
        
        //生成二维码
        vendor ('phpqrcode.phpqrcode');

        $QRcode = new \QRcode();
        $value = "http://".$_SERVER['HTTP_HOST'].'/index/found/detail?id='.$article_id;

        //二维码内容
        $errorCorrectionLevel = 'L';  //容错级别
        $matrixPointSize = 5;      //生成图片大小
        //生成二维码图片
        $filename = 'uploads/'.$folderName.'/'.time().'11'.rand('100000','999999').".jpg";
        $QRcode->png($value,$filename , $errorCorrectionLevel, $matrixPointSize, 2);

     //   $logo = 'img/code_png/code.jpg'; //准备好的logo图片
        $QR = $filename;      //已经生成的原始二维码图
//        if (file_exists($logo)) {
//            $QR = imagecreatefromstring(file_get_contents($QR));    //目标图象连接资源。
//            $logo = imagecreatefromstring(file_get_contents($logo));  //源图象连接资源。
//            $QR_width = imagesx($QR);      //二维码图片宽度
//            $QR_height = imagesy($QR);     //二维码图片高度
//            $logo_width = imagesx($logo);    //logo图片宽度
//            $logo_height = imagesy($logo);   //logo图片高度
//            $logo_qr_width = $QR_width / 6;   //组合之后logo的宽度(占二维码的1/5)
//            $scale = $logo_width/$logo_qr_width;  //logo的宽度缩放比(本身宽度/组合后的宽度)
//            $logo_qr_height = $logo_height/$scale; //组合之后logo的高度
//            $from_width = ($QR_width - $logo_qr_width) / 2;  //组合之后logo左上角所在坐标点
//    //重新组合图片并调整大小
//    /*
//     * imagecopyresampled() 将一幅图像(源图象)中的一块正方形区域拷贝到另一个图像中
//     */
//        imagecopyresampled($QR, $logo, $from_width, $from_width, 0, 0, $logo_qr_width,$logo_qr_height, $logo_width, $logo_height);
//        }
        $QR = imagecreatefromstring(file_get_contents($QR));
    

        imagepng($QR, $filename);
  
        $detail['QRcode'] = $filename;

        //输出到图片
        $imageName = time().'22'.rand('100000','999999').".jpg";
        $this->createSharePng($detail,'','uploads/'.$folderName.'/'.$imageName);
        $data = array(
            'url' => "/uploads/".$folderName.'/'.$imageName,
        );
        $this->success("返回成功",$data);
    }
    /**

 * 分享图片生成

 * @param $gData  商品数据，array

 * @param $codeName 二维码图片

 * @param $fileName string 保存文件名,默认空则直接输入图片

 */

function createSharePng($gData,$codeName,$fileName = ''){

    //创建画布

    $im = imagecreatetruecolor(750, 1334);

    $url = "http://".$_SERVER['HTTP_HOST'];
    
    $urls = 'http://leyanglao.oss-cn-hangzhou.aliyuncs.com/';

    //填充画布背景色

    $color = imagecolorallocate($im, 255, 255, 255);

    imagefill($im, 0, 0, $color);

 

    //字体文件

    $font_file = "img/code_png/MSYH.ttf";

    $font_file_bold = "/img/code_png/MSYH.ttf";
    //设定字体的颜色

    $font_color_1 = ImageColorAllocate ($im, 140, 140, 140);

    $font_color_2 = ImageColorAllocate ($im, 131,131,131);

    $fang_bg_color = ImageColorAllocate ($im, 246,246,249);

 

    //封面图
    preg_match("/^yanglao\/.*?\.[1-9a-zA-Z]+/",$gData['coverimage'],$imgs);
    if($imgs){
        $gData['coverimage'] = $urls.$gData['coverimage'];
    }

    list($c_w,$c_h) = getimagesize($gData['coverimage']);
    $coverimageImg = $this->createImageFromFile($gData['coverimage']);

    imagecopyresized($im, $coverimageImg, 0, 0, 0, 0, 750, 376, $c_w, $c_h);

 

    //标题
	$a = array(
		'top'=>420,
		'fontsize'=>26,
		'width'=>680,
		'left'=>40,
		'hang_size'=>40,
		'color'=>array(0,0,0)
	);
	$b = array(
		'maxline'=>'',
		'width'=>680,
		'left'=>40,
	);
	$this->textalign($im,$a,$gData['title'],true,$font_file,0,$b);  

	//背景图
	imagefilledrectangle ($im, 10 , 570 , 740 , 790 , $fang_bg_color);
	//简介
	$c = array(
		'top'=>580,
		'fontsize'=>22,
		'width'=>640,
		'left'=>50,
		'hang_size'=>40,
		'color'=>array(131,131,131)
	);
	$d = array(
		'maxline'=>2,
		'width'=>640,
		'left'=>50,
	);
	$this->textalign($im,$c,strip_tags($gData['content']),true,$font_file,0,$d);
	
    //头像

    list($a_w,$a_h) = getimagesize($urls.$gData['avatar']);

    $avatarImg = $this->createImageFromFile($urls.$gData['avatar']);
	
    imagecopyresized($im, $avatarImg, 56, 686, 0, 0, 80, 80, $a_w, $a_h);
	//作者
	imagettftext($im, 22,0, 150, 725, $font_color_2 ,$font_file, $gData['nickname']);
	imagettftext($im, 22,0, 150, 760, $font_color_2 ,$font_file, '乐养老官方账号');
	
	//广告

//    list($g_w,$g_h) = getimagesize($url."/img/code_png/gg.jpg");
//
//    $ggImg = @imagecreatefrompng($url."/img/code_png/gg.jpg");
//	
//    imagecopyresized($im, $ggImg, 0, 443, 0, 0, 380, 60, $g_w, $g_h);
        //广告1
//	$fontSize  = 22; 
//        $fontWidth = ImageTTFBBox($fontSize,0,$font_file,$gData['ad1']);
//        $textWidth = $fontWidth[2] - $fontWidth[0];
//        $x         = ceil((750 - $textWidth) / 2); //计算文字的水平位置
//
//        imagettftext($im, $fontSize, 0, $x, 840, $font_color_2, $font_file, $gData['ad1']);
        $ad1 = array(
		'top'=>840,
		'fontsize'=>22,
		'width'=>640,
		'left'=>50,
		'hang_size'=>40,
		'color'=>array(131,131,131)
	);
	$ads1 = array(
		'maxline'=>4,
		'width'=>640,
		'left'=>50,
	);
	$this->textalign($im,$ad1,strip_tags($gData['ad1']),true,$font_file,0,$ads1);
//        
//        //广告2
//	$fontSize  = 22; 
//        $fontWidth = ImageTTFBBox($fontSize,0,$font_file,$gData['ad2']);
//        $textWidth = $fontWidth[2] - $fontWidth[0];
//        $x         = ceil((750 - $textWidth) / 2); //计算文字的水平位置
//
//        imagettftext($im, $fontSize, 0, $x, 900, $font_color_2, $font_file, $gData['ad2']);
        $ad2 = array(
		'top'=>900,
		'fontsize'=>22,
		'width'=>640,
		'left'=>50,
		'hang_size'=>40,
		'color'=>array(131,131,131)
	);
	$ads2 = array(
		'maxline'=>4,
		'width'=>640,
		'left'=>50,
	);
	$this->textalign($im,$ad2,strip_tags($gData['ad2']),true,$font_file,0,$ads2);
//        //广告3
//	$fontSize  = 22; 
//        $fontWidth = ImageTTFBBox($fontSize,0,$font_file,$gData['ad3']);
//        $textWidth = $fontWidth[2] - $fontWidth[0];
//        $x         = ceil((750 - $textWidth) / 2); //计算文字的水平位置
//
//        imagettftext($im, $fontSize, 0, $x, 960, $font_color_2, $font_file, $gData['ad3']);
        $ad3 = array(
		'top'=>960,
		'fontsize'=>22,
		'width'=>640,
		'left'=>50,
		'hang_size'=>40,
		'color'=>array(131,131,131)
	);
	$ads3 = array(
		'maxline'=>4,
		'width'=>640,
		'left'=>50,
	);
	$this->textalign($im,$ad3,strip_tags($gData['ad3']),true,$font_file,0,$ads3);

    //二维码

    list($code_w,$code_h) = getimagesize($url."/".$gData['QRcode']);
    
    $codeImg = @imagecreatefrompng($url."/".$gData['QRcode']);

    imagecopyresized($im, $codeImg, 200, 1006, 0, 0, 140, 140, $code_w, $code_h);
	//logo

    list($l_w,$l_h) = getimagesize($url."/img/code_png/logo-new.png");

    $logoImg = $this->createImageFromFile($url."/img/code_png/logo-new.png");

    imagecopyresized($im, $logoImg, 420, 1006, 0, 0, 140, 140, $l_w, $l_h);
 
    //输出图片

    if($fileName){

        imagepng ($im,$fileName);

    }else{

        Header("Content-Type: image/png");

        imagepng ($im);

    }



    //释放空间

    imagedestroy($im);

    imagedestroy($coverimageImg);

    imagedestroy($avatarImg);
    
            
    imagedestroy($codeImg);
    
    imagedestroy($logoImg);

}

 /**
     * 获取课时分享图片
     *
     * @ApiTitle    (获取分享图片接口)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/share/getcourseimage)
     * @ApiParams   (name="course_id", type="integer", required=true, description="课时id")
     * @ApiParams   (name=token, type=string, required=true, description="请求的Token")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     */
    public function getcourseimage()
    {
        $course_id =   (int)$this->request->request("course_id");
$course_id = 46;
        if (!$course_id)
        {
            $this->error(__('课时id为空'));
        }
        $detail =db('course')->where(['id'=>$course_id])->find();
		if(!$detail){
			$this->error(__('课时不存在'));
		}
        $detail_user =db('admin')->where(['id'=>$detail['admin_id']])->find();
        if(!$detail_user){
			$this->error(__('作者不存在'));
		}
        $detail['nickname'] = $detail_user['nickname'];
        $detail['signtext'] = $detail_user['signtext'];
        $detail['avatar'] = $detail_user['avatar'];
        $folderName = date('Y',time()).date('m',time()).date('d',time());
        if(!is_dir("uploads/".$folderName)){
            mkdir("uploads/".$folderName);
        }
        
        //生成二维码
        vendor ('phpqrcode.phpqrcode');

        $QRcode = new \QRcode();
        $value = "http://".$_SERVER['HTTP_HOST'].'/index/index/detail?id='.$course_id;

        //二维码内容
        $errorCorrectionLevel = 'L';  //容错级别
        $matrixPointSize = 5;      //生成图片大小
        //生成二维码图片
        $filename = 'uploads/'.$folderName.'/'.time().'22'.rand('100000','999999').".jpg";
        $QRcode->png($value,$filename , $errorCorrectionLevel, $matrixPointSize, 2);

//        $logo = 'img/code_png/code.jpg'; //准备好的logo图片
        $QR = $filename;      //已经生成的原始二维码图
//        if (file_exists($logo)) {
//            $QR = imagecreatefromstring(file_get_contents($QR));    //目标图象连接资源。
//            $logo = imagecreatefromstring(file_get_contents($logo));  //源图象连接资源。
//            $QR_width = imagesx($QR);      //二维码图片宽度
//            $QR_height = imagesy($QR);     //二维码图片高度
//            $logo_width = imagesx($logo);    //logo图片宽度
//            $logo_height = imagesy($logo);   //logo图片高度
//            $logo_qr_width = $QR_width / 6;   //组合之后logo的宽度(占二维码的1/5)
//            $scale = $logo_width/$logo_qr_width;  //logo的宽度缩放比(本身宽度/组合后的宽度)
//            $logo_qr_height = $logo_height/$scale; //组合之后logo的高度
//            $from_width = ($QR_width - $logo_qr_width) / 2;  //组合之后logo左上角所在坐标点
//    //重新组合图片并调整大小
//    /*
//     * imagecopyresampled() 将一幅图像(源图象)中的一块正方形区域拷贝到另一个图像中
//     */
//        imagecopyresampled($QR, $logo, $from_width, $from_width, 0, 0, $logo_qr_width,$logo_qr_height, $logo_width, $logo_height);
//    }
    $QR = imagecreatefromstring(file_get_contents($QR));

        imagepng($QR, $filename);
  
        $detail['QRcode'] = $filename;

        //输出到图片
        $imageName = time().'22'.rand('100000','999999').".jpg";
        $this->createcourseSharePng($detail,'','uploads/'.$folderName.'/'.$imageName);
        $data = array(
            'url' => "/uploads/".$folderName.'/'.$imageName,
        );
        $this->success("返回成功",$data);
    }
    /**

 * 分享课时图片生成

 * @param $gData  商品数据，array

 * @param $codeName 二维码图片

 * @param $fileName string 保存文件名,默认空则直接输入图片

 */

function createcourseSharePng($gData,$codeName,$fileName = ''){

    //创建画布

    $im = imagecreatetruecolor(750, 1334);

    $url = "http://".$_SERVER['HTTP_HOST'];
    
    $urls = 'http://leyanglao.oss-cn-hangzhou.aliyuncs.com/';

    //填充画布背景色

    $color = imagecolorallocate($im, 255, 255, 255);

    imagefill($im, 0, 0, $color);

 

    //字体文件

    $font_file = "img/code_png/MSYH.ttf";

    $font_file_bold = "/img/code_png/MSYH.ttf";
    //设定字体的颜色

    $font_color_1 = ImageColorAllocate ($im, 140, 140, 140);

    $font_color_2 = ImageColorAllocate ($im, 131,131,131);

    $fang_bg_color = ImageColorAllocate ($im, 246,246,249);

 

    //封面图
    list($c_w,$c_h) = getimagesize($urls.$gData['coverimage']);
    $coverimageImg = $this->createImageFromFile($urls.$gData['coverimage']);
    imagecopyresized($im, $coverimageImg, 0, 0, 0, 0, 750, 376, $c_w, $c_h);

 

    //标题
	$a = array(
		'top'=>420,
		'fontsize'=>26,
		'width'=>680,
		'left'=>40,
		'hang_size'=>40,
		'color'=>array(0,0,0)
	);
	$b = array(
		'maxline'=>'',
		'width'=>680,
		'left'=>40,
	);
	$this->textalign($im,$a,$gData['name'],true,$font_file,0,$b);  

	//背景图
	imagefilledrectangle ($im, 10 , 570 , 740 , 790 , $fang_bg_color);
	//简介
	$c = array(
		'top'=>580,
		'fontsize'=>22,
		'width'=>640,
		'left'=>50,
		'hang_size'=>40,
		'color'=>array(131,131,131)
	);
	$d = array(
		'maxline'=>2,
		'width'=>640,
		'left'=>50,
	);
	$this->textalign($im,$c,strip_tags($gData['content']),true,$font_file,0,$d);
	
    //头像

    list($a_w,$a_h) = getimagesize($urls.$gData['avatar']);

    $avatarImg = $this->createImageFromFile($urls.$gData['avatar']);
	
    imagecopyresized($im, $avatarImg, 56, 686, 0, 0, 80, 80, $a_w, $a_h);
	//作者
	imagettftext($im, 22,0, 150, 725, $font_color_2 ,$font_file, $gData['nickname']);
	imagettftext($im, 22,0, 150, 760, $font_color_2 ,$font_file, '乐养老官方账号');
	
	//广告

//    list($g_w,$g_h) = getimagesize($url."/img/code_png/gg.jpg");
//
//    $ggImg = @imagecreatefrompng($url."/img/code_png/gg.jpg");
//	
//    imagecopyresized($im, $ggImg, 0, 443, 0, 0, 380, 60, $g_w, $g_h);
         //广告1
//	$fontSize  = 22; 
//        $fontWidth = ImageTTFBBox($fontSize,0,$font_file,$gData['ad1']);
//        $textWidth = $fontWidth[2] - $fontWidth[0];
//        $x         = ceil((750 - $textWidth) / 2); //计算文字的水平位置
//
//        imagettftext($im, $fontSize, 0, $x, 840, $font_color_2, $font_file, $gData['ad1']);
        $ad1 = array(
		'top'=>840,
		'fontsize'=>22,
		'width'=>640,
		'left'=>50,
		'hang_size'=>40,
		'color'=>array(131,131,131)
	);
	$ads1 = array(
		'maxline'=>4,
		'width'=>640,
		'left'=>50,
	);
	$this->textalign($im,$ad1,strip_tags($gData['ad1']),true,$font_file,0,$ads1);
//        
//        //广告2
//	$fontSize  = 22; 
//        $fontWidth = ImageTTFBBox($fontSize,0,$font_file,$gData['ad2']);
//        $textWidth = $fontWidth[2] - $fontWidth[0];
//        $x         = ceil((750 - $textWidth) / 2); //计算文字的水平位置
//
//        imagettftext($im, $fontSize, 0, $x, 900, $font_color_2, $font_file, $gData['ad2']);
        $ad2 = array(
		'top'=>900,
		'fontsize'=>22,
		'width'=>640,
		'left'=>50,
		'hang_size'=>40,
		'color'=>array(131,131,131)
	);
	$ads2 = array(
		'maxline'=>4,
		'width'=>640,
		'left'=>50,
	);
	$this->textalign($im,$ad2,strip_tags($gData['ad2']),true,$font_file,0,$ads2);
//        //广告3
//	$fontSize  = 22; 
//        $fontWidth = ImageTTFBBox($fontSize,0,$font_file,$gData['ad3']);
//        $textWidth = $fontWidth[2] - $fontWidth[0];
//        $x         = ceil((750 - $textWidth) / 2); //计算文字的水平位置
//
//        imagettftext($im, $fontSize, 0, $x, 960, $font_color_2, $font_file, $gData['ad3']);
        $ad3 = array(
		'top'=>960,
		'fontsize'=>22,
		'width'=>640,
		'left'=>50,
		'hang_size'=>40,
		'color'=>array(131,131,131)
	);
	$ads3 = array(
		'maxline'=>4,
		'width'=>640,
		'left'=>50,
	);
	$this->textalign($im,$ad3,strip_tags($gData['ad3']),true,$font_file,0,$ads3);

    //二维码

    list($code_w,$code_h) = getimagesize($url."/".$gData['QRcode']);
    
    $codeImg = @imagecreatefrompng($url."/".$gData['QRcode']);

    imagecopyresized($im, $codeImg, 200, 1006, 0, 0, 140, 140, $code_w, $code_h);
	//logo

    list($l_w,$l_h) = getimagesize($url."/img/code_png/logo-new.png");

    $logoImg = $this->createImageFromFile($url."/img/code_png/logo-new.png");

    imagecopyresized($im, $logoImg, 420, 1006, 0, 0, 140, 140, $l_w, $l_h);
 
    //输出图片

    if($fileName){

        imagepng ($im,$fileName);

    }else{

        Header("Content-Type: image/png");

        imagepng ($im);

    }



    //释放空间

    imagedestroy($im);

    imagedestroy($coverimageImg);

    imagedestroy($avatarImg);
            
    imagedestroy($codeImg);
    
    imagedestroy($logoImg);

}

/**

 * 从图片文件创建Image资源

 * @param $file 图片文件，支持url

 * @return bool|resource    成功返回图片image资源，失败返回false

 */

function createImageFromFile($file){

    if(preg_match('/http(s)?:\/\//',$file)){

        $fileSuffix = $this->getNetworkImgType($file);

    }else{

        $fileSuffix = pathinfo($file, PATHINFO_EXTENSION);

    }

 

    $ename=getimagesize($file); 
  $ename=explode('/',$ename['mime']); 
  $ext=$ename[1]; 
  switch($ext){ 
   case "png": 
    
    $image=imagecreatefrompng($file); 
    break; 
   case "jpeg": 
    
    $image=imagecreatefromjpeg($file); 
    break; 
   case "jpg": 
    
    $image=imagecreatefromjpeg($file); 
    break; 
   case "gif": 
    
    $image=imagecreatefromgif($file); 
    break; 
  } 

 

    return $image;

}

 

/**

 * 获取网络图片类型

 * @param $url  网络图片url,支持不带后缀名url

 * @return bool

 */

function getNetworkImgType($url){

    $ch = curl_init(); //初始化curl

    curl_setopt($ch, CURLOPT_URL, $url); //设置需要获取的URL

    curl_setopt($ch, CURLOPT_NOBODY, 1);

    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);//设置超时

    curl_setopt($ch, CURLOPT_TIMEOUT, 3);

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //支持https

    curl_exec($ch);//执行curl会话

    $http_code = curl_getinfo($ch);//获取curl连接资源句柄信息

    curl_close($ch);//关闭资源连接

 

    if ($http_code['http_code'] == 200) {

        $theImgType = explode('/',$http_code['content_type']);

 

        if($theImgType[0] == 'image'){

            return $theImgType[1];

        }else{

            return false;

        }

    }else{

        return false;

    }

}

 

/**

 * 分行连续截取字符串

 * @param $str  需要截取的字符串,UTF-8

 * @param int $row  截取的行数

 * @param int $number   每行截取的字数，中文长度

 * @param bool $suffix  最后行是否添加‘...’后缀

 * @return array    返回数组共$row个元素，下标1到$row

 */

function cn_row_substr($str,$row = 1,$number = 10,$suffix = true){

    $result = array();

    for ($r=1;$r<=$row;$r++){

        $result[$r] = '';

    }

 

    $str = trim($str);

    if(!$str) return $result;

 

    $theStrlen = strlen($str);

 

    //每行实际字节长度

    $oneRowNum = $number * 3;

    for($r=1;$r<=$row;$r++){

        if($r == $row and $theStrlen > $r * $oneRowNum and $suffix){

            $result[$r] = mg_cn_substr($str,$oneRowNum-6,($r-1)* $oneRowNum).'...';

        }else{

            $result[$r] = mg_cn_substr($str,$oneRowNum,($r-1)* $oneRowNum);

        }

        if($theStrlen < $r * $oneRowNum) break;

    }

 

    return $result;

}

 

/**

 * 按字节截取utf-8字符串

 * 识别汉字全角符号，全角中文3个字节，半角英文1个字节

 * @param $str  需要切取的字符串

 * @param $len  截取长度[字节]

 * @param int $start    截取开始位置，默认0

 * @return string

 */

function mg_cn_substr($str,$len,$start = 0){

    $q_str = '';

    $q_strlen = ($start + $len)>strlen($str) ? strlen($str) : ($start + $len);

 

    //如果start不为起始位置，若起始位置为乱码就按照UTF-8编码获取新start

    if($start and json_encode(substr($str,$start,1)) === false){

        for($a=0;$a<3;$a++){

            $new_start = $start + $a;

            $m_str = substr($str,$new_start,3);

            if(json_encode($m_str) !== false) {

                $start = $new_start;

                break;

            }

        }

    }

 

    //切取内容

    for($i=$start;$i<$q_strlen;$i++){

        //ord()函数取得substr()的第一个字符的ASCII码，如果大于0xa0的话则是中文字符

        if(ord(substr($str,$i,1))>0xa0){

            $q_str .= substr($str,$i,3);

            $i+=2;

        }else{

            $q_str .= substr($str,$i,1);

        }

    }

    return $q_str;

}
/* 文字自动换行
     * @param $card 画板
     * @param $pos 数组，top距离画板顶端的距离，fontsize文字的大小，width宽度，left距离左边的距离，hang_size行高
     * @param $str 要写的字符串
     * @param $iswrite  是否输出，ture，  花出文字，false只计算占用的高度
     * @param $nowHeight  已写入行数;
     * @param $second  数组 left  记录换行后据x坐标 ,width 记录换行后最大宽; , maxline 记录最大允许最大行数
     * @return 数组 tp:本次写入行数  nowHeight:一共写入行数  residueStr:截取未写完的字符串 height:最后一行据顶部的高度
     */
     function textalign($card, $pos, $str, $iswrite,$fontpath,$nowHeight,$second){
        $_str_h = $pos["top"];//文字在整个图片距离顶端的位置，也就是y轴的像素距离
        $fontsize = $pos["fontsize"];//文字的大小
        $width = $pos["width"];//设置文字换行的宽带，也就是多宽的距离，自动换行
        $margin_lift = $pos["left"];//文字在整个图片距离左边的位置，也就是X轴的像素距离
        $hang_size = $pos["hang_size"];// 这个是行高
        $temp_string = "";
        $secondCk = ""; //换号的标示,已换行true ,未换行false;
        $font_file =$fontpath;//字体文件，在我的同级目录的Fonts文件夹下面
        $tp = 0;
        $font_color = imagecolorallocate($card, $pos["color"][0], $pos["color"][1], $pos["color"][2]);
        for ($i = 0; $i < mb_strlen($str,'utf8'); $i++) {
            $box = imagettfbbox($fontsize, 0, $font_file, $temp_string);
            $_string_length = $box[2] - $box[0];
            $temptext = mb_substr($str, $i, 1,'utf-8');//拆分字符串
            $temp = imagettfbbox($fontsize, 0, $font_file, $temptext);//用来测量每个字的大小
			if($secondCk){//如果换行,进入判断赋值
                if(is_array($second)){//如果传入换行后参数,则使用.
                    $width = $second['width'];
                    $margin_lift = $second['left'];
                }
            }
			if($second['maxline']){
                //如果已经写入最大行数
                if($nowHeight == $second['maxline']){
                    //获取原字符串长度
                    $strlong = mb_strlen($str,'utf8');
                    //抓取剩余字符串
                    $residueStr ='';
                    $residueStr .= mb_substr($str, $i, $strlong - $i,'utf-8');
                    $cc = $strlong - $i;
                    break;
                }
            }
            if ($_string_length + $temp[2] - $temp[0] < $width) {
                $temp_string .= mb_substr($str, $i, 1,'utf-8');
                if ($i == mb_strlen($str,'utf8') - 1) {
                    $_str_h += $hang_size;
                    $tp++;//用来记录有多少行
                    $nowHeight++;//记录一共写入多少行
                    if ($iswrite) {//如果传入的参数是false，只做测量，不进行绘制输出
                        imagettftext($card, $fontsize, 0, $margin_lift, $_str_h, $font_color, $font_file, $temp_string);
                    }
                }
            } else {
                $texts = mb_substr($str, $i, 1,'utf-8');
                $isfuhao = preg_match("/[\\pP]/u", $texts) ? true : false;//用来判断最后一个字是不是符合，
                if ($isfuhao) {//如果是符号，我们就不换行，把符合添加到最后一个位置去
                    $temp_string .= $texts;
                } else {
                    $i--;
                }
                $_str_h += $hang_size;
                $tp++;
                $nowHeight++;//记录一共写入多少行
                if($iswrite){
                    imagettftext($card, $fontsize, 0, $margin_lift, $_str_h, $font_color, $font_file, $temp_string);
                }
                $temp_string = "";
                $secondCk = true;//作为是否已换行的标志
                
                
            }
            
            
        }
        
         $strdata['tp'] = $tp ;
         //$strdata['residueStr'] = $residueStr ;
         $strdata['nowHeight'] = $nowHeight ;
         $strdata['height'] = $_str_h;
        return $strdata;
    }
    function cutstr_html($string){  

    $string = strip_tags($string);  

    $string = trim($string);  

    $string = ereg_replace("\t","",$string);  

    $string = ereg_replace("\r\n","",$string);  

    $string = ereg_replace("\r","",$string);  

    $string = ereg_replace("\n","",$string);  

    $string = ereg_replace(" ","",$string);  

    return trim($string);  

}

}