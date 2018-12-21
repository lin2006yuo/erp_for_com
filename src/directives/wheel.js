/**
 * Created by Administrator on 2017/7/14.
 */
export default function(Vue){
    Vue.directive('scroll', {
        bind(el,bind) {
            let speed =parseInt(bind.value||1);
            el.addEventListener('mousewheel',function(e){
                let direction = e.deltaY>0?'down':'up'
                let zoom = parseInt(el.style.zoom,10)||100;
                zoom += e.wheelDelta /speed;
                if(zoom > 0){
                    el.style.zoom=zoom+'%';
                }
              return false
            })
        }
    });
};