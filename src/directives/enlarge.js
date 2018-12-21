/**
 * Created by RondaFul on 2017/7/10.
 */
/**
 * Created by RondaFul on 2017/6/13.
 */
    function moveEvent(el,down,move,param,lockX,lockY) {
        lockX&&moveX(el,down,move,param);
        lockY&&moveY(el,down,move,param);
};
    function moveX(el,down,move,param) {
        if(down.layerX<=5){
            let disT=param.left+move.clientX-down.clientX;
            let  maxT=param.left+param.width-param.minW;
            disT<=0&&(disT=0);
            disT>=maxT&&(disT=maxT);
            el.style.width=param.width+param.left-disT+"px";
            el.style.left=disT+"px"
        }else {
            let disY=param.width+move.clientX-down.clientX;
            let maxW=param.maxW-param.left;
            disY<=20&&(disY=20);
            disY>=maxW&&(disY=maxW);
            el.style.width=disY-2+"px"
        }
    };
    function moveY(el,down,move,param) {
        if(down.layerY<=5){
            let disT=param.top+move.clientY-down.clientY;
            let  maxT=param.top+param.height-param.minH;
            disT<=0&&(disT=0);
            disT>=maxT&&(disT=maxT);
            el.style.height=param.height+param.top-disT+"px";
            el.style.top=disT+"px"
        }else {
            let disY=param.height+move.clientY-down.clientY;
            let maxW=param.maxH-param.top;
            disY<=20&&(disY=20);
            disY>=maxW&&(disY=maxW);
            el.style.height=disY-2+"px"
        }
    }
const name=[  //el 当前子元素
    {name:'LandR',cursor:'w-resize',action(el,down,move,param){
        moveEvent(el,down,move,param,true,false)
    }},
    {name:'Tandb',cursor:'n-resize',action(el,down,move,param){
        moveEvent(el,down,move,param,false,true)
    }},
    {name:'b_r',cursor:'nw-resize',action(el,down,move,param){
        moveEvent(el,down,move,param,true,true)
    }},
    {name:'l_t',cursor:'nw-resize',action(el,down,move,param){
        moveEvent(el,down,move,param,true,true)
    }},
    {name:'t_r',cursor:'ne-resize',action(el,down,move,param){
        moveEvent(el,down,move,param,true,true)
    }},
    {name:'b_l',cursor:'ne-resize',action(el,down,move,param){
        moveEvent(el,down,move,param,true,true)
    }},
    {name:'move',cursor:'move',action(el,down,move,param){
        let disX=param.left-down.clientX+move.clientX;
        let disY=param.top-down.clientY+move.clientY;
        disX<=0&&(disX=0);
        disX>=param.maxL&&(disX=param.maxL);
        el.style.left=disX+'px';
        disY<=0&&(disY=0);
        disY>=param.maxT&&(disY=param.maxT);
        el.style.top=disY+'px';
    }},
    {name:'auto',cursor:'auto',action(){
        //无事件
    }},
]
export default function(Vue){
    Vue.directive('enlarge', {
        bind(el, bind, vnode){ // 8面拖拽  利用事件冒泡

            Object.assign(el.style,{position:'relative',top:0,left:0});
            // 手势
           let  children=Array.prototype.slice.call(el.children)
            if(children.length){
                children.forEach(row=>{
                    row.onmouseenter=(enm)=>{
                        row.style.cursor=get_position(row,enm)
                    };
                    row.onmousemove=(enm)=>{
                        row.style.cursor =get_position(row,enm);
                    } ;
                    row.onmouseout=(enm)=>{
                        row.style.cursor ='auto';
                        document.onmousemove=null;
                    };
                })
            }
            el.addEventListener('mousedown',function (e) {
                if(e.target!==el){
                    e.stopPropagation();
                    e.preventDefault();
                    children.forEach(row=>{
                      row.style.zIndex=1;
                    });
                    let path=Array.prototype.slice.call(e.path);
                    let index=  path.findIndex(row=>{return row===el;});
                    let cursor=path[index-1].style.cursor;
                    path[index-1].style.zIndex=9;
                    let find=name.find(item=>{
                        return item.cursor===cursor
                    });
                    let  param={
                        maxW:el.offsetWidth,
                        maxH:el.offsetHeight,
                        minW:20,
                        minH:20,
                        maxL:el.offsetWidth - path[index-1].offsetWidth,
                        maxT:el.offsetHeight - path[index-1].offsetHeight,
                        width:path[index-1].offsetWidth,
                        height:path[index-1].offsetHeight,
                        left:parseInt(path[index-1].offsetLeft),
                        top:parseInt(path[index-1].offsetTop),
                    };
                    el.onmousemove=debounce(0,(enms)=>{
                        find.action.call(find,path[index-1],e,enms,param)
                    });
                }
            });
            document.onmouseup=function(){
                el.onmousemove=null;
                }
        } ,
        unbind(el, bind){
        },
    })
};
   function get_position(el,e){
         let style=window.getComputedStyle(el);
    let width=parseInt(style.width)+2*parseInt(style.borderWidth),
        height=parseInt(style.height)+2*parseInt(style.borderWidth),
        layerX=e.layerX,layerY=e.layerY;
    if((layerX>=0&&layerX<=5)){
        if(layerY>=0&&layerY<=5){
            return 'nw-resize'
        }else if((height-layerY)>=0&&(height-layerY)<=5){
            return  'ne-resize'
        }else {
            return ' w-resize'
        }
    }else if((width-layerX)>=0&&(width-layerX)<=5){
        if(layerY>=0&&layerY<=5){
            return 'ne-resize'
        }else if((height-layerY)>=0&&(height-layerY)<=5){
            return  'nw-resize'
        }else {
            return ' w-resize'
        }
    } else {
        if((layerY>=0&&layerY<=5)||((height-layerY)>=0&&(height-layerY)<=5)){
            return 'n-resize'
        }else {
            return 'move'
        }
    }
};