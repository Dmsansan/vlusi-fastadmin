<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:104:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\public/../application/admin\view\general\attachment\add.html";i:1536636085;s:86:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\application\admin\view\layout\default.html";i:1536636085;s:83:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\application\admin\view\common\meta.html";i:1536636085;s:85:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\application\admin\view\common\script.html";i:1536636085;}*/ ?>
<!DOCTYPE html>
<html lang="<?php echo $config['language']; ?>">
    <head>
        <meta charset="utf-8">
<title><?php echo (isset($title) && ($title !== '')?$title:''); ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="renderer" content="webkit">

<link rel="shortcut icon" href="/vlusi_fastadmin/public/assets/img/favicon.ico" />
<!-- Loading Bootstrap -->
<link href="/vlusi_fastadmin/public/assets/css/backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.css?v=<?php echo \think\Config::get('site.version'); ?>" rel="stylesheet">

<!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->
<!--[if lt IE 9]>
  <script src="/vlusi_fastadmin/public/assets/js/html5shiv.js"></script>
  <script src="/vlusi_fastadmin/public/assets/js/respond.min.js"></script>
<![endif]-->
<script type="text/javascript">
    var require = {
        config:  <?php echo json_encode($config); ?>
    };
</script>
    </head>

    <body class="inside-header inside-aside <?php echo defined('IS_DIALOG') && IS_DIALOG ? 'is-dialog' : ''; ?>">
        <div id="main" role="main">
            <div class="tab-content tab-addtabs">
                <div id="content">
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <section class="content-header hide">
                                <h1>
                                    <?php echo __('Dashboard'); ?>
                                    <small><?php echo __('Control panel'); ?></small>
                                </h1>
                            </section>
                            <?php if(!IS_DIALOG && !$config['fastadmin']['multiplenav']): ?>
                            <!-- RIBBON -->
                            <div id="ribbon">
                                <ol class="breadcrumb pull-left">
                                    <li><a href="dashboard" class="addtabsit"><i class="fa fa-dashboard"></i> <?php echo __('Dashboard'); ?></a></li>
                                </ol>
                                <ol class="breadcrumb pull-right">
                                    <?php foreach($breadcrumb as $vo): ?>
                                    <li><a href="javascript:;" data-url="<?php echo $vo['url']; ?>"><?php echo $vo['title']; ?></a></li>
                                    <?php endforeach; ?>
                                </ol>
                            </div>
                            <!-- END RIBBON -->
                            <?php endif; ?>
                            <div class="content">
                                <form id="add-form" class="form-horizontal form-ajax" role="form" data-toggle="validator" method="POST" action="">
    <?php if($config['upload']['cdnurl']): ?>
    <div class="form-group">
        <label for="c-third" class="control-label col-xs-12 col-sm-2"><?php echo __('Upload'); ?>:</label>
        <div class="col-xs-12 col-sm-8">
            <input type="text" name="row[third]" id="c-third" class="form-control" />
        </div>
    </div>

    <div class="form-group">
        <label for="c-third" class="control-label col-xs-12 col-sm-2"></label>
        <div class="col-xs-12 col-sm-8">
            <button id="plupload-third" class="btn btn-danger plupload" data-multiple="true" data-input-id="c-third" ><i class="fa fa-upload"></i> <?php echo __("Upload to third"); ?></button>
        </div>
    </div>
    <?php endif; ?>

    <div class="form-group">
        <label for="c-local" class="control-label col-xs-12 col-sm-2"><?php echo __('Upload'); ?>:</label>
        <div class="col-xs-12 col-sm-8">
            <input type="text" name="row[local]" id="c-local" class="form-control" />
        </div>
    </div>

    <div class="form-group">
        <label for="c-local" class="control-label col-xs-12 col-sm-2"></label>
        <div class="col-xs-12 col-sm-8">
            <button id="plupload-local" class="btn btn-primary plupload" data-input-id="c-local" data-url="<?php echo url('ajax/upload'); ?>"><i class="fa fa-upload"></i> <?php echo __("Upload to local"); ?></button>
        </div>
    </div>

    <div class="form-group">
        <label for="c-editor" class="control-label col-xs-12 col-sm-2"><?php echo __('Upload from editor'); ?>:</label>
        <div class="col-xs-12 col-sm-8">
            <textarea name="row[editor]" id="c-editor" cols="60" rows="5" class="form-control editor"></textarea>
        </div>
    </div>
    <div class="form-group hidden layer-footer">
        <div class="col-xs-2"></div>
        <div class="col-xs-12 col-sm-8">
            <button type="reset" class="btn btn-default btn-embossed"><?php echo __('Reset'); ?></button>
        </div>
    </div>
</form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="/vlusi_fastadmin/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/vlusi_fastadmin/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>