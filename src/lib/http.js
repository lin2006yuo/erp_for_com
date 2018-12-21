/**
 * Created by wcg on 16-10-14.
 */

import {authorization} from '../auth';

function http(method, url, data, header  = {contentType:'application/x-www-form-urlencoded'}) {
    data = data || {};
    return new Promise((succ,fail)=>{
        let req = null;
        let formData = null;
        switch (method.toUpperCase()){
            case 'GET':
                req = new Request(obj2geturl(url, data), {method:method,
                    headers:{
                        'Authorization': authorization(),
                        'Lang' : sessionStorage.getItem('lang') || 'zh'
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
                req = new Request(url, {
                    method:method,
                    headers: {
                        'Lang' : sessionStorage.getItem('lang') || 'zh',
                        "Content-Type": header.contentType,
                        'Authorization': authorization()
                    },
                    mode:'cors',
                    body:body
                });
                break;
        }

        req && fetch(req).then(res=>{
            if(200 === res.status){
                res.json().then(json=>{
                    succ(json);
                }).catch(error =>{
                    fail(error, res.status);
                })
            }else{
                res.json().then(json=>{
                    fail(json, res.status);
                }).catch(error =>{
                    fail(error, res.status);
                })
            }

        }).catch(function(){
            fail(...arguments)
        })
    })
}
window.http = http;
export default http;

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
    // xhr.overrideMimeType('text/xml');
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

const EL_ID_NAME = "__download__file";
export const postDLFile = function(options){
    let xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
    let url = options.url+'?' + obj2url(options.get || {});
    xhr.open(options.method || "get", url, true);
    xhr.setRequestHeader('Authorization', authorization());
    xhr.responseType = "blob";//这里是关键，它指明返回的数据的类型是二进制
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    const params = options.params || {};
    let json = Object.keys(params).map(key =>{
        const val = params[key];
        return `${key}=${JSON.stringify(val)}`;
    });
    xhr.send(json.join('&'));
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
