# bone-act-urlreplace
为bone开发的替换html文件中静态资源url的处理器

## 关于bone
bone 是一个高效的前端开发工具，它可以完成前端工程中相关的编译、压缩、版本控制、打包等相关工作，它同时具备实用的插件开发功能，可以自主开发处理器来完成自己的需求。详见文档 [bone 新手入门](http://wyicwx.github.io/bone/docs/get_started.html)

## 关于bone-act-urlreplace
为bone开发的处理器，可以按给定的规则替换模板文件或html中的静态资源，eg:
> /static/images/demo.jpg => http://res1.cdn.com/static/images/demo_hash.jpg

### 安装
```javascript
 npm install bone-act-urlreplace
```

### 使用
注：在此之前，你必须熟悉bone
```javascript
// 通过bone加载
var bone = require('bone');
var urlreplace = bone.require('bone-act-re');
// 通过bone act 处理
bone.dest('js/pages')
    .act(res({
    	prefix: [
    		'http://res1.cdn.cn/static',
    		'http://res2.cdn.cn/static',
    		'http://res3.cdn.cn/static',
    		'http://res4.cdn.cn/static',
    		'http://res5.cdn.cn/static'
    	], // url的前缀，有多个cdn可配置多个
        templatePath: '~/src/template/', // 要替换的文件路径
        versionPath: '~/dist/version.json', // 带有静态资源hash值信息的文件
        regPre: '\/static\/' // 匹配文中url正则的前缀
    }), {global: true});
```

### 配置说明
参数 | 说明 | 缺省值
------------ | ------------- | ------------
prefix | 必填，数组，替换后的url前缀，可配置多个域名，最大限度利用http请求资源的并发数 | 无
templatePath | 必填，支持bone的路径格式，要处理的文件所在的路径 | 无
versionPath | 必填，记载着要替换文件的hash值所在的version文件 | 无
regPre | 模板文件中静态资源的统一前缀 | /static/
ext | 数组，要替换的扩展名 | ['jpg', 'png', 'gif', 'bmp', 'js', 'swf', 'css']

