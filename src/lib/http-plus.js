/**
 * Created by wcg on 16-10-14.
 */

import {authorization} from '../auth';

export const http = (request, data = {}, header  = {contentType:'application/x-www-form-urlencoded'}) => {
    let start = Date.now();
    let [method, url] = request.split('|');
    if(!url){
        method = 'get';
        url = method;
    }
    url = `${config.apiHost}${url}`;
    data = data || {};
    return new Promise((succ,fail)=>{
        let req = null;
        let formData = null;
        switch (method.toUpperCase()){
            case 'GET':
                req = new Request(obj2geturl(url, data), {method:method,
                    headers:{
                        'Authorization': authorization(),
                        'Lang':sessionStorage.getItem('lang')||'zh'
                    },
                    mode:'cors'});
                break;
            default:
                let body = '';
                switch(header.contentType){
                    case 'urlencoded':
                    case 'application/x-www-form-urlencoded':
                        body = obj2url(data);
                        break;
                    case 'json':
                    case 'application/json':
                        body = obj2json(data);
                        break;
                    case 'form':
                    case 'multipart/form-data':
                        let formData = new FormData;
                        for(let i in data){
                            if(data.hasOwnProperty(i)){
                                formData.append(i, data[i]);
                            }
                        }
                        body = formData;
                        break;
                    default:
                        console.error(`fetch contentType not support ${header.contentType}`)
                }
                let headers={
                    "Content-Type": header.contentType,
                    'Authorization': authorization(),
                    'Lang':sessionStorage.getItem('lang')||'zh'
                };
                delete header.contentType;
                Object.assign(headers,header);
                delete headers.timeout;
                req = new Request(url, {
                    method:method,
                    headers,
                    mode:'cors',
                    body:body
                });
                break;
        }

        let timeout;
        if(header.timeout !== INFINITE){
            timeout = setTimeout(() => {
                let end = Date.now();
                let error = `请求超时${end - start}毫秒 API:${method}|${url}`;
                fail(error);
                console.error(error)
            }, header.timeout || 30000);
        }
        req && fetch(req).then(async res=>{
            timeout && clearTimeout(timeout);
            if(200 === res.status){
                try{
                    const json = await res.json();
                    succ(json);
                }catch (e) {
                    console.error(e);
                    if(e instanceof Error){
                        fail(e.message);
                    }else{
                        fail(e);
                    }
                }
            }else{
                clearTimeout(timeout);
                try{
                    const json = await res.json();
                    fail(json, res.status);
                }catch(e){
                    console.error(res.statusText,res.status);
                    fail(`${res.statusText} ${res.status}`);
                }
            }

        }).catch(error=>{
            clearTimeout(timeout);
            fail(error)
        })
    })
};

export const upload = function (options) {
    options.url = options.url || new Error('not upload url');
    options.files = options.files || new Error('not upload file');
    let emptyFun = function(){};
    options.progress = options.progress || emptyFun;
    options.begin = options.begin || emptyFun;
    return new Promise((succ,fail)=>{
        let form = new FormData(); // FormData 对象
        form.append("files", options.files); // 文件对象

        xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
        xhr.open("post", options.url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        let uploadComplete = function(){
            succ();
        };
        xhr.onload = uploadComplete; //请求完成
        let uploadFailed = function(){
            fail();
        };
        xhr.onerror =  uploadFailed; //请求失败
        xhr.upload.onprogress = options.progress;//【上传进度调用方法实现】
        xhr.upload.onloadstart = options.begin;
        xhr.send(form); //开始上传，发送form数据
    })
};

export const downloadFile = function(options){
    let xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
    let url = options.url+'?' + obj2url(options.get || {});
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Authorization', authorization());
    xhr.responseType = "blob";//这里是关键，它指明返回的数据的类型是二进制
    xhr.send();
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = xhr.response;
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
            var link = document.createElement('a');
            link.download = options.fileName+options.suffix;
            link.href = URL.createObjectURL(response);
            link.dispatchEvent(evt);
        }
    }
};
