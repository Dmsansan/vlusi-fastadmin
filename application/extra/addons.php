<?php

return array (
  'autoload' => false,
  'hooks' => 
  array (
    'upload_config_init' => 
    array (
      0 => 'alioss',
    ),
    'upload_after' => 
    array (
      0 => 'alioss',
    ),
  ),
  'route' => 
  array (
    '/third$' => 'third/index/index',
    '/third/connect/[:platform]' => 'third/index/connect',
    '/third/callback/[:platform]' => 'third/index/callback',
  ),
);