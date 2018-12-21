/**
 * Created by RondaFul on 2017/6/13.
 */

const getSelection = () =>{
    if(window.getSelection){
        return window.getSelection();
    }
    if(document.selection){
        return document.selection;
    }
};
export default function(Vue){
    Vue.directive('copy', {
        bind(el, bind, vnode){
            let copy= (event) =>{
                bind.def.runs(el,bind)
            }
            bind.def.copy=copy;
            el.addEventListener("dblclick",copy)
        },
        unbind(el, bind){
            el.removeEventListener('dblclick', bind.def.func);
        },
        copyElement(el){
            let selection = getSelection();
            selection.selectAllChildren(el);
            document.execCommand("Copy");
        },
        runs(el,bind){
            switch (el.tagName.toUpperCase()){
                case "TEXTAREA":
                    el.select();
                    document.execCommand("Copy");
                    break;
                case "INPUT":
                    el.select();
                    document.execCommand("Copy");
                    break;
                default:
                    bind.def.copyElement(el);
                    break;
            }
        }
    })
};