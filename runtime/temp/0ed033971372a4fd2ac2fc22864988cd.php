<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:103:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\public/../application/admin\view\general\profile\index.html";i:1536636085;s:86:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\application\admin\view\layout\default.html";i:1536636085;s:83:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\application\admin\view\common\meta.html";i:1536636085;s:85:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\application\admin\view\common\script.html";i:1536636085;}*/ ?>
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
                                <style>
    .profile-avatar-container {
        position:relative;
        width:100px;margin:0 auto;
    }
    .profile-avatar-container .profile-user-img{
        width:100px;
        height:100px;
    }
    .profile-avatar-container .profile-avatar-text {
        display:none;
    }
    .profile-avatar-container:hover .profile-avatar-text {
        display:block;
        position:absolute;
        height:100px;
        width:100px;
        background:#444;
        opacity: .6;
        color: #fff;
        top:0;
        left:0;
        line-height: 100px;
        text-align: center;
    }
    .profile-avatar-container button{
        position:absolute;
        top:0;left:0;width:100px;height:100px;opacity: 0;
    }
</style>
<div class="row animated fadeInRight">
    <div class="col-md-4">
        <div class="box box-success">
            <div class="panel-heading">
                <?php echo __('Profile'); ?>
            </div>
            <div class="panel-body">

                <form id="update-form" role="form" data-toggle="validator" method="POST" action="<?php echo url('general.profile/update'); ?>">
                    <input type="hidden" id="c-avatar" name="row[avatar]" value="<?php echo $admin['avatar']; ?>" />
                    <div class="box-body box-profile">
                        
                        <div class="profile-avatar-container">
                            <img class="profile-user-img img-responsive img-circle plupload" src="/vlusi_fastadmin/public<?php echo $admin['avatar']; ?>" alt="">
                            <div class="profile-avatar-text img-circle"><?php echo __('Click to edit'); ?></div>
                            <button id="plupload-avatar" class="plupload" data-input-id="c-avatar"><i class="fa fa-upload"></i> <?php echo __('Upload'); ?></button>
                        </div>
                        
                        <h3 class="profile-username text-center"><?php echo $admin['username']; ?></h3>

                        <p class="text-muted text-center"><?php echo $admin['email']; ?></p>
                        <div class="form-group">
                            <label for="username" class="control-label"><?php echo __('Username'); ?>:</label>
                            <input type="text" class="form-control" name="row[username]" value="<?php echo $admin['username']; ?>" disabled />
                        </div>
                        <div class="form-group">
                            <label for="email" class="control-label"><?php echo __('Email'); ?>:</label>
                            <input type="text" class="form-control" name="row[email]" value="<?php echo $admin['email']; ?>" data-rule="required;email" />
                        </div>
                        <div class="form-group">
                            <label for="nickname" class="control-label"><?php echo __('Nickname'); ?>:</label>
                            <input type="text" class="form-control" name="row[nickname]" value="<?php echo $admin['nickname']; ?>" data-rule="required" />
                        </div>
                        <div class="form-group">
                            <label for="password" class="control-label"><?php echo __('Password'); ?>:</label>
                            <input type="text" class="form-control" placeholder="<?php echo __('Leave password blank if dont want to change'); ?>" autocomplete="new-password" name="row[password]" value=""/>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-success"><?php echo __('Submit'); ?></button>
                            <button type="reset" class="btn btn-default"><?php echo __('Reset'); ?></button>
                        </div>

                    </div>
                </form>
            </div>
        </div>

    </div>
    <div class="col-md-8">
        <div class="panel panel-default panel-intro panel-nav">
            <div class="panel-heading">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#one" data-toggle="tab"><i class="fa fa-list"></i> <?php echo __('Admin log'); ?></a></li>
                </ul>
            </div>
            <div class="panel-body">
                <div id="myTabContent" class="tab-content">
                    <div class="tab-pane fade active in" id="one">
                        <div class="widget-body no-padding">
                            <div id="toolbar" class="toolbar">
                                <?php echo build_toolbar('refresh'); ?>
                            </div>
                            <table id="table" class="table table-striped table-bordered table-hover" width="100%">

                            </table>

                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
</div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="/vlusi_fastadmin/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/vlusi_fastadmin/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>