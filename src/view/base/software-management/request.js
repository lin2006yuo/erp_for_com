import {authorization} from '../../../auth';

export const httpFile = (request, data = {}, header  = {contentType:'application/x-www-form-urlencoded'}) => {
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
                delete headers["Content-Type"];
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
