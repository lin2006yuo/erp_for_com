/**
 * Created by RondaFul on 2017/6/13.
 */

export default function(Vue){
    Vue.directive('menu-context', {
        bind(el, bind, vnode){
            if(bind.value instanceof Array){
                function mousedown (e){
                    if(e.button !==2)return;
                    e.preventDefault();
                    let ul = null;
                    if(ul = document.getElementById('v-context-menu')){
                        ul.remClick();
                        ul.parentNode.removeChild(ul);
                    }
                    el.oncontextmenu = (env)=>{
                        env.preventDefault();
                        return false};
                    ul = document.createElement('ul');
                    ul.setAttribute('id', 'v-context-menu');
                    bind.value.forEach(menu =>{
                        let li = document.createElement('li');
                        li.innerHTML = menu.label;
                        li.addEventListener('mousedown', ()=>{
                            menu.action.call(vnode.context);
                            ul.parentNode.removeChild(ul);
                        });
                        ul.appendChild(li);
                    });
                    const rect = el.getBoundingClientRect();
                    ul.style.left = e.pageX+"px";
                    ul.style.top = e.pageY+"px";
                    document.body.appendChild(ul);
                    ul.addClick(()=>{
                        if(ul = document.getElementById('v-context-menu')){
                            ul.remClick();
                            ul.parentNode.removeChild(ul);
                        }
                    });
                }
                el.__MOUSE_DOWN__ = mousedown;
                function mouseup(e){
                    if(e.button !== 2){
                        return;
                    }
                    el.oncontextmenu = (env)=>{
                        env.preventDefault();
                        return true;};
                }
                el.__MOUSE_UP__ = mouseup;
                el.addEventListener('mousedown', mousedown);
                el.addEventListener('mouseup',mouseup);
            }else{
                console.warn('v-menu-context value must Array');
            }
        },
        update(el, bind, vnode){
            bind.def.unbind(el,bind,vnode);
            if(bind.value instanceof Array){
                function mousedown (e){
                    if(e.button !==2)return;
                    e.preventDefault();
                    let ul = null;
                    if(ul = document.getElementById('v-context-menu')){
                        ul.remClick();
                        ul.parentNode.removeChild(ul);
                    }
                    el.oncontextmenu = (env)=>{
                        env.preventDefault();
                        return false};
                    ul = document.createElement('ul');
                    ul.setAttribute('id', 'v-context-menu');
                    bind.value.forEach(menu =>{
                        let li = document.createElement('li');
                        li.innerHTML = menu.label;
                        li.addEventListener('mousedown', ()=>{
                            menu.action.call(vnode.context);
                            ul.parentNode.removeChild(ul);
                        });
                        ul.appendChild(li);
                    });
                    const rect = el.getBoundingClientRect();
                    ul.style.left = e.pageX+"px";
                    ul.style.top = e.pageY+"px";
                    document.body.appendChild(ul);
                    ul.addClick(()=>{
                        if(ul = document.getElementById('v-context-menu')){
                            ul.remClick();
                            ul.parentNode.removeChild(ul);
                        }
                    });
                }
                el.__MOUSE_DOWN__ = mousedown;
                function mouseup(e){
                    if(e.button !== 2){
                        return;
                    }
                    el.oncontextmenu = (env)=>{
                        env.preventDefault();
                        return true;};
                }
                el.__MOUSE_UP__ = mouseup;
                el.addEventListener('mousedown', mousedown);
                el.addEventListener('mouseup',mouseup);
            }else{
                console.warn('v-menu-context value must Array');
            }
        },
        unbind(el, bind){
            if(el.__MOUSE_DOWN__){
                el.removeEventListener('mousedown',el.__MOUSE_DOWN__);
                delete el.__MOUSE_DOWN__;
                el.removeEventListener('mouseup',el.__MOUSE_UP__);
                delete el.__MOUSE_UP__;
            }
        },
    })
};