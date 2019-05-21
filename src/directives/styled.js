/**
 * Created by wuchuguang on 17-7-4.
 */

const RECT = ['top','left','right','bottom'];
const CSS = ['width','height'];

export default function(Vue){
    Vue.directive('styled',{
        bind(el,bind){
            let style = window.getComputedStyle(el);
            let rect = el.getBoundingClientRect();
            RECT.forEach(r =>{
                Object.defineProperty(bind.value, r, {
                    get(){
                        return rect[r];
                    }
                })
            });
            CSS.forEach(c =>{
                Object.defineProperty(bind.value, c, {
                    get(){
                        return style[c];
                    }
                })
            })
        },
    });
};