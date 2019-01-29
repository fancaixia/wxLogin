### 微信小程序登录流程+node  

![https://github.com/fancaixia/wxLogin/blob/master/pic/001.png](https://github.com/fancaixia/wxLogin/blob/master/pic/001.png)

### 前台思路：

1. 进入登录页面后调取wx.login  获取code

2. 点击 ‘新年祝福’按钮让用户授权登录

3. 点击取消授权则停在登录页面	

4. 授权成功前台调用wx.request  向后台发送code，rawData ( 授权成功返回值 )，signature ( 授权成功返回值 )  获取tocken

### 后台思路：

**注：为了前台演示方便，本项目不涉及数据库，将数据存在node服务端----模拟数据库存储**

**/api/login  登录接口**

1. 调用微信api接口jscode2session 传递参数 code（前台传递），appid（小程序id），secret（小程序密钥），grant_type（微信授权默认：authorization_code）获取openid 和session_key

2. 使用 前台传入的rawData ( 微信授权返回值 )和openid 生成 token  

3. 数据库中查找 openid ，没有就插入{openid ， token, session_key } 

4. 数据库存在 openid ，那么更新数据库openid对应token

5. 返回token到前台


**/api/bless  数据列表  前台传入需token和openid**

1. 检测token，数据库中查找 token（前台传入） ，数据库没有对应token  就返回前台token失效（前台返回登录页面）

2. 数据库存在 token ，那么就使用token解密


### 项目启动

wx_server 为服务端 ， wx_static  为小程序端

若要演示登录全过程以及登录成功后  请求其他接口时后端检测token 是否合法， 则需要启动node

1. cd / wx_server

2. npm / cnpm   install   ( 安装依赖 ）

3. node app   

**前台**

1. cd / wx_static   修改config.js 中 serverHost对应IP为本机IP



**注：node服务端使用 jsonwebtoken  生成token, 想了解过期时间以及token其他信息推荐文章**[https://ninghao.net/blog/2834](https://ninghao.net/blog/2834)
