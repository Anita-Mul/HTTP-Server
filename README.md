## HTTPServer
使用 Nodejs 编写，基于RESTful约定的 HTTPServer，目前支持：
 -  请求：GET、POST、PUT、DELETE、OPTIONS  ✨
 - 状态码：200 201 206 304 400 401 403 404 500 ✨
 - 头部：If-None-Match、Content-Length、Range、Cookie、Authorization、Cache-Control、If-None-Match、Content-Range、WWW-Authenticate、Last-Modified、Access-Control-Allow-Origin、Access-Control-Allow-Method、Access-Control-Allow-Credential ✨
 - HTTP 鉴权（Session 和 Cookie）✨
 - 浏览器跨域访问 ✨
 - 浏览器缓存控制 ✨
## Usage
#### **启动**
```bash
node main.js
```

#### 测试用户身份验证
 - 用户名：admin
 - 密码：123456

![在这里插入图片描述](https://img-blog.csdnimg.cn/9f0f3565c4504ca5aa26ee3950077fa7.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQW5pdGEtU3Vu,size_20,color_FFFFFF,t_70,g_se,x_16)


#### **测试 `CORS` 请求** 
 - 💙 在本地配置主机和IP地址的映射

![在这里插入图片描述](https://img-blog.csdnimg.cn/55c925041fdc44129869c32f12612474.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQW5pdGEtU3Vu,size_19,color_FFFFFF,t_70,g_se,x_16)
 - 💛	修改 `www/a.html` 文件中请求方法为 `GET`
	```javascript
	xhr.open('GET', 'http://b.com/test.txt', true);
	```
 - 💜 打开 `http://a.com/a.html`

![在这里插入图片描述](https://img-blog.csdnimg.cn/a8853b25b7ab402a965a5f1611dba9f0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQW5pdGEtU3Vu,size_20,color_FFFFFF,t_70,g_se,x_16)


#### **测试 `CORS` 预检请求** 
 - 💙 修改 `www/a.html` 文件中请求方法为 `PUT`
	```javascript
	xhr.open('PUT', 'http://b.com/test.txt', true);
	```
 - 💚 打开 `http://a.com/a.html`

	![在这里插入图片描述](https://img-blog.csdnimg.cn/3fa33ae2ffbe401bb650fc37c2187571.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQW5pdGEtU3Vu,size_20,color_FFFFFF,t_70,g_se,x_16)


#### **测试 `GET` 请求** 
 - 💚 访问 `http://localhost/`

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/d93cead563224193a1628efb1374dd14.png)
 - 💛 访问 `http://localhost/test.txt`

	![在这里插入图片描述](https://img-blog.csdnimg.cn/82d12a17b8814b3d853ba89cf5ab0cbc.png)
 - 💜 访问 `http://localhost/test.txt`，添加头部`Range: bytes=1-2`

	![在这里插入图片描述](https://img-blog.csdnimg.cn/9f2e3472be164e30b72e8a30248ec432.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQW5pdGEtU3Vu,size_20,color_FFFFFF,t_70,g_se,x_16)
 - 💙 访问 `http://localhost/hello.txt`

![在这里插入图片描述](https://img-blog.csdnimg.cn/715f229d601542078aa0ca756b0d5e63.png)


#### **测试 `POST` 请求** 
 - 💛 创建一个文件 `http://localhost:80/Cat.txt`

![在这里插入图片描述](https://img-blog.csdnimg.cn/b590d7e81ef1498bb6f25cd9b614a6af.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQW5pdGEtU3Vu,size_20,color_FFFFFF,t_70,g_se,x_16)
 - 💚 若再次创建相同文件 `http://localhost:80/Cat.txt`

![在这里插入图片描述](https://img-blog.csdnimg.cn/3f76d5e1291b431bb257cde58f6bc304.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQW5pdGEtU3Vu,size_20,color_FFFFFF,t_70,g_se,x_16)
 - 💙 如果存在相对路径

![在这里插入图片描述](https://img-blog.csdnimg.cn/df706bd4dcac49aeb3a48ae9088f8b56.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQW5pdGEtU3Vu,size_20,color_FFFFFF,t_70,g_se,x_16)


#### **测试 `PUT` 请求** 
 - 💛 修改 Cat.txt 文件内容 `http://localhost:80/Cat.txt`

#### **测试 `DELETE` 请求**
 - 💜 删除 Cat.txt 文件 `http://localhost:80/Cat.txt`


#### 测试缓存控制
 - 💚 第一次访问`http://localhost/test.txt`

![在这里插入图片描述](https://img-blog.csdnimg.cn/0523934f11974a2c81fbc62adb881f34.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQW5pdGEtU3Vu,size_20,color_FFFFFF,t_70,g_se,x_16)
 - 💙 第二次访问`http://localhost/test.txt`

![在这里插入图片描述](https://img-blog.csdnimg.cn/234633ea7d4741e9a0e581b0451fda41.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQW5pdGEtU3Vu,size_20,color_FFFFFF,t_70,g_se,x_16)

