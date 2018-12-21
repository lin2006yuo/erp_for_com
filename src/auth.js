/**
 * Created by wuchuguang on 16-12-9.
 */

export const auth = function(){
    return new Promise((succ,fail) =>{
        if(!!window.sessionStorage.getItem('Authorization')){
            succ();
        }else{
            fail();
        }
    });
};

export const quit = function(){
    window.sessionStorage.removeItem('Authorization');
};

export const authorization = function(){
    return window.sessionStorage.getItem('Authorization') || "";
};

export const set_authorization = function(auth){
    window.sessionStorage.setItem('Authorization', auth);
};

export const make_auth = function(){
    let timer = null;
    return new Promise((succ,fail)=>{
        function is_auth(){
            return !!window.sessionStorage.getItem('Authorization')
        }
        if(is_auth()){
            succ();
        }else{
            let doo = ()=>{
                if(is_auth()){
                    clearInterval(timer);
                    succ();
                }
            };
            timer = setInterval(doo,100);
        }
    });
};
