/**
 * Created by wuchuguang on 17-7-4.
 */

export default function(Vue){
    const defReg = /^offset(.*)/;
    Vue.directive('cstyle', function(el,bind,vnode){
        let style = window.getComputedStyle(el,"");
        let rect = el.getBoundingClientRect();
        let r = false;
        if(isObjectValueEqual(bind.modifiers, Object.create(null))){
            for(let i in bind.value){
                if(bind.value.hasOwnProperty(i)){
                    Vue.set(bind.value, i, style[i.toHorizontal()]);
                }
            }
        }else{
            for(let i in bind.modifiers){
                if(defReg.test(i)){
                    r = defReg.exec(i);
                    Vue.set(bind.value, r[1], rect[r[1]]);
                }else{
                    Vue.set(bind.value, i, style[i]);
                }
            }
        }
    });
};