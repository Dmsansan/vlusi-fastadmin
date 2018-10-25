<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:102:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\public/../application/admin\view\general\config\index.html";i:1536636085;s:86:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\application\admin\view\layout\default.html";i:1536636085;s:83:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\application\admin\view\common\meta.html";i:1536636085;s:85:"D:\phpStudy\PHPTutorial\WWW\vlusi_fastadmin\application\admin\view\common\script.html";i:1536636085;}*/ ?>
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
    @media (max-width: 375px) {
        .edit-form tr td input{width:100%;}
        .edit-form tr th:first-child,.edit-form tr td:first-child{
            width:20%;
        }
        .edit-form tr th:last-child,.edit-form tr td:last-child{
            display: none;
        }
    }
</style>
<div class="panel panel-default panel-intro">
    <div class="panel-heading">
        <?php echo build_heading(null, false); ?>
        <ul class="nav nav-tabs">
            <?php foreach($siteList as $index=>$vo): ?> 
            <li class="<?php echo !empty($vo['active'])?'active':''; ?>"><a href="#<?php echo $vo['name']; ?>" data-toggle="tab"><?php echo __($vo['title']); ?></a></li>
            <?php endforeach; ?>
            <li>
                <a href="#addcfg" data-toggle="tab"><i class="fa fa-plus"></i></a>
            </li>
        </ul>
    </div>

    <div class="panel-body">
        <div id="myTabContent" class="tab-content">
            <?php foreach($siteList as $index=>$vo): ?> 
            <div class="tab-pane fade <?php echo !empty($vo['active'])?'active in' : ''; ?>" id="<?php echo $vo['name']; ?>">
                <div class="widget-body no-padding">
                    <form id="<?php echo $vo['name']; ?>-form" class="edit-form form-horizontal" role="form" data-toggle="validator" method="POST" action="<?php echo url('general.config/edit'); ?>">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th width="15%"><?php echo __('Title'); ?></th>
                                    <th width="70%"><?php echo __('Value'); ?></th>
                                    <th width="15%"><?php echo __('Name'); ?></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach($vo['list'] as $item): ?>
                                <tr>
                                    <td><?php echo $item['title']; ?></td>
                                    <td>
                                        <div class="row">
                                            <div class="col-sm-8 col-xs-12">
                                                <?php switch($item['type']): case "string": ?>
                                                <input <?php echo $item['extend']; ?> type="text" name="row[<?php echo $item['name']; ?>]" value="<?php echo $item['value']; ?>" class="form-control" data-rule="<?php echo $item['rule']; ?>" data-tip="<?php echo $item['tip']; ?>" />
                                                <?php break; case "text": ?>
                                                <textarea <?php echo $item['extend']; ?> name="row[<?php echo $item['name']; ?>]" class="form-control" data-rule="<?php echo $item['rule']; ?>" rows="5" data-tip="<?php echo $item['tip']; ?>"><?php echo $item['value']; ?></textarea>
                                                <?php break; case "editor": ?>
                                                <textarea <?php echo $item['extend']; ?> name="row[<?php echo $item['name']; ?>]" id="editor-<?php echo $item['name']; ?>" class="form-control editor" data-rule="<?php echo $item['rule']; ?>" rows="5" data-tip="<?php echo $item['tip']; ?>"><?php echo $item['value']; ?></textarea>
                                                <?php break; case "array": ?>
                                                <dl class="fieldlist" data-name="row[<?php echo $item['name']; ?>]">
                                                    <dd>
                                                        <ins><?php echo __('Array key'); ?></ins>
                                                        <ins><?php echo __('Array value'); ?></ins>
                                                    </dd>
                                                    <dd><a href="javascript:;" class="btn btn-sm btn-success btn-append"><i class="fa fa-plus"></i> <?php echo __('Append'); ?></a></dd>
                                                    <textarea name="row[<?php echo $item['name']; ?>]" class="form-control hide" cols="30" rows="5"><?php echo $item['value']; ?></textarea>
                                                </dl>
                                                <?php break; case "datetime": ?>
                                                <input <?php echo $item['extend']; ?> type="text" name="row[<?php echo $item['name']; ?>]" value="<?php echo $item['value']; ?>" class="form-control datetimepicker" data-tip="<?php echo $item['tip']; ?>" data-rule="<?php echo $item['rule']; ?>" />
                                                <?php break; case "number": ?>
                                                <input <?php echo $item['extend']; ?> type="number" name="row[<?php echo $item['name']; ?>]" value="<?php echo $item['value']; ?>" class="form-control" data-tip="<?php echo $item['tip']; ?>" data-rule="<?php echo $item['rule']; ?>" />
                                                <?php break; case "checkbox": if(is_array($item['content']) || $item['content'] instanceof \think\Collection || $item['content'] instanceof \think\Paginator): if( count($item['content'])==0 ) : echo "" ;else: foreach($item['content'] as $key=>$vo): ?>
                                                <label for="row[<?php echo $item['name']; ?>][]-<?php echo $key; ?>"><input id="row[<?php echo $item['name']; ?>][]-<?php echo $key; ?>" name="row[<?php echo $item['name']; ?>][]" type="checkbox" value="<?php echo $key; ?>" data-tip="<?php echo $item['tip']; ?>" <?php if(in_array(($key), is_array($item['value'])?$item['value']:explode(',',$item['value']))): ?>checked<?php endif; ?> /> <?php echo $vo; ?></label>
                                                <?php endforeach; endif; else: echo "" ;endif; break; case "radio": if(is_array($item['content']) || $item['content'] instanceof \think\Collection || $item['content'] instanceof \think\Paginator): if( count($item['content'])==0 ) : echo "" ;else: foreach($item['content'] as $key=>$vo): ?>
                                                <label for="row[<?php echo $item['name']; ?>]-<?php echo $key; ?>"><input id="row[<?php echo $item['name']; ?>]-<?php echo $key; ?>" name="row[<?php echo $item['name']; ?>]" type="radio" value="<?php echo $key; ?>" data-tip="<?php echo $item['tip']; ?>" <?php if(in_array(($key), is_array($item['value'])?$item['value']:explode(',',$item['value']))): ?>checked<?php endif; ?> /> <?php echo $vo; ?></label>
                                                <?php endforeach; endif; else: echo "" ;endif; break; case "select": case "selects": ?>
                                                <select <?php echo $item['extend']; ?> name="row[<?php echo $item['name']; ?>]<?php echo $item['type']=='selects'?'[]':''; ?>" class="form-control selectpicker" data-tip="<?php echo $item['tip']; ?>" <?php echo $item['type']=='selects'?'multiple':''; ?>>
                                                    <?php if(is_array($item['content']) || $item['content'] instanceof \think\Collection || $item['content'] instanceof \think\Paginator): if( count($item['content'])==0 ) : echo "" ;else: foreach($item['content'] as $key=>$vo): ?>
                                                    <option value="<?php echo $key; ?>" <?php if(in_array(($key), is_array($item['value'])?$item['value']:explode(',',$item['value']))): ?>selected<?php endif; ?>><?php echo $vo; ?></option>
                                                    <?php endforeach; endif; else: echo "" ;endif; ?>
                                                </select>
                                                <?php break; case "image": case "images": ?>
                                                <div class="form-inline">
                                                    <input id="c-<?php echo $item['name']; ?>" class="form-control" size="50" name="row[<?php echo $item['name']; ?>]" type="text" value="<?php echo $item['value']; ?>" data-tip="<?php echo $item['tip']; ?>">
                                                    <span><button type="button" id="plupload-<?php echo $item['name']; ?>" class="btn btn-danger plupload" data-input-id="c-<?php echo $item['name']; ?>" data-mimetype="image/*" data-multiple="<?php echo $item['type']=='image'?'false':'true'; ?>" data-preview-id="p-<?php echo $item['name']; ?>"><i class="fa fa-upload"></i> <?php echo __('Upload'); ?></button></span>
                                                    <span><button type="button" id="fachoose-<?php echo $item['name']; ?>" class="btn btn-primary fachoose" data-input-id="c-<?php echo $item['name']; ?>" data-mimetype="image/*" data-multiple="<?php echo $item['type']=='image'?'false':'true'; ?>"><i class="fa fa-list"></i> <?php echo __('Choose'); ?></button></span>
                                                    <ul class="row list-inline plupload-preview" id="p-<?php echo $item['name']; ?>"></ul>
                                                </div>
                                                <?php break; case "file": case "files": ?>
                                                <div class="form-inline">
                                                    <input id="c-<?php echo $item['name']; ?>" class="form-control" size="50" name="row[<?php echo $item['name']; ?>]" type="text" value="<?php echo $item['value']; ?>" data-tip="<?php echo $item['tip']; ?>">
                                                    <span><button type="button" id="plupload-<?php echo $item['name']; ?>" class="btn btn-danger plupload" data-input-id="c-<?php echo $item['name']; ?>" data-multiple="<?php echo $item['type']=='file'?'false':'true'; ?>"><i class="fa fa-upload"></i> <?php echo __('Upload'); ?></button></span>
                                                    <span><button type="button" id="fachoose-<?php echo $item['name']; ?>" class="btn btn-primary fachoose" data-input-id="c-<?php echo $item['name']; ?>" data-multiple="<?php echo $item['type']=='file'?'false':'true'; ?>"><i class="fa fa-list"></i> <?php echo __('Choose'); ?></button></span>
                                                </div>
                                                <?php break; case "bool": ?>
                                                <label for="row[<?php echo $item['name']; ?>]-yes"><input id="row[<?php echo $item['name']; ?>]-yes" name="row[<?php echo $item['name']; ?>]" type="radio" value="1" <?php echo !empty($item['value'])?'checked':''; ?> data-tip="<?php echo $item['tip']; ?>" /> <?php echo __('Yes'); ?></label> 
                                                <label for="row[<?php echo $item['name']; ?>]-no"><input id="row[<?php echo $item['name']; ?>]-no" name="row[<?php echo $item['name']; ?>]" type="radio" value="0" <?php echo !empty($item['value'])?'':'checked'; ?> data-tip="<?php echo $item['tip']; ?>" /> <?php echo __('No'); ?></label>
                                                <?php break; endswitch; ?>
                                            </div>
                                            <div class="col-sm-4"></div>
                                        </div>

                                    </td>
                                    <td><?php echo "{\$site.". $item['name'] . "}"; ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td>
                                        <button type="submit" class="btn btn-success btn-embossed"><?php echo __('OK'); ?></button>
                                        <button type="reset" class="btn btn-default btn-embossed"><?php echo __('Reset'); ?></button>
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </form>
                </div>
            </div>
            <?php endforeach; ?>
            <div class="tab-pane fade" id="addcfg">
                <form id="add-form" class="form-horizontal" role="form" data-toggle="validator" method="POST" action="<?php echo url('general.config/add'); ?>">
                    <div class="form-group">
                        <label for="type" class="control-label col-xs-12 col-sm-2"><?php echo __('Type'); ?>:</label>
                        <div class="col-xs-12 col-sm-4">
                            <select name="row[type]" class="form-control selectpicker">
                                <?php if(is_array($typeList) || $typeList instanceof \think\Collection || $typeList instanceof \think\Paginator): if( count($typeList)==0 ) : echo "" ;else: foreach($typeList as $key=>$vo): ?>
                                <option value="<?php echo $key; ?>" <?php if(in_array(($key), explode(',',"string"))): ?>selected<?php endif; ?>><?php echo $vo; ?></option>
                                <?php endforeach; endif; else: echo "" ;endif; ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="group" class="control-label col-xs-12 col-sm-2"><?php echo __('Group'); ?>:</label>
                        <div class="col-xs-12 col-sm-4">
                            <select name="row[group]" class="form-control selectpicker">
                                <?php if(is_array($groupList) || $groupList instanceof \think\Collection || $groupList instanceof \think\Paginator): if( count($groupList)==0 ) : echo "" ;else: foreach($groupList as $key=>$vo): ?>
                                <option value="<?php echo $key; ?>" <?php if(in_array(($key), explode(',',"basic"))): ?>selected<?php endif; ?>><?php echo $vo; ?></option>
                                <?php endforeach; endif; else: echo "" ;endif; ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="control-label col-xs-12 col-sm-2"><?php echo __('Name'); ?>:</label>
                        <div class="col-xs-12 col-sm-4">
                            <input type="text" class="form-control" id="name" name="row[name]" value="" data-rule="required; length(3~30); remote(general/config/check)" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="title" class="control-label col-xs-12 col-sm-2"><?php echo __('Title'); ?>:</label>
                        <div class="col-xs-12 col-sm-4">
                            <input type="text" class="form-control" id="title" name="row[title]" value="" data-rule="required" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="value" class="control-label col-xs-12 col-sm-2"><?php echo __('Value'); ?>:</label>
                        <div class="col-xs-12 col-sm-4">
                            <input type="text" class="form-control" id="value" name="row[value]" value="" data-rule="" />
                        </div>
                    </div>
                    <div class="form-group hide" id="add-content-container">
                        <label for="content" class="control-label col-xs-12 col-sm-2"><?php echo __('Content'); ?>:</label>
                        <div class="col-xs-12 col-sm-4">
                            <textarea name="row[content]" id="content" cols="30" rows="5" class="form-control" data-rule="required">value1|title1
value2|title2</textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="tip" class="control-label col-xs-12 col-sm-2"><?php echo __('Tip'); ?>:</label>
                        <div class="col-xs-12 col-sm-4">
                            <input type="text" class="form-control" id="tip" name="row[tip]" value="" data-rule="" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="rule" class="control-label col-xs-12 col-sm-2"><?php echo __('Rule'); ?>:</label>
                        <div class="col-xs-12 col-sm-4">
                            <input type="text" class="form-control" id="rule" name="row[rule]" value="" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="extend" class="control-label col-xs-12 col-sm-2"><?php echo __('Extend'); ?>:</label>
                        <div class="col-xs-12 col-sm-4">
                            <textarea name="row[extend]" id="extend" cols="30" rows="5" class="form-control" data-rule=""></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-12 col-sm-2"></label>
                        <div class="col-xs-12 col-sm-4">
                            <button type="submit" class="btn btn-success btn-embossed"><?php echo __('OK'); ?></button>
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
                    </div>
                </div>
            </div>
        </div>
        <script src="/vlusi_fastadmin/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/vlusi_fastadmin/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>