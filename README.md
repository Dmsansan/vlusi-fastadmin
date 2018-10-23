基于fastAdmin开发的微信公众号项目，ThinkPHP5+Bootstrap2.0。
===============


## **主要配置**

* 数据库配置
    
	* 采用远程数据源：
		
		地址：47.96.179.77 账号：root 密码：sansan`123 数据库：
	
	* 项目数据库文件：/application/database.php
		
		
		// 数据库类型

	    'type'            => Env::get('database.type', 'mysql'),

	    // 服务器地址

	    'hostname'        => Env::get('database.hostname', '47.96.179.77'),

	    // 数据库名

	    'database'        => Env::get('database.database', 'vlusi_fastadmin'),

	    // 用户名

	    'username'        => Env::get('database.username', 'root'),

	    // 密码

	    'password'        => Env::get('database.password', 'sansan`123'),

	    // 端口

	    'hostport'        => Env::get('database.hostport', ''),

* 访问地址：
	* 前端：http://localhost/vlusi_fastadmin/public/index.php
	* 后端：http://localhost/vlusi_fastadmin/public/admin/dashboard?ref=addtabs
