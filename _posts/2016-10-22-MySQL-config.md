---
title: "WIN10环境下 MySQL 5.7 的配置"
layout: post
date: 2016-10-12 22:48
tag:
- MySQL
category: blog
author: ingerchao
description: install mysql
---

可以说是把所有的坑都踩完了 发这一篇博客 希望帮到大家

首先去mysql官网下载[mysql服务](https://dev.mysql.com/downloads/windows/installer/) 和[mysql workbench](https://dev.mysql.com/downloads/workbench/)，下载好了之后__解压__。

当前是mysql5.7.18版本，我的是5.7.14。workbench请自行安装。

解压完之后，__配置环境变量__

系统属性->高级系统设置->环境变量

新建一个系统变量MYSQL_HOME,值是你的mysql路径

![这里写图片描述](http://img.blog.csdn.net/20170603221700712?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

在Path变量下新建%MYSQL_HOME%\bin;

![这里写图片描述](http://img.blog.csdn.net/20170603221900538?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

然后确定->保存。

### 第二步 配置my.ini

在mysql根目录下新建一个data文件夹。

mysql根目录下有一个**my-default.ini** 关于里面的参数 你们可以自查my.ini参数详解。我这里就不多说了。

你可以先把之前my-default文件备份下来。

用记事本打开my-default.ini，我把里面的注释全部删掉之后，我最后的配置文件是这样的

	[client]
	port=3306
	default-character-set=utf8
	[mysqld]
	basedir=D://mysql-5.7.14-winx64
	datadir=D://mysql-5.7.14-winx64//data
	port=3306
	character-set-server=utf8
	[mysql]
	default-character-set=utf8

然后把他命名为my.ini保存在根目录下

![这里写图片描述](http://img.blog.csdn.net/20170603222949232?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

再把my.ini拷贝一份到bin目录下。

### 第三步 配置mysql服务

win+r命令行窗口（**以管理员身份运行**）
	
	 D:

回车
	
	cd D:\mysql-5.7.14-winx64\bin

注意把路径改成你的mysql\bin目录

	mysqld --install

![这里写图片描述](http://img.blog.csdn.net/20170604175420760?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

会出现`Service successfully installed.`

这个时候如果输入net start mysql会出现无法启动。原因是还没有初始化

初始化前一定要把data里的错误日志全部删掉。

![这里写图片描述](http://img.blog.csdn.net/20170604175603787?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

删掉之后，输入

	mysqld --initialize

![这里写图片描述](http://img.blog.csdn.net/20170604175731339?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

稍等几秒之后初始化完成，这时候再输入`net start mysql` 服务成功启动。

关闭命令行窗口，回到workbench，双击这个连接。

![这里写图片描述](http://img.blog.csdn.net/20170604180101246?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

你会发现你根本不知道密码是什么。我们来把root localhost的密码设置一下 设置成123456。

打开cmd(管理员权限)，进到你的mysql安装目录\bin

	mysqld --skip-grant-tables

![这里写图片描述](http://img.blog.csdn.net/20170604180358813?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

然后把mysql服务关掉！重新打开一个cmd窗口，进到mysql安装目录\bin直接输入`mysql`，记住一定要关掉服务 不然会出现`Can't connect to MySql server on 'localhost'` 错误

![这里写图片描述](http://img.blog.csdn.net/20170604181036440?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![这里写图片描述](http://img.blog.csdn.net/20170604180927212?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

	 use mysql;

![这里写图片描述](http://img.blog.csdn.net/20170604181128643?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

	show tables;

![这里写图片描述](http://img.blog.csdn.net/20170604181216300?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

最下面可以看到一个user表

	select host,user,authentication_string from user;

![这里写图片描述](http://img.blog.csdn.net/20170604181308284?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

密码是md5加密的，你当然看不到，但是你可以改变他

	update user set authentication_string=password('123456') where user='root' and host='localhost';


![这里写图片描述](http://img.blog.csdn.net/20170604181517692?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

直到这一步，修改成功！

回到workbench，双击那个连接 你已经可以进行你的数据库操作了。