FastAdmin是一款基于ThinkPHP5+Bootstrap的极速后台开发框架。
===============


## **项目介绍**

* 微信公众号管理项目，涉及课程、资讯的文本类信息发布管理，以及对应的收藏评论管理。

## **后台账号**

账号：**admin**      密码： **admin123**

## **自动生成crud操作指令**

	#两张表相互关联
	php think crud -t test -r category -k category_id -p id -c information/Information
	#多表关联
	php think crud -t test --relation=category --relation=admin --relationforeignkey=category_id --relationforeignkey=admin_id

