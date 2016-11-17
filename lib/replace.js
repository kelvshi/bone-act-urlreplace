// 存储runtime，便于在全局使用一些bone的工具
var runtime, fs, bone;


// 生成新的url
function generateUrl(path, hash, prefix) {
    var newpath = path.replace(/(.+)\.(.+)/g, "$1_"+ hash +".$2");
    // 根据hash值来选择用哪个前缀，负载均衡
    var prefix_index = 0;
    var hash_total = 0;
    for (var i = 0; i < hash.length; i++) {
        hash_total += hash[i].charCodeAt();
    }
    prefix_index = hash_total % prefix.length;
    return prefix[prefix_index] + newpath;
}
// 替换url
function replaceUrl(fileContent, regpre, prefix, ext, version) {
    bone.log.log("正在替换 " + runtime.source + ' 中的url');
    var format = fileContent;
    var success = 0;
    var successmsg = '';
    var fail = 0;
    var failmsg = '';
    // 支持的扩展名
    var exts = ext.join("|");
    var reg = new RegExp("(href=(\"|\')" + regpre + "(.+).css(\"|\'))|(src=(\"|\')" + regpre + "(.+)(" + exts + ")(\"|\'))", 'g');
    var urls = fileContent.match(reg);
    for (var i = 0; i < urls.length; i++) {
        // 提取引号里面的部分
        var oldUrl = urls[i].replace(/([^\?]*)(\"|\')+([^\?]*)(\"|\')+/g, '$3');
        var key = oldUrl.replace(regpre, '/');

        
        if(version[key]) {
            var newUrl = generateUrl(key, version[key], prefix);
            format = format.replace(oldUrl, newUrl);
            success++;
            successmsg += ('\n' + key + '替换成功');
        } else {
            fail++;
            failmsg += ('\n' + key + '未找到对应的version, 替换失败');
        }
    }
    if(success > 0) {
        //bone.log.log('替换成功: ' + success + successmsg);
    }
    if(fail > 0) {
        //bone.log.warn('替换失败: ' + fail + failmsg);
    }
    return format;
}


module.exports.act = function(buffer, encoding, callback) {
    runtime = this;
    fs = runtime.fs;
    bone = runtime.bone;

    var fileInfo = runtime.sourceParsed;
    var content = buffer.toString();
    var options = this.options({
        regPre: '\/static\/', // 匹配文中url正则的前缀
        ext: ['jpg', 'png', 'gif', 'bmp', 'js', 'swf', 'css']
    });
    var tplPath = fs.pathResolve(options.templatePath);

    // 如果文件在定义的路径中，则替换url
    if(fileInfo.dir.indexOf(tplPath) > -1) {
        // 判断version是否存在
        var versionPath = options.versionPath;
        if(fs.existFile(versionPath)) {
            var version = require(fs.pathResolve(options.versionPath));
            content = replaceUrl(content, options.regPre, options.prefix, options.ext, version);
        } else {
            bone.log.error(versionPath + "文件不存在，请先生成");
            callback(null, content);
            return false;
        }
    }
    callback(null, content);
}

module.exports.filter = {};