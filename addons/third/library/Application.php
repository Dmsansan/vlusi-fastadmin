<?php

namespace addons\third\library;

class Application
{

    /**
     * 配置信息
     * @var array
     */
    private $config = [];

    /**
     * 服务提供者
     * @var array
     */
    private $providers = [
        'qq'     => 'Qq',
        'weibo'  => 'Weibo',
        'wechat' => 'Wechat',
    ];

    /**
     * 服务对象信息
     * @var array
     */
    protected $services = [];

    public function __construct($options = [])
    {
        $this->config = array_merge($this->config, is_array($options) ? $options : []);

        //注册服务器提供者
        $this->registerProviders();
    }

    /**
     * 注册服务提供者
     */
    private function registerProviders()
    {
        foreach ($this->providers as $k => $v)
        {
            $this->services[$k] = function() use ($k, $v) {
                $options = $this->config[$k];
                $options['app_id'] = isset($options['app_id']) ? $options['app_id'] : '';
                $options['app_secret'] = isset($options['app_secret']) ? $options['app_secret'] : '';
                // 如果未定义回调地址则自动生成
                $options['callback'] = isset($options['callback']) && $options['callback'] ? $options['callback'] : url('/', [], false, true);
                $objname = __NAMESPACE__ . "\\{$v}";
                return new $objname($options);
            };
        }
    }

    public function __set($key, $value)
    {
        $this->services[$key] = $value;
    }

    public function __get($key)
    {
        return isset($this->services[$key]) ? $this->services[$key]($this) : null;
    }

}
