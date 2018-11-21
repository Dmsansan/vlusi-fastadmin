<?php

return array (
  0 => 
  array (
    'name' => 'backupDir',
    'title' => '备份存放目录',
    'type' => 'string',
    'content' => 
    array (
    ),
    'value' => '../data/',
    'rule' => 'required',
    'msg' => '',
    'tip' => '备份目录,请使用相对目录',
    'ok' => '',
    'extend' => '',
  ),
  1 => 
  array (
    'name' => 'backupIgnoreTables',
    'title' => '备份忽略的表',
    'type' => 'string',
    'content' => 
    array (
    ),
    'value' => 'fa_admin_log',
    'rule' => '',
    'msg' => '',
    'tip' => '忽略备份的表,多个表以,进行分隔',
    'ok' => '',
    'extend' => '',
  ),
);
