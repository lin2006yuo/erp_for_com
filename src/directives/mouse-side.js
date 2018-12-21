function validate(binding) {
    if (typeof binding.value !== 'function') {
        console.warn('[Vue-mouse-side:] provided expression', binding.expression, 'is not a function.')
        return false
    }

    return true
}

function isPopup(popupItem, elements) {
    if (!popupItem || !elements)
        return false;

    for (let i = 0, len = elements.length; i < len; i++) {
        try {
            if (popupItem.contains(elements[i])) {
                return true
            }
            if (elements[i].contains(popupItem)) {
                return false
            }
        } catch(e) {
            return false
        }
    }

    return false
}
const mouseEvents = [
    'mousewheel',
    'mouseenter',
    'mouseout',
    'mouseover'
];
const check = (events) =>{
    if(events.length <=0){
        console.warn('[Vue-mouse-side:] provided modifiers is not valid mouse event.')
        return false;
    }
    let err = null;
    if(err = events.find(e => !mouseEvents.includes(e))){
        console.warn('[Vue-mouse-side:] provided modifiers', e, 'is not valid mouse event.')
        return false;
    }
    return true;
};

function isAutoPicker(el){
    if(!el)return false;

    if(el.classList){
        const isFind = ['el-select-dropdown','el-picker-panel','el-date-picker'].find(className =>{
            return el.classList.contains(className)
        });
        if(isFind){
            return true;
        }
    }
    return isAutoPicker(el.parentNode);
}

export default function(Vue){
    Vue.directive('mouse-side',{
        bind: function (el, binding, vNode) {
            let events = Object.keys(binding.modifiers);
            if(!check(events)) return;
            if (!validate(binding)) return;
            events.forEach(event=>{
                const eventHandle = `__vueMouse${event}__`;
                // Define Handler and cache it on the element
                function handler(e) {
                    if (!vNode.context) return

                    // some components may have related popup item, on which we shall prevent the click outside event handler.
                    let elements = e.path || (e.composedPath && e.composedPath())
                    elements && elements.length > 0 && elements.unshift(e.target)

                    if (el.contains(e.target) || isPopup(vNode.context.popupItem, elements)) return;
                    if(isAutoPicker(e.target))return;

                    el[eventHandle].callback(e)
                }

                // add Event Listeners
                el[eventHandle] = {
                    handler: handler,
                    callback: binding.value
                };
                // !vNode.componentInstance.$isServer &&
                document.addEventListener(event, handler)
            })
        },

        update: function (el, binding) {
            if (validate(binding)){
                let events = Object.keys(binding.modifiers);
                events.forEach(event=> {
                    const eventHandle = `__vueMouse${event}__`;
                    el[eventHandle].callback = binding.value
                });
            }
        },

        unbind: function (el, binding, vNode) {
            // Remove Event Listeners
            //!vNode.componentInstance.$isServer &&
            let events = Object.keys(binding.modifiers);
            events.forEach(event=> {
                const eventHandle = `__vueMouse${event}__`;
                document.removeEventListener(event, el[eventHandle].handler);
                delete el[eventHandle]
            });

        }
    })
};