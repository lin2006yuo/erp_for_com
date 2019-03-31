/**
 * Created by RondaFul on 2017/4/1.
 */
import Vue from "vue"
export default function(Vue){
    Vue.directive('resize', {
        bind(el, bind, vnode){
            Vue.nextTick(_=>{
                let func = (event) =>{               
                    bind.def.runs(bind,el);
                };
                bind.def.func = func;
                window.addEventListener('resize', func);
                bind.def.runs(bind,el);
            })
        },
        runs(fun,el){
                let query =fun.def.query(el, fun.value);
                let body=document.getElementsByTagName("body")[0]
                let height=body.getBoundingClientRect().height;
                let less=0;
                if( fun.value.height){
                    less=fun.value.height;
                }
                let top= fun.def.getPoint(query)
                let hei=height- top-less;
                query.style.height =hei+"px";
                let child=query.querySelector(".el-table__body-wrapper")
                if(child){
                    let table_head=query.querySelector(".el-table__header-wrapper")
                      let table_head_height=(parseInt(window.getComputedStyle(table_head).height)||29)+2;
                    child.style.height =hei-table_head_height+"px";
                }
        },
        componentUpdated(el,bind,vnode){
            if (el.timer){
                clearTimeout(el.timer);
				el.timer=null;
            }
            
            el.timer = setTimeout(() =>{
                bind.def.runs(bind,el);
            }, 1000);
        },
        query(el, selector){
            if(selector.id){
                return document.getElementById(selector.id)
            }
            if(selector.class){
                let names=selector.class.replace(/\s+/g,".")
                let name="."+names;
                return el.querySelector(name);
            }
            return el;
        },
        getPoint(obj) {
            var t = obj.offsetTop;
            var l = obj.offsetLeft;
            while (obj = obj.offsetParent) {
                t += obj.offsetTop;
                l += obj.offsetLeft;
            }
            return t
        },
        unbind(el, bind, vnode){
            window.removeEventListener('resize', bind.def.func);
        }
    });
};
