/**
 * Created by RondaFul on 2017/3/22.
 */
export default function(Vue){
    Vue.directive('dragmove', {
        bind(el, bind, vnode){
            el.style.position = 'absolute';
            el.addEventListener('mousedown', bind.def.mousedown)
        },
        unbind(el, bind){
            el.removeEventListener('mousedown', bind.def.mousedown);
        },
        mousedown(e){
            e= e||event;
            let This = this;
            let s = This.style;
            let p = 'onmousemove';
            let x=e.clientX-this.offsetLeft;
            let y=e.clientY-this.offsetTop;
            document[p]=function(e){
                e=e||event;
                let ox=e.clientX-x;
                let oy=e.clientY-y;
                if(ox<0) ox=0;
                if(oy<0) oy=0;
                if(oy>document.documentElement.clientHeight-This.offsetHeight){
                    oy=document.documentElement.clientHeight-This.offsetHeight;}
                if(ox>document.documentElement.clientWidth-This.offsetWidth) {
                    ox=document.documentElement.clientWidth-This.offsetWidth;}
                s.left=e.clientX-x+'px';
                s.top=e.clientY-y+'px';
            };
            document.onmouseup=function(){document[p]=null}
        }
    });
};