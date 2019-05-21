/**
 * Created by wuchuguang on 16-11-3.
 */

function defFun(ev) {
    //拖拽效果
    ev.dataTransfer.effectAllowed = "move";
    ev.dataTransfer.mozCursor='move';
    ev.dataTransfer.setData("text", ev.target.innerHTML);
    ev.dataTransfer.setDragImage(ev.target, 0, 0);
    return true;
}
export default function(Vue){
    Vue.directive('drag',{
        bind(el,bind,vnode){
            let browser=myBrowser();
            el.style.webkitUserDrag='element';
            el.setAttribute('draggable',true);
            el.addEventListener('dragstart',defFun);
            el.addEventListener('drag', defFun);
                function dragover(ev){
                if (ev.dataTransfer) {
                    ev.dataTransfer.dropEffect = 'move';
                }
                ev.preventDefault();
                return true;
            };
                bind.def.dragover=dragover;
            el.addEventListener('dragover',dragover);
           function drop(ev){
                ev.preventDefault();
                ev.stopPropagation();
               bind.def.target=document.elementFromPoint(ev.pageX,ev.pageY)
            }
            browser==='Firefox'&&el.addEventListener('drop',drop);
            function drag(event) {
                event.stopPropagation();
                event.preventDefault();
                switch (typeof bind.value){
                    case 'function':
                        bind.value.call(vnode.context, el, event);
                        break;
                    case 'object':
                        if(browser==='Firefox'){
                            bind.def.target&&bind.value.func.call(vnode.content, el, bind.value.params,bind.def.target);
                            bind.def.target&&(bind.def.target=null);
                        }else {
                            let target=document.elementFromPoint(event.pageX,event.pageY);
                            bind.value.func.call(vnode.content, el, bind.value.params,target);
                        }

                        break;
                }
            }
            bind.def.drag = drag;
            el.addEventListener('dragend', bind.def.drag);
        },
        update(el,bind,vnode){
        },
        unbind(el,bind,vnode){
            el.style.webkitUserDrag='none';
            el.removeAttribute('draggable');
            el.removeEventListener('dragstart', defFun);
            el.removeEventListener('dragover',bind.def.dragover);
            el.removeEventListener('drag',defFun);
            el.removeEventListener('dragend',bind.def.drag);
            myBrowser()==='Firefox'&&el.removeEventListener('drop',el.drop);
        }
    });
};

function myBrowser(){
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if (userAgent.indexOf("Firefox") > -1) {
        return "Firefox";
    }
    if (userAgent.indexOf("Chrome") > -1){
        return "Chrome";
    }
    if (userAgent.indexOf("Opera") > -1) {
        return "Opera";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 &&userAgent.indexOf("Opera") ===-1) {
        return "IE";
    }; //判断是否IE浏览器
};