/**
 * Created by wuchuguang on 16-11-3.
 */

export default function(Vue){
    Vue.directive('drag2',{
        bind(el,bind,vnode){
            el.setAttribute('draggable', "true");
            el.style.webkitUserDrag='element';
            el.selectstart = function(ev){
                return true;
            };
            el.addEventListener('selectstart',el.selectstart);
            el.dragstart = function(ev){
                ev.dataTransfer.effectAllowed = "move";
                ev.dataTransfer.setData("text", ev.target.innerHTML);
                ev.dataTransfer.setDragImage(ev.target, 0, 0);
                bind.def.origin= ev.target;
                return true;
            };
            el.addEventListener('dragstart',el.dragstart);
            el.dragover = function(ev){
                if (ev.dataTransfer) {
                    ev.dataTransfer.dropEffect = 'move';
                }
                ev.preventDefault();
                return true;
            };
            el.addEventListener('dragover',el.dragover);
            el.dragenter = function(ev){
                return true;
            };
            el.addEventListener('dragenter',el.dragenter);
            el.drop = function(ev){
                /*拖拽元素进入目标元素头上，同时鼠标松开的时候*/
                ev.preventDefault();
                ev.stopPropagation();
                if (bind.def.origin) {
                    const origin = getParam(bind.def.origin);
                    const target = getParam(ev.target);
                    bind.value.call(vnode.context, origin, target);
                }
                return false;
            };
            el.addEventListener('drop',el.drop);
        },
        update(el,bind,vnode){
        },
        unbind(el,bind,vnode){
            console.log(`unbind`);
            el.removeEventListener('selectstart',el.selectstart);
            el.removeEventListener('dragstart',el.dragstart);
            el.removeEventListener('dragend',el.dragend);
            el.removeEventListener('dragover',el.dragover);
            el.removeEventListener('dragenter',el.dragenter);
            el.removeEventListener('drop',el.drop);
            el.removeAttribute('draggable');
        }
    });
};

function getParam(element){
    if(element.dataset.param === undefined){
        return getParam(element.parentNode);
    }else{
        return element.dataset.param;
    }
}