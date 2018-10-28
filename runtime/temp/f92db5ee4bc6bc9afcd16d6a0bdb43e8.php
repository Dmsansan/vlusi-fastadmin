<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:85:"D:\phpStudy\WWW\vlusi_fastadmin\public/../application/admin\view\dashboard\index.html";i:1536636085;s:74:"D:\phpStudy\WWW\vlusi_fastadmin\application\admin\view\layout\default.html";i:1536636085;s:71:"D:\phpStudy\WWW\vlusi_fastadmin\application\admin\view\common\meta.html";i:1536636085;s:73:"D:\phpStudy\WWW\vlusi_fastadmin\application\admin\view\common\script.html";i:1536636085;}*/ ?>
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
                                <style type="text/css">
    .sm-st {
        background:#fff;
        padding:20px;
        -webkit-border-radius:3px;
        -moz-border-radius:3px;
        border-radius:3px;
        margin-bottom:20px;
        -webkit-box-shadow: 0 1px 0px rgba(0,0,0,0.05);
        box-shadow: 0 1px 0px rgba(0,0,0,0.05);
    }
    .sm-st-icon {
        width:60px;
        height:60px;
        display:inline-block;
        line-height:60px;
        text-align:center;
        font-size:30px;
        background:#eee;
        -webkit-border-radius:5px;
        -moz-border-radius:5px;
        border-radius:5px;
        float:left;
        margin-right:10px;
        color:#fff;
    }
    .sm-st-info {
        font-size:12px;
        padding-top:2px;
    }
    .sm-st-info span {
        display:block;
        font-size:24px;
        font-weight:600;
    }
    .orange {
        background:#fa8564 !important;
    }
    .tar {
        background:#45cf95 !important;
    }
    .sm-st .green {
        background:#86ba41 !important;
    }
    .pink {
        background:#AC75F0 !important;
    }
    .yellow-b {
        background: #fdd752 !important;
    }
    .stat-elem {

        background-color: #fff;
        padding: 18px;
        border-radius: 40px;

    }

    .stat-info {
        text-align: center;
        background-color:#fff;
        border-radius: 5px;
        margin-top: -5px;
        padding: 8px;
        -webkit-box-shadow: 0 1px 0px rgba(0,0,0,0.05);
        box-shadow: 0 1px 0px rgba(0,0,0,0.05);
        font-style: italic;
    }

    .stat-icon {
        text-align: center;
        margin-bottom: 5px;
    }

    .st-red {
        background-color: #F05050;
    }
    .st-green {
        background-color: #27C24C;
    }
    .st-violet {
        background-color: #7266ba;
    }
    .st-blue {
        background-color: #23b7e5;
    }

    .stats .stat-icon {
        color: #28bb9c;
        display: inline-block;
        font-size: 26px;
        text-align: center;
        vertical-align: middle;
        width: 50px;
        float:left;
    }

    .stat {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        margin-right: 10px; }
    .stat .value {
        font-size: 20px;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500; }
    .stat .name {
        overflow: hidden;
        text-overflow: ellipsis; }
    .stat.lg .value {
        font-size: 26px;
        line-height: 28px; }
    .stat.lg .name {
        font-size: 16px; }
    .stat-col .progress {height:2px;}
    .stat-col .progress-bar {line-height:2px;height:2px;}

    .item {
        padding:30px 0;
    }
</style>
<div class="panel panel-default panel-intro">
    <div class="panel-heading">
        <?php echo build_heading(null, false); ?>
        <ul class="nav nav-tabs">
            <li class="active"><a href="#one" data-toggle="tab"><?php echo __('Dashboard'); ?></a></li>
            <li><a href="#two" data-toggle="tab"><?php echo __('Custom'); ?></a></li>
        </ul>
    </div>
    <div class="panel-body">
        <div id="myTabContent" class="tab-content">
            <div class="tab-pane fade active in" id="one">

                <div class="row">
                    <div class="col-sm-3 col-xs-6">
                        <div class="sm-st clearfix">
                            <span class="sm-st-icon st-red"><i class="fa fa-users"></i></span>
                            <div class="sm-st-info">
                                <span><?php echo $totaluser; ?></span>
                                <?php echo __('Total user'); ?>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3 col-xs-6">
                        <div class="sm-st clearfix">
                            <span class="sm-st-icon st-violet"><i class="fa fa-book"></i></span>
                            <div class="sm-st-info">
                                <span><?php echo $totalviews; ?></span>
                                <?php echo __('Total view'); ?>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3 col-xs-6">
                        <div class="sm-st clearfix">
                            <span class="sm-st-icon st-blue"><i class="fa fa-shopping-bag"></i></span>
                            <div class="sm-st-info">
                                <span><?php echo $totalorder; ?></span>
                                <?php echo __('Total order'); ?>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3 col-xs-6">
                        <div class="sm-st clearfix">
                            <span class="sm-st-icon st-green"><i class="fa fa-cny"></i></span>
                            <div class="sm-st-info">
                                <span><?php echo $totalorderamount; ?></span>
                                <?php echo __('Total order amount'); ?>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-8">
                        <div id="echart" style="height:200px;width:100%;"></div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card sameheight-item stats">
                            <div class="card-block">
                                <div class="row row-sm stats-container">
                                    <div class="col-xs-6 stat-col">
                                        <div class="stat-icon"> <i class="fa fa-rocket"></i> </div>
                                        <div class="stat">
                                            <div class="value"> <?php echo $todayusersignup; ?> </div>
                                            <div class="name"> <?php echo __('Today user signup'); ?> </div>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar progress-bar-success" style="width: 30%"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-6 stat-col">
                                        <div class="stat-icon"> <i class="fa fa-shopping-cart"></i> </div>
                                        <div class="stat">
                                            <div class="value"> <?php echo $todayuserlogin; ?> </div>
                                            <div class="name"> <?php echo __('Today user login'); ?> </div>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar progress-bar-success" style="width: 25%"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-6  stat-col">
                                        <div class="stat-icon"> <i class="fa fa-line-chart"></i> </div>
                                        <div class="stat">
                                            <div class="value"> <?php echo $todayorder; ?> </div>
                                            <div class="name"> <?php echo __('Today order'); ?> </div>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar progress-bar-success" style="width: 25%"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-6  stat-col">
                                        <div class="stat-icon"> <i class="fa fa-users"></i> </div>
                                        <div class="stat">
                                            <div class="value"> <?php echo $unsettleorder; ?> </div>
                                            <div class="name"> <?php echo __('Unsettle order'); ?> </div>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar progress-bar-success" style="width: 25%"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-6  stat-col">
                                        <div class="stat-icon"> <i class="fa fa-list-alt"></i> </div>
                                        <div class="stat">
                                            <div class="value"> <?php echo $sevendnu; ?> </div>
                                            <div class="name"> <?php echo __('Seven dnu'); ?> </div>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar progress-bar-success" style="width: 25%"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-6 stat-col">
                                        <div class="stat-icon"> <i class="fa fa-dollar"></i> </div>
                                        <div class="stat">
                                            <div class="value"> <?php echo $sevendau; ?> </div>
                                            <div class="name"> <?php echo __('Seven dau'); ?> </div>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar progress-bar-success" style="width: 25%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row" style="margin-top:15px;">

                    <div class="col-lg-12">
                    </div>
                    <div class="col-xs-6 col-md-3">
                        <div class="panel bg-blue">
                            <div class="panel-body">
                                <div class="panel-title">
                                    <span class="label label-success pull-right"><?php echo __('Real time'); ?></span>
                                    <h5><?php echo __('Category count'); ?></h5>
                                </div>
                                <div class="panel-content">
                                    <h1 class="no-margins">1234</h1>
                                    <div class="stat-percent font-bold text-gray"><i class="fa fa-commenting"></i> 1234</div>
                                    <small><?php echo __('Category count tips'); ?></small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6 col-md-3">
                        <div class="panel bg-aqua-gradient">
                            <div class="panel-body">
                                <div class="ibox-title">
                                    <span class="label label-info pull-right"><?php echo __('Real time'); ?></span>
                                    <h5><?php echo __('Attachment count'); ?></h5>
                                </div>
                                <div class="ibox-content">
                                    <h1 class="no-margins">1043</h1>
                                    <div class="stat-percent font-bold text-gray"><i class="fa fa-modx"></i> 2592</div>
                                    <small><?php echo __('Attachment count tips'); ?></small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xs-6 col-md-3">
                        <div class="panel bg-purple-gradient">
                            <div class="panel-body">
                                <div class="ibox-title">
                                    <span class="label label-primary pull-right"><?php echo __('Real time'); ?></span>
                                    <h5><?php echo __('Article count'); ?></h5>
                                </div>
                                <div class="ibox-content">

                                    <div class="row">
                                        <div class="col-md-6">
                                            <h1 class="no-margins">1234</h1>
                                            <div class="font-bold text-navy"><i class="fa fa-commenting"></i> <small><?php echo __('Comment count'); ?></small></div>
                                        </div>
                                        <div class="col-md-6">
                                            <h1 class="no-margins">6754</h1>
                                            <div class="font-bold text-navy"><i class="fa fa-heart"></i> <small><?php echo __('Like count'); ?></small></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6 col-md-3">
                        <div class="panel bg-green-gradient">
                            <div class="panel-body">
                                <div class="ibox-title">
                                    <span class="label label-primary pull-right"><?php echo __('Real time'); ?></span>
                                    <h5><?php echo __('News count'); ?></h5>
                                </div>
                                <div class="ibox-content">

                                    <div class="row">
                                        <div class="col-md-6">
                                            <h1 class="no-margins">5302</h1>
                                            <div class="font-bold text-navy"><i class="fa fa-commenting"></i> <small><?php echo __('Comment count'); ?></small></div>
                                        </div>
                                        <div class="col-md-6">
                                            <h1 class="no-margins">8205</h1>
                                            <div class="font-bold text-navy"><i class="fa fa-user"></i> <small><?php echo __('Like count'); ?></small></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-4">
                        <div class="box box-danger">
                            <div class="box-header">
                                <h3 class="box-title"><?php echo __('Recent news'); ?></h3>
                                <div class="box-tools pull-right">
                                    <a href="https://www.fastadmin.net" target="_blank" class="btn btn-box-tool"><?php echo __('More'); ?></a>
                                </div>
                            </div>
                            <div class="box-body" id="news-list">
                                
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="box box-success">
                            <div class="box-header">
                                <h3 class="box-title"><?php echo __('Recent discussion'); ?></h3>
                                <div class="box-tools pull-right">
                                    <a href="https://forum.fastadmin.net" class="btn btn-box-tool"><?php echo __('More'); ?></a>
                                </div>
                            </div>
                            <div class="box-body" id="discussion-list">
                                
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="box box-info">
                            <div class="box-header"><h3 class="box-title"><?php echo __('Server info'); ?></h3></div>
                            <div class="box-body">
                                <table class="table table-striped">
                                    <tbody>
                                        <tr>
                                            <td width="140"><?php echo __('FastAdmin version'); ?></td>
                                            <td><?php echo \think\Config::get('fastadmin.version'); ?> <a href="javascript:;" class="btn btn-xs btn-checkversion">检查最新版</a></td>
                                        </tr>
                                        <tr>
                                            <td><?php echo __('FastAdmin addon version'); ?></td>
                                            <td><?php echo $addonversion; ?></td>
                                        </tr>
                                        <tr>
                                            <td><?php echo __('Sapi name'); ?></td>
                                            <td><?php echo php_sapi_name(); ?></td>
                                        </tr>
                                        <tr>
                                            <td><?php echo __('Debug mode'); ?></td>
                                            <td><?php echo \think\Config::get('app_debug')?__('Yes'):__('No'); ?></td>
                                        </tr>
                                        <tr>
                                            <td><?php echo __('Software'); ?></td>
                                            <td><?php echo \think\Request::instance()->server('SERVER_SOFTWARE'); ?></td>
                                        </tr>
                                        <tr>
                                            <td><?php echo __('Upload mode'); ?></td>
                                            <td><?php echo $uploadmode; ?></td>
                                        </tr>
                                        <tr>
                                            <td><?php echo __('Upload url'); ?></td>
                                            <td><?php echo $config['upload']['uploadurl']; ?></td>
                                        </tr>
                                        <tr>
                                            <td><?php echo __('Upload Cdn url'); ?></td>
                                            <td><?php echo $config['upload']['cdnurl']; ?></td>
                                        </tr>
                                        <tr>
                                            <td><?php echo __('Timezone'); ?></td>
                                            <td><?php echo date_default_timezone_get(); ?></td>
                                        </tr>
                                        <tr>
                                            <td><?php echo __('Cdn url'); ?></td>
                                            <td>/vlusi_fastadmin/public</td>
                                        </tr>
                                        <tr>
                                            <td><?php echo __('Language'); ?></td>
                                            <td><?php echo $config['language']; ?></td>
                                        </tr>
                                    </tbody></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="two">
                <div class="row">
                    <div class="col-xs-12">
                        <?php echo __('Custom zone'); ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script id="newstpl" type="text/html">
    <ul class="nav nav-stacked">
        <%for(var i=0;i < news.length;i++){%>
        <%var item=news[i];%>
        <li>
            <a href="<%=item.url%>" target="_blank">
                <span class="text"><%=item.title%></span>
            </a>
        </li>
        <%}%>
    </ul>
</script>
<script id="discussiontpl" type="text/html">
    <ul class="products-list product-list-in-box">
        <%for(var i=0;i < news.length;i++){%>
        <%var item=news[i];%>
        <li class="item">
            <div class="">
                <a href="<%=item.url%>" target="_blank" class="product-title"><%=item.title%>
                    <span class="label label-warning pull-right"><%=item.comments_count%></span></a>
                <span class="product-description">
                    <%=item.last_time%>
                </span>
            </div>
        </li>
        <%}%>
    </ul>
</script>
<script>
    var Orderdata = {
    column: <?php echo json_encode(array_keys($paylist)); ?>,
            paydata: <?php echo json_encode(array_values($paylist)); ?>,
            createdata: <?php echo json_encode(array_values($createlist)); ?>,
    };
</script>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="/vlusi_fastadmin/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/vlusi_fastadmin/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>